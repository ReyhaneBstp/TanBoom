"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import { HiOutlineSparkles } from "react-icons/hi2";

interface EmptyStateProps {
  icon: IconType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-primary-200 bg-white/45 px-6 py-16 text-center backdrop-blur-xl">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary-100/80">
        <Icon className="size-8 text-primary-500" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.03]"
        >
          <HiOutlineSparkles className="size-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
