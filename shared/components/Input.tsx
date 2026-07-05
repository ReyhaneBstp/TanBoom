import * as React from "react";
import { cn } from "@/shared/utils/mergeClasses"; 

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[1.6rem] border border-primary/20 bg-white/55 px-4 py-2 text-sm text-foreground shadow-inner shadow-white/40 outline-none backdrop-blur-xl transition placeholder:text-muted-foreground/70 focus:border-primary-300 focus:ring-4 focus:ring-primary-200/45 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };