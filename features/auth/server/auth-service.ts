import { findUserByEmail, createUser } from "@/features/auth/server/user-service";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/features/auth/lib/validations";

export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingUser = await findUserByEmail(parsed.data.email);

  if (existingUser) {
    return {
      success: false as const,
      message: "این ایمیل قبلاً ثبت شده است.",
      fieldErrors: {
        email: ["این ایمیل قبلاً ثبت شده است."],
      },
    };
  }

  const user = await createUser(parsed.data);

  return {
    success: true as const,
    message: "حساب کاربری با موفقیت ساخته شد.",
    user,
  };
}

export function validateLoginInput(input: LoginInput) {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: parsed.data,
  };
}