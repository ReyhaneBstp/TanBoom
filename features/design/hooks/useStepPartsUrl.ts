"use client";
import { useCallback } from "react";
import { useCompressedParam } from "./useCompressedParam";
import type {
  GarmentPartType,
  SelectedGarmentPart,
} from "@/features/design/types/design";

export function useStepPartsUrl() {
  const { getValue, setValue } = useCompressedParam("parts");

  const selectedParts =
    getValue<Partial<Record<GarmentPartType, SelectedGarmentPart>>>() ?? {};

  const setPart = useCallback(
    (partType: GarmentPartType, part: SelectedGarmentPart) => {
      const updated = { ...selectedParts, [partType]: part };
      setValue(updated);
    },
    [selectedParts, setValue]
  );

  const clearPart = useCallback(
    (partType: GarmentPartType) => {
      const { [partType]: _, ...rest } = selectedParts;
      setValue(Object.keys(rest).length > 0 ? rest : null);
    },
    [selectedParts, setValue]
  );

  return { selectedParts, setPart, clearPart };
}