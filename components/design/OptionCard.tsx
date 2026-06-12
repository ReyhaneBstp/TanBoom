import type { ReactNode } from "react";
import { HiOutlineCheck } from "react-icons/hi2";
import { cn } from "@/lib/utils";

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
        "group relative flex min-h-24 w-full flex-col items-start justify-between overflow-hidden rounded-[1.5rem] border border-rose-100/70 bg-white p-4 text-right transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-rose-200/60 hover:shadow-md",
        selected && "border-rose-200/80 bg-rose-50/70 shadow-sm",
        className
      )}
    >
      <span className="relative flex w-full items-start justify-between gap-3">
        <span className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {description ? (
            <span className="text-xs leading-6 text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
        {icon ? (
          <span className="text-2xl text-rose-500">{icon}</span>
        ) : null}
      </span>
      {children ? (
        <span className="relative mt-3 w-full">{children}</span>
      ) : null}
      {selected ? (
        <span className="absolute bottom-3 left-3 flex size-6 items-center justify-center rounded-full bg-rose-300 text-white shadow-sm">
          <HiOutlineCheck className="size-4" />
        </span>
      ) : null}
    </button>
  );
}