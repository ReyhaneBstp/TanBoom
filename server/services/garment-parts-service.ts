import { RecordModel } from "pocketbase";
import { getPocketBase } from "@/server/pocketbase/pocketbase";
import { getDesignFileUrl } from "@/server/services/design-service";
import type { Gender } from "@/features/design/types/design";

export type GarmentPartType = "base" | "neckline" | "sleeve";

export type GarmentPartRecord = {
  id: string;
  partType: GarmentPartType;
  name: string;
  label: string;
  genders: Gender[];
  baseKey: string | null;
  image: string | null;
};

const GENDER_TOKENS = new Set<Gender>(["men", "women"]);

function mapGenders(value: unknown): Gender[] {
  if (!Array.isArray(value)) return [];
  return value.filter((g): g is Gender => GENDER_TOKENS.has(g as Gender));
}

function mapGarmentPart(
  pb: Awaited<ReturnType<typeof getPocketBase>>,
  record: RecordModel
): GarmentPartRecord {
  return {
    id: record.id,
    partType: record.partType,
    name: record.name,
    label: record.label,
    genders: mapGenders(record.genders),
    baseKey: record.baseKey || null,
    image: getDesignFileUrl(pb, record, record.image),
  };
}

/**
 * دریافت بخش‌های لباس برای جنسیت انتخاب‌شده.
 * تصاویر مشترک (genders شامل هر دو) برای هر دو جنسیت برگردانده می‌شوند.
 * در صورت مشخص بودن baseKey، فقط پایه‌های همان نوع لباس فیلتر می‌شوند.
 */
export async function getGarmentParts(params: {
  gender: Gender;
  baseKey?: string | null;
}): Promise<GarmentPartRecord[]> {
  const pb = await getPocketBase();

  const records = await pb.collection("garment_parts").getFullList({
    filter: pb.filter("genders ?~ {:gender}", { gender: params.gender }),
    sort: "partType,name",
  });

  const mapped = records.map((record) => mapGarmentPart(pb, record));


  return mapped.filter((part) => {
    if (part.partType !== "base") return true;
    if (!params.baseKey) return false;
    return part.baseKey === params.baseKey;
  });
}
