"use client";

import Link from "next/link";
import { useFormState } from "react-dom";       
import { useFormStatus } from "react-dom";
import { loginAction, type AuthActionState } from "@/server/actions/auth-actions";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Label } from "@/shared/components/Label";
import { PasswordField } from "@/features/auth/components/PasswordField";

const initialState: AuthActionState = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "در حال ورود..." : "ورود"}
    </Button>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />

      <div className="space-y-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" required />
        {state.fieldErrors?.email?.[0] ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <PasswordField id="password" name="password" placeholder="رمز عبور" required />
        {state.fieldErrors?.password?.[0] ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input
            type="checkbox"
            name="rememberMe"
            className="size-4 rounded border border-primary/20 accent-accent"
          />
          مرا به خاطر بسپار
        </label>
        <Link
          href="/forgot-password"
          className="text-primary-600 transition-colors hover:text-primary-700"
        >
          فراموشی رمز عبور
        </Link>
      </div>

      {state.message ? (
        <p className="text-sm text-rose-600">{state.message}</p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        حساب ندارید؟{" "}
        <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">
          ثبت‌نام
        </Link>
      </p>
    </form>
  );
}
