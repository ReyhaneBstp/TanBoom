import { cn } from "@/shared/utils/mergeClasses";
import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const faToEnDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, inputMode, ...props }, ref) => {
    const isNumber = type === "number";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumber) {
        e.target.value = faToEnDigits(e.target.value);
      }

      onChange?.(e);
    };

    return (
      <input
        ref={ref}
        type={isNumber ? "text" : type}
        inputMode={isNumber ? "numeric" : inputMode}
        className={cn(
          "flex h-12 w-full rounded-md bg-white/60 border border-primary-200 bg-white/55 px-4 py-2 text-sm text-foreground shadow-inner shadow-white/40 outline-none backdrop-blur-xl transition placeholder:text-muted-foreground/70 focus:border-primary-300 focus:ring-4 focus:ring-primary-200/45 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };