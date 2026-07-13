"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import {
  registerUser,
  validateLoginInput,
} from "@/server/services/auth-service";

export type AuthActionState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const result = await registerUser({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!result.success) {
    return result;
  }

  return {
    success: true,
    message: "ثبت‌نام با موفقیت انجام شد.",
  };
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const callbackUrl = String(formData.get("callbackUrl") ?? "/");
  const loginResult = validateLoginInput({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    rememberMe: formData.get("rememberMe") === "on",
  });

  if (!loginResult.success) {
    return loginResult;
  }

  try {
    await signIn("credentials", {
      email: loginResult.data.email,
      password: loginResult.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "ایمیل یا رمز عبور نادرست است.",
      };
    }
    throw error;
  }

  redirect(callbackUrl);
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/",
  });
}