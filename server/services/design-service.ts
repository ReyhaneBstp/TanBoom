import { RecordModel } from "pocketbase";
import { getPocketBase, isPbNotFound } from "@/server/pocketbase/pocketbase";

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

/**
 * تبدیل تصویر ورودی (data URL یا لینک) به فایل،
 * تا در آبجکت استورج پاکت‌بیس آپلود شود.
 */
async function toImageFile(source: string, name: string): Promise<File> {
  if (source.startsWith("data:")) {
    const match = source.match(/^data:(image\/[a-z+.-]+);base64,(.+)$/);
    if (!match) {
      throw new Error("فرمت تصویر نامعتبر است");
    }
    const [, mimeType, base64] = match;
    const buffer = Buffer.from(base64, "base64");
    const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
    return new File([buffer], `${name}.${ext}`, { type: mimeType });
  }

  // لینک خارجی: دانلود و تبدیل به فایل
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error("دریافت تصویر ممکن نشد");
  }
  const mimeType = response.headers.get("content-type") ?? "image/png";
  const buffer = Buffer.from(await response.arrayBuffer());
  const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  return new File([buffer], `${name}.${ext}`, { type: mimeType });
}

/** ساخت آدرس فایل رکورد در پاکت‌بیس؛ اگر فایلی نباشد null برمی‌گرداند. */
export function getDesignFileUrl(
  pb: Awaited<ReturnType<typeof getPocketBase>>,
  record: { [key: string]: any },
  filename: unknown
): string | null {
  if (typeof filename !== "string" || !filename) return null;
  return pb.files.getURL(record as RecordModel, filename);
}

function mapDesign(
  pb: Awaited<ReturnType<typeof getPocketBase>>,
  record: RecordModel
): DesignRecord {
  return {
    id: record.id,
    title: record.title,
    frontImage: getDesignFileUrl(pb, record, record.frontImage) ?? "",
    backImage: getDesignFileUrl(pb, record, record.backImage),
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

  const frontFile = await toImageFile(data.frontImage, "front");
  const backFile = data.backImage
    ? await toImageFile(data.backImage, "back")
    : null;

  const record = await pb.collection("designs").create({
    title: data.title,
    frontImage: frontFile,
    backImage: backFile,
    isPublic: data.isPublic,
    user: data.userId,
  });

  return mapDesign(pb, record);
}

export async function getDesignById(id: string) {
  const pb = await getPocketBase();

  try {
    const record = await pb.collection("designs").getOne(id);
    return mapDesign(pb, record);
  } catch (error) {
    if (isPbNotFound(error)) {
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

  return records.map((record) => mapDesign(pb, record));
}

export async function updateDesign(
  id: string,
  data: Partial<{ title: string; isPublic: boolean }>
) {
  const pb = await getPocketBase();

  const record = await pb.collection("designs").update(id, data);
  return mapDesign(pb, record);
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

  return records.map((record) => mapDesign(pb, record));
}
