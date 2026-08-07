"use client";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import LZString from "lz-string";
import { useUpdateUrl } from "./useUpdateUrl";

export function useCompressedParam(key: string) {
  const searchParams = useSearchParams();
  const updateUrl = useUpdateUrl();

  const raw = searchParams.get(key);

  const getValue = useCallback(<T = any>(): T | null => {
    if (!raw) return null;
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(raw);
      return decompressed ? JSON.parse(decompressed) : null;
    } catch {
      return null;
    }
  }, [raw]);

  const setValue = useCallback(
    <T = any>(value: T | null) => {
      if (value === null || value === undefined) {
        updateUrl({ [key]: null });
      } else {
        const json = JSON.stringify(value);
        const compressed = LZString.compressToEncodedURIComponent(json);
        updateUrl({ [key]: compressed });
      }
    },
    [key, updateUrl]
  );

  return { getValue, setValue };
}