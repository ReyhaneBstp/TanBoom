import { ClientResponseError, RecordModel } from "pocketbase";
import { getPocketBase } from "@/server/pocketbase/pocketbase";

export type DesignRecord = {
  id: string;
  title: string;
  frontImage: string;
  backImage: string | null;
  isPublic: boolean;
  userId: string;
  creatorName: string | null;
  createdAt: string;
};

function mapDesign(record: RecordModel): DesignRecord {
  return {
    id: record.id,
    title: record.title,
    frontImage: record.frontImage,
    backImage: record.backImage || null,
    isPublic: Boolean(record.isPublic),
    userId: record.user,
    creatorName: record.expand?.user?.name ?? null,
    createdAt: record.created,
  };
}

export async function createDesign(data: {
  userId: string;
  title: string;
  frontImage: string;
  backImage?: string;
  isPublic: boolean;
}) {
  const pb = await getPocketBase();

  const record = await pb.collection("designs").create({
    title: data.title,
    frontImage: data.frontImage,
    backImage: data.backImage ?? "",
    isPublic: data.isPublic,
    user: data.userId,
  });

  return mapDesign(record);
}

export async function getDesignById(id: string) {
  const pb = await getPocketBase();

  try {
    const record = await pb.collection("designs").getOne(id);
    return mapDesign(record);
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getUserDesigns(userId: string) {
  const pb = await getPocketBase();

  const records = await pb.collection("designs").getFullList({
    filter: pb.filter("user = {:userId}", { userId }),
    sort: "-created",
  });

  return records.map(mapDesign);
}

export async function updateDesign(
  id: string,
  data: Partial<{ title: string; isPublic: boolean }>
) {
  const pb = await getPocketBase();

  const record = await pb.collection("designs").update(id, data);
  return mapDesign(record);
}

export async function deleteDesign(id: string) {
  const pb = await getPocketBase();

  await pb.collection("designs").delete(id);
}

export async function getPublicDesigns() {
  const pb = await getPocketBase();

  const records = await pb.collection("designs").getFullList({
    filter: "isPublic = true",
    sort: "-created",
    expand: "user",
  });

  return records.map(mapDesign);
}
