"use server";

import {
  getGarmentParts as getGarmentPartsRecords,
  type GarmentPartRecord,
  type GarmentPartType,
} from "@/server/services/garment-parts-service";
import type { Gender } from "@/features/design/types/design";

export async function getGarmentParts(params: {
  gender: Gender;
  partType: GarmentPartType;
  baseKey?: string | null;
}): Promise<GarmentPartRecord[]> {
  return getGarmentPartsRecords(params);
}