import type { ReactNode } from "react";
import { HiOutlineCheck } from "react-icons/hi2";
import { cn } from "@/shared/utils/utils";

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick: () => void;
  className?: string;
  children?: ReactNode;
}

export function OptionCard({
  title,
  description,
  icon,
  selected,
  onClick,
  className,
  children,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col items-start justify-start overflow-hidden rounded-[1.5rem] border border-primary-100/70 bg-white p-4 text-right transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary-200/60 hover:shadow-md",
        selected && "border-primary-200/80 bg-primary-50/70 shadow-sm",
        className
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {icon && <span className="text-2xl text-primary-400">{icon}</span>}
            {title}
          </span>
          {description && (
            <span className="text-xs leading-6 text-muted-foreground">
              {description}
            </span>
          )}
        </div>

        {selected && (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-400/90 text-white shadow-sm">
            <HiOutlineCheck className="size-4" />
          </span>
        )}
      </div>

      {children && <div className="relative mt-3 w-full">{children}</div>}
    </button>
  );
}