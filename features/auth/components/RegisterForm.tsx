"use client";

import Link from "next/link";
import { useFormState } from "react-dom";       
import { useFormStatus } from "react-dom";
import { registerAction, type AuthActionState } from "@/server/actions/auth-actions";
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
      {pending ? "در حال ثبت‌نام..." : "ثبت‌نام"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">نام</Label>
        <Input id="name" name="name" placeholder="نام و نام خانوادگی" required />
        {state.fieldErrors?.name?.[0] ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" required />
        {state.fieldErrors?.email?.[0] ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <PasswordField id="password" name="password" placeholder="حداقل ۸ کاراکتر" required />
        {state.fieldErrors?.password?.[0] ? (
          <p className="text-sm text-rose-600">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          placeholder="تکرار رمز عبور"
          toggleLabel="نمایش تکرار رمز"
          required
        />
        {state.fieldErrors?.confirmPassword?.[0] ? (
          <p className="text-sm text-rose-600">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p className={`text-sm ${state.success ? "text-emerald-600" : "text-rose-600"}`}>
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        حساب دارید؟{" "}
        <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          ورود
        </Link>
      </p>
    </form>
  );
}
