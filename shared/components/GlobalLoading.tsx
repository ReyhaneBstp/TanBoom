"use client";

import { HiOutlineArrowPath } from "react-icons/hi2";
import { useGlobalStore } from "../store/useGlobalStore";


export function GlobalLoading() {
  const isLoading = useGlobalStore((s) => s.isLoading);
  const loadingText = useGlobalStore((s) => s.loadingText);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/90 px-8 py-8 shadow-soft-primary backdrop-blur-xl">
        <HiOutlineArrowPath className="size-8 animate-spin text-primary-500" />
        <p className="text-sm font-medium text-muted-foreground">
          {loadingText}
        </p>
      </div>
    </div>
  );
}