import { cn } from "@/shared/utils/mergeClasses"; 
import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-medium leading-6 text-foreground/80",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };