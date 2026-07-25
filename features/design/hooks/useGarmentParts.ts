"use client";

import { useEffect, useMemo, useState } from "react";
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

  const [parts, setParts] = useState<GarmentPartRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const baseKey = garmentTypeId ? GARMENT_BASE_KEY[garmentTypeId] ?? null : null;

  const categories = useMemo<GarmentPartType[]>(() => {
    if (!garmentTypeId) return [];
    const category: MeasurementCategory =
      GARMENT_MEASUREMENT_CATEGORY[garmentTypeId] ?? "upper_body";
    return GARMENT_PART_CATEGORIES[category] ?? [];
  }, [garmentTypeId]);

  useEffect(() => {
    if (!gender || !garmentTypeId) {
      setParts([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    getGarmentParts({ gender, baseKey })
      .then((result) => {
        if (!cancelled) setParts(result);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setError(true);
          setParts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gender, garmentTypeId, baseKey]);

  // فقط دسته‌هایی که هم مجازند و هم واقعاً گزینه دارند نمایش داده می‌شوند.
  const partsByCategory = useMemo(() => {
    const grouped = {} as Record<GarmentPartType, GarmentPartRecord[]>;
    for (const category of categories) {
      const items = parts.filter((p) => p.partType === category);
      if (items.length > 0) grouped[category] = items;
    }
    return grouped;
  }, [categories, parts]);

  const availableCategories = useMemo(
    () => categories.filter((c) => (partsByCategory[c]?.length ?? 0) > 0),
    [categories, partsByCategory]
  );

  return { partsByCategory, availableCategories, loading, error };
}
