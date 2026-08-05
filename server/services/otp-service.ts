import "server-only";

import { createHmac } from "crypto";
import { getPocketBase, isPbNotFound } from "@/server/pocketbase/pocketbase";

const OTP_LENGTH = 6;
export const OTP_TTL_MS = 2 * 60 * 1000; 
export const OTP_RESEND_COOLDOWN_MS = 2 * 60 * 1000; 

const HASH_SECRET =
  process.env.AUTH_SECRET ?? "tanboom-otp-fallback-secret";

function generateNumericOtp(): string {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

function hashOtp(mobile: string, code: string): string {
  return createHmac("sha256", HASH_SECRET)
    .update(`${mobile}:${code}`)
    .digest("hex");
}

type OtpRecord = {
  id: string;
  mobile: string;
  codeHash: string;
  expires: string;
  consumed: boolean;
  created: string;
};

async function getLatestOtp(
  pb: Awaited<ReturnType<typeof getPocketBase>>,
  mobile: string
): Promise<OtpRecord | null> {
  try {
    const list = await pb.collection("otp_codes").getList(1, 1, {
      filter: pb.filter("mobile = {:mobile}", { mobile }),
      sort: "-created",
    });
    return (list.items[0] as unknown as OtpRecord) ?? null;
  } catch (error) {
    if (isPbNotFound(error)) return null;
    throw error;
  }
}

async function deleteAllForMobile(
  pb: Awaited<ReturnType<typeof getPocketBase>>,
  mobile: string
): Promise<void> {
  const list = await pb.collection("otp_codes").getFullList({
    filter: pb.filter("mobile = {:mobile}", { mobile }),
  });
  await Promise.all(
    list.map((record) => pb.collection("otp_codes").delete(record.id))
  );
}

export type RequestOtpResult =
  | { success: true; code: string }
  | { success: false; message: string; retryAfterMs?: number };


export async function createOtpForMobile(
  mobile: string
): Promise<RequestOtpResult> {
  const pb = await getPocketBase();


  const latest = await getLatestOtp(pb, mobile);
  if (latest) {
    const elapsed = Date.now() - new Date(latest.created).getTime();
    if (elapsed < OTP_RESEND_COOLDOWN_MS) {
      return {
        success: false,
        message: "کمی صبر کنید و سپس دوباره درخواست دهید.",
        retryAfterMs: OTP_RESEND_COOLDOWN_MS - elapsed,
      };
    }
  }

  await deleteAllForMobile(pb, mobile);

  const code = generateNumericOtp();
  await pb.collection("otp_codes").create({
    mobile,
    codeHash: hashOtp(mobile, code),
    expires: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    consumed: false,
  });

  return { success: true, code };
}

export type VerifyOtpResult =
  | { success: true }
  | { success: false; message: string };


export async function verifyOtpForMobile(
  mobile: string,
  code: string
): Promise<VerifyOtpResult> {
  const pb = await getPocketBase();

  const latest = await getLatestOtp(pb, mobile);
  if (!latest || latest.consumed) {
    return { success: false, message: "کدی برای این شماره یافت نشد. دوباره درخواست دهید." };
  }

  if (Date.now() > new Date(latest.expires).getTime()) {
    await deleteAllForMobile(pb, mobile);
    return { success: false, message: "کد منقضی شده است. دوباره درخواست دهید." };
  }

  if (latest.codeHash !== hashOtp(mobile, code)) {
    return { success: false, message: "کد واردشده نادرست است." };
  }


  await deleteAllForMobile(pb, mobile);
  return { success: true };
}
