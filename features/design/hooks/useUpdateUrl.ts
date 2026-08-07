"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useUpdateUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });
      router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return updateUrl;
}