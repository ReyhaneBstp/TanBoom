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

export async function getGarmentParts(params: {
  gender: Gender;
  partType: GarmentPartType;
  baseKey?: string | null;
}): Promise<GarmentPartRecord[]> {
  const pb = await getPocketBase();

  if (params.partType === "base" && !params.baseKey) {
    return [];
  }

  const genderCondition =
    params.gender === "men"
      ? `(genders = '["men"]' || genders = '["men","women"]')`
      : `(genders = '["women"]' || genders = '["men","women"]')`;

  const conditions: string[] = [
    genderCondition,
    `partType = "${params.partType}"`,
  ];

  if (params.partType === "base" && params.baseKey) {
    conditions.push(`baseKey = "${params.baseKey}"`);
  }

  const filter = conditions.join(" && ");

  const records = await pb.collection("garment_parts").getFullList({
    filter: filter,
    sort: "name",
  });

  return records.map((record) => mapGarmentPart(pb, record));
}