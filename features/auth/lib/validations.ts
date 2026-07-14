import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.")
  .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد.")
  .regex(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد.")
  .regex(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد.");

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "نام باید حداقل ۲ کاراکتر باشد.")
      .max(60, "نام نمی‌تواند بیشتر از ۶۰ کاراکتر باشد."),
    email: z
      .string()
      .trim()
      .email("ایمیل معتبر وارد کنید.")
      .max(120, "ایمیل معتبر وارد کنید."),
    phone: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "تکرار رمز عبور با رمز عبور یکسان نیست.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("ایمیل معتبر وارد کنید."),
  password: z.string().min(1, "رمز عبور الزامی است."),
  rememberMe: z.coerce.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
