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

export function OptionCard({ title, description, icon, selected, onClick, className, children }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex min-h-24 w-full flex-col items-start justify-between overflow-hidden rounded-[1.6rem] border border-white/75 bg-white/45 p-4 text-right backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-lilac-300/70 hover:bg-white/75 hover:shadow-soft-lilac",
        selected && "border-lilac-300 bg-white shadow-soft-lilac ring-4 ring-lilac-200/35",
        className
      )}
    >
      <span className="absolute -left-8 -top-8 size-20 rounded-full bg-lilac-200/30 blur-2xl transition group-hover:bg-lilac-300/40" />
      <span className="relative flex w-full items-start justify-between gap-3">
        <span className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {description ? <span className="text-xs leading-6 text-muted-foreground">{description}</span> : null}
        </span>
        {icon ? <span className="text-2xl text-lilac-500">{icon}</span> : null}
      </span>
      {children ? <span className="relative mt-3 w-full">{children}</span> : null}
      {selected ? (
        <span className="absolute bottom-3 left-3 flex size-6 items-center justify-center rounded-full bg-lilac-300 text-white">
          <HiOutlineCheck className="size-4" />
        </span>
      ) : null}
    </button>
  );
}
