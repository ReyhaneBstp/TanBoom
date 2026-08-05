"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { requestOtp } from "@/server/services/auth-service";

export type SendOtpState = {
  success: boolean;
  message?: string;
  retryAfterMs?: number;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function sendOtpAction(mobile: string): Promise<SendOtpState> {
  return requestOtp({ mobile });
}

export type VerifyOtpState = {
  success: boolean;
  message?: string;
};

export async function verifyOtpAction(
  mobile: string,
  otp: string
): Promise<VerifyOtpState> {
  try {
    // تأیید کد و تشخیص/ساخت کاربر داخل provider انجام می‌شود
    await signIn("credentials", { mobile, otp, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "کد واردشده نادرست یا منقضی شده است.",
      };
    }
    throw error;
  }

  return { success: true };
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/",
  });
}
