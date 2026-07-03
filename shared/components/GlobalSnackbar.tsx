"use client";

import { useEffect } from "react";
import {
  HiOutlineXMark,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { useGlobalStore } from "../store/useGlobalStore";
import { cn } from "@/shared/utils/utils";

export function GlobalSnackbar() {
  const snackbar = useGlobalStore((s) => s.snackbar);
  const hideSnackbar = useGlobalStore((s) => s.hideSnackbar);

  useEffect(() => {
    if (snackbar.isVisible) {
      const timer = setTimeout(() => {
        hideSnackbar();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.isVisible, hideSnackbar]);

  if (!snackbar.isVisible) return null;

  const Icon =
    snackbar.type === "success"
      ? HiOutlineCheckCircle
      : snackbar.type === "error"
      ? HiOutlineExclamationCircle
      : HiOutlineExclamationCircle;

  const bgColor =
    snackbar.type === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : snackbar.type === "error"
      ? "bg-rose-50 border-rose-200 text-rose-700"
      : "bg-primary-50 border-primary-200 text-primary-700";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-soft-primary backdrop-blur-md",
          bgColor
        )}
      >
        <Icon className="size-5 flex-shrink-0" />
        <p className="text-sm font-medium">{snackbar.message}</p>
        <button
          onClick={hideSnackbar}
          className="ml-2 rounded-full p-1 hover:bg-black/5"
        >
          <HiOutlineXMark className="size-4" />
        </button>
      </div>
    </div>
  );
}