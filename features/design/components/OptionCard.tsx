import { cn } from "@/shared/utils/mergeClasses";
import type { ReactNode } from "react";
import { HiOutlineCheck } from "react-icons/hi2";

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
        "group relative flex w-full flex-col items-start justify-start overflow-hidden rounded-xl border border-primary-300/50 bg-white p-4 text-right transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        selected && "border-primary-300/80 bg-primary-50/60 shadow-md shadow-primary-200/20 ring-2 ring-primary-300/40",
        className
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {icon && <span className="text-2xl text-primary-600">{icon}</span>}
            {title}
          </span>
          {description && (
            <span className="text-sm leading-6 text-muted-foreground">
              {description}
            </span>
          )}
        </div>

        {selected && (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-600/80 text-white shadow-sm">
            <HiOutlineCheck className="size-4" />
          </span>
        )}
      </div>

      {children && <div className="relative mt-3 w-full">{children}</div>}
    </button>
  );
}