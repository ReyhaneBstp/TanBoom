import {
  sendOtpSchema,
  verifyOtpSchema,
} from "@/features/auth/lib/validations";
import {
  createOtpForMobile,
  verifyOtpForMobile,
} from "@/server/services/otp-service";
import { sendVerificationSms } from "@/server/services/sms-service";
import {
  createMobileUser,
  findUserByMobile,
  type AuthUser,
} from "@/server/services/user-service";

export type RequestOtpResponse = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  retryAfterMs?: number;
};

/**
 * درخواست ارسال کد: اعتبارسنجی شماره، ساخت کد یک‌بارمصرف و ارسال آن از طریق پیامک.
 * کد هرگز به لایه‌ی بالاتر (اکشن/فرانت‌اند) برنمی‌گردد.
 */
export async function requestOtp(input: {
  mobile: string;
}): Promise<RequestOtpResponse> {
  const parsed = sendOtpSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "شماره موبایل نامعتبر است.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { mobile } = parsed.data;

  const otpResult = await createOtpForMobile(mobile);
  if (!otpResult.success) {
    return {
      success: false,
      message: otpResult.message,
      retryAfterMs: otpResult.retryAfterMs,
    };
  }

  const smsResult = await sendVerificationSms(mobile, otpResult.code);
  if (!smsResult.success) {
    return { success: false, message: smsResult.message };
  }

  return { success: true, message: "کد تأیید ارسال شد." };
}

/**
 * تأیید کد و تشخیص کاربر: در صورت وجود شماره، همان کاربر برگردانده می‌شود؛
 * در غیر این صورت کاربر جدید ساخته می‌شود. هرگز کاربر تکراری ساخته نمی‌شود.
 */
export async function verifyOtpAndResolveUser(input: {
  mobile: string;
  otp: string;
}): Promise<AuthUser | null> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }

  const { mobile, otp } = parsed.data;

  const verification = await verifyOtpForMobile(mobile, otp);
  if (!verification.success) {
    return null;
  }

  const existing = await findUserByMobile(mobile);
  if (existing) {
    return existing;
  }

  return createMobileUser(mobile);
}
