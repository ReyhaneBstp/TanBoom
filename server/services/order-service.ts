import { RecordModel } from "pocketbase";
import { getPocketBase, isPbNotFound } from "@/server/pocketbase/pocketbase";
import { getDesignFileUrl } from "@/server/services/design-service";
import type { BodyMeasurements } from "@/features/design/types/design";

export type OrderRecord = {
  id: string;
  size: string;
  quantity: number;
  notes: string | null;
  status: string;
  measurements: BodyMeasurements | null;
  designId: string;
  designTitle: string | null;
  designImage: string | null;
  userId: string;
  createdAt: string;
};

function mapMeasurements(value: unknown): BodyMeasurements | null {
  if (!value || typeof value !== "object") return null;

  const entries = Object.entries(value as Record<string, unknown>).filter(
    ([, v]) => typeof v === "number" && Number.isFinite(v)
  );

  return entries.length > 0
    ? (Object.fromEntries(entries) as BodyMeasurements)
    : null;
}

function mapOrder(
  pb: Awaited<ReturnType<typeof getPocketBase>>,
  record: RecordModel
): OrderRecord {
  const design = record.expand?.design;

  return {
    id: record.id,
    size: record.size,
    quantity: record.quantity,
    notes: record.notes || null,
    status: record.status,
    measurements: mapMeasurements(record.measurements),
    designId: record.design,
    designTitle: design?.title ?? null,
    designImage: design ? getDesignFileUrl(pb, design, design.frontImage) : null,
    userId: record.user,
    createdAt: record.created,
  };
}

export async function createOrder(data: {
  userId: string;
  designId: string;
  size: string;
  quantity?: number;
  notes?: string;
  measurements?: BodyMeasurements;
}) {
  const pb = await getPocketBase();

  const record = await pb.collection("orders").create({
    size: data.size,
    quantity: data.quantity ?? 1,
    notes: data.notes ?? "",
    status: "pending",
    measurements: data.measurements ?? null,
    design: data.designId,
    user: data.userId,
  });

  return mapOrder(pb, record);
}

export async function getOrderById(id: string) {
  const pb = await getPocketBase();

  try {
    const record = await pb.collection("orders").getOne(id, {
      expand: "design",
    });
    return mapOrder(pb, record);
  } catch (error) {
    if (isPbNotFound(error)) {
      return null;
    }
    throw error;
  }
}

export async function getUserOrders(userId: string) {
  const pb = await getPocketBase();

  const records = await pb.collection("orders").getFullList({
    filter: pb.filter("user = {:userId}", { userId }),
    sort: "-created",
    expand: "design",
  });

  return records.map((record) => mapOrder(pb, record));
}

export async function updateOrderStatus(orderId: string, status: string) {
  const pb = await getPocketBase();

  const record = await pb.collection("orders").update(orderId, { status });
  return mapOrder(pb, record);
}
