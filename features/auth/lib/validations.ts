import { z } from "zod";

export const mobileSchema = z
  .string()
  .trim()
  .regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید.");

export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{5,6}$/, "کد تأیید باید ۵ یا ۶ رقم باشد.");

export const sendOtpSchema = z.object({
  mobile: mobileSchema,
});

export const verifyOtpSchema = z.object({
  mobile: mobileSchema,
  otp: otpSchema,
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
