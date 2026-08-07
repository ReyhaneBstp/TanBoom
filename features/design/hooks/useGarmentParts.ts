"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  GARMENT_BASE_KEY,
  GARMENT_MEASUREMENT_CATEGORY,
  GARMENT_PART_CATEGORIES,
} from "@/features/design/definitions/design-options";
import type {
  GarmentPartType,
  MeasurementCategory,
} from "@/features/design/types/design";
import type { Gender } from "@/features/design/types/design";
import { getGarmentParts } from "@/server/actions/garment-parts-actions";
import type { GarmentPartRecord } from "@/server/services/garment-parts-service";

export function useGarmentParts(
  gender: Gender | null,
  garmentTypeId: string | null
) {
  const latestGenderRef = useRef(gender);
  const latestGarmentTypeRef = useRef(garmentTypeId);
  latestGenderRef.current = gender;
  latestGarmentTypeRef.current = garmentTypeId;

  const baseKey = garmentTypeId
    ? (GARMENT_BASE_KEY[garmentTypeId] ?? null)
    : null;

  const availableCategories = useMemo<GarmentPartType[]>(() => {
    if (!garmentTypeId) return [];
    const category: MeasurementCategory =
      GARMENT_MEASUREMENT_CATEGORY[garmentTypeId] ?? "upper_body";
    return GARMENT_PART_CATEGORIES[category] ?? [];
  }, [garmentTypeId]);

  const [partsCache, setPartsCache] = useState<
    Partial<Record<GarmentPartType, GarmentPartRecord[]>>
  >({});
  const [loadingCategory, setLoadingCategory] =
    useState<GarmentPartType | null>(null);
  const [errorCategory, setErrorCategory] =
    useState<GarmentPartType | null>(null);

  const fetchPartsForCategory = useCallback(
    async (partType: GarmentPartType) => {
      const currentGender = latestGenderRef.current;
      const currentGarment = latestGarmentTypeRef.current;
      if (!currentGender || !currentGarment) return [];

      if (partsCache[partType]) {
        return partsCache[partType]!;
      }

      if (partType === "base" && !baseKey) {
        setPartsCache((prev) => ({ ...prev, base: [] }));
        return [];
      }

      setLoadingCategory(partType);
      setErrorCategory(null);

      try {
        const result = await getGarmentParts({
          gender: currentGender,
          partType,
          baseKey: partType === "base" ? baseKey : null,
        });

        if (
          latestGenderRef.current === currentGender &&
          latestGarmentTypeRef.current === currentGarment
        ) {
          setPartsCache((prev) => ({ ...prev, [partType]: result }));
          return result;
        } else {
          return [];
        }
      } catch (err) {
        console.error(err);
        if (
          latestGenderRef.current === currentGender &&
          latestGarmentTypeRef.current === currentGarment
        ) {
          setErrorCategory(partType);
          setPartsCache((prev) => ({ ...prev, [partType]: [] }));
        }
        return [];
      } finally {
        if (
          latestGenderRef.current === currentGender &&
          latestGarmentTypeRef.current === currentGarment
        ) {
          setLoadingCategory(null);
        }
      }
    },
    [baseKey, partsCache]
  );

  const resetCache = useCallback(() => {
    setPartsCache({});
    setLoadingCategory(null);
    setErrorCategory(null);
  }, []);

  return {
    availableCategories,
    partsCache,
    fetchPartsForCategory,
    loadingCategory,
    errorCategory,
    resetCache,
    baseKey,
  };
}