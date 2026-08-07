"use client";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateUrl } from "./useUpdateUrl";

export function useStepGarmentUrl() {
  const searchParams = useSearchParams();
  const updateUrl = useUpdateUrl();
  const garmentParam = searchParams.get("garment");
  const garmentTypeId = garmentParam || null;

  const setGarment = useCallback(
    (id: string) => updateUrl({ garment: id }),
    [updateUrl]
  );

  return { garmentTypeId, setGarment };
}