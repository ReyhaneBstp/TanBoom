import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "min-h-28 w-full resize-none rounded-[1.6rem] border border-white/80 bg-white/55 px-4 py-4 text-sm leading-7 text-foreground shadow-inner shadow-white/40 outline-none backdrop-blur-xl transition placeholder:text-muted-foreground/70 focus:border-lilac-300 focus:ring-4 focus:ring-lilac-200/45",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
