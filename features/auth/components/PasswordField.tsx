"use client";

import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { Input, type InputProps } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";

type PasswordFieldProps = InputProps & {
  toggleLabel?: string;
};

export function PasswordField({
  toggleLabel = "نمایش رمز",
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className="pl-14"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={toggleLabel}
        onClick={() => setShowPassword((value) => !value)}
        className="absolute left-2 top-1/2 size-9 -translate-y-1/2 rounded-full px-0 py-0"
      >
        {showPassword ? (
          <HiOutlineEyeSlash className="size-4" />
        ) : (
          <HiOutlineEye className="size-4" />
        )}
      </Button>
    </div>
  );
}
