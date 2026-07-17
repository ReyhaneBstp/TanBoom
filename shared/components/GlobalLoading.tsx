"use client";

import { useGlobalStore } from "../store/useGlobalStore";
import { LoadingOverlay } from "./LoadingOverlay";

export function GlobalLoading() {
  const isLoading = useGlobalStore((s) => s.isLoading);
  const loadingText = useGlobalStore((s) => s.loadingText);

  if (!isLoading) return null;

  return <LoadingOverlay text={loadingText} />;
}
