import { ClientResponseError, RecordModel } from "pocketbase";
import { getPocketBase } from "@/server/pocketbase/pocketbase";

export type OrderRecord = {
  id: string;
  size: string;
  quantity: number;
  notes: string | null;
  status: string;
  designId: string;
  designTitle: string | null;
  designImage: string | null;
  userId: string;
  createdAt: string;
};

function mapOrder(record: RecordModel): OrderRecord {
  return {
    id: record.id,
    size: record.size,
    quantity: record.quantity,
    notes: record.notes || null,
    status: record.status,
    designId: record.design,
    designTitle: record.expand?.design?.title ?? null,
    designImage: record.expand?.design?.frontImage ?? null,
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
}) {
  const pb = await getPocketBase();

  const record = await pb.collection("orders").create({
    size: data.size,
    quantity: data.quantity ?? 1,
    notes: data.notes ?? "",
    status: "pending",
    design: data.designId,
    user: data.userId,
  });

  return mapOrder(record);
}

export async function getOrderById(id: string) {
  const pb = await getPocketBase();

  try {
    const record = await pb.collection("orders").getOne(id, {
      expand: "design",
    });
    return mapOrder(record);
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
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

  return records.map(mapOrder);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const pb = await getPocketBase();

  const record = await pb.collection("orders").update(orderId, { status });
  return mapOrder(record);
}
