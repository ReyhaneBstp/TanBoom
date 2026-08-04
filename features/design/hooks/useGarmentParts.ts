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
import { getGarmentParts } from "@/server/actions/garment-parts-actions";
import type { GarmentPartRecord } from "@/server/services/garment-parts-service";
import { useGenderStore } from "../store/genderStore";
import { useGarmentStore } from "../store/garmentStore";

export function useGarmentParts() {
  const gender = useGenderStore((s) => s.gender);
  const garmentTypeId = useGarmentStore((s) => s.garmentTypeId);

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
      if (!gender || !garmentTypeId) return [];

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
          gender,
          partType,
          baseKey: partType === "base" ? baseKey : null, 
        });


        if (
          latestGenderRef.current === gender &&
          latestGarmentTypeRef.current === garmentTypeId
        ) {
          setPartsCache((prev) => ({ ...prev, [partType]: result }));
          return result;
        } else {
          return [];
        }
      } catch (err) {
        console.error(err);
        if (
          latestGenderRef.current === gender &&
          latestGarmentTypeRef.current === garmentTypeId
        ) {
          setErrorCategory(partType);
          setPartsCache((prev) => ({ ...prev, [partType]: [] }));
        }
        return [];
      } finally {
        if (
          latestGenderRef.current === gender &&
          latestGarmentTypeRef.current === garmentTypeId
        ) {
          setLoadingCategory(null);
        }
      }
    },
    [gender, garmentTypeId, baseKey, partsCache]
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