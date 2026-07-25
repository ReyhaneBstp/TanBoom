"use server";

import {
  getGarmentParts as getGarmentPartsRecords,
  type GarmentPartRecord,
} from "@/server/services/garment-parts-service";
import type { Gender } from "@/features/design/types/design";

export async function getGarmentParts(params: {
  gender: Gender;
  baseKey?: string | null;
}): Promise<GarmentPartRecord[]> {
  return getGarmentPartsRecords(params);
}
