import { randomBytes } from "crypto";
import { getPocketBase, isPbNotFound } from "@/server/pocketbase/pocketbase";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  mobile: string;
};

function toAuthUser(record: {
  id: string;
  name?: string;
  email?: string;
  mobile?: string;
}): AuthUser {
  return {
    id: record.id,
    name: (record.name as string) ?? "",
    email: (record.email as string) ?? "",
    mobile: (record.mobile as string) ?? "",
  };
}

export async function findUserByMobile(
  mobile: string
): Promise<AuthUser | null> {
  const pb = await getPocketBase();

  try {
    const record = await pb
      .collection("users")
      .getFirstListItem(pb.filter("mobile = {:mobile}", { mobile }));
    return toAuthUser(record);
  } catch (error) {
    if (isPbNotFound(error)) {
      return null;
    }
    throw error;
  }
}

/**
 * ساخت کاربر جدید فقط با شماره موبایل.
 * چون ورود بدون رمز عبور است، یک رمز تصادفی امن تولید می‌شود که کاربر هرگز از آن استفاده نمی‌کند.
 */
export async function createMobileUser(mobile: string): Promise<AuthUser> {
  const pb = await getPocketBase();

  const password = randomBytes(24).toString("hex");

  const record = await pb.collection("users").create({
    mobile,
    password,
    passwordConfirm: password,
  });

  return toAuthUser(record);
}
