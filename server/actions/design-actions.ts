"use server";

import { auth } from "@/auth";
import { createDesign, getDesignById } from "@/server/services/design-service";
import {
  createOrder as createOrderRecord,
  getOrderById,
  updateOrderStatus as updateOrderStatusRecord,
} from "@/server/services/order-service";
import { revalidatePath } from "next/cache";

export async function saveDesignToDashboard(data: {
  title: string;
  frontImage: string;
  backImage?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("لطفاً وارد شوید");

  const design = await createDesign({
    title: data.title,
    frontImage: data.frontImage,
    backImage: data.backImage,
    isPublic: false,
    userId: session.user.id,
  });

  revalidatePath("/dashboard");
  return { success: true, designId: design.id };
}

export async function publishDesignToGallery(data: {
  title: string;
  frontImage: string;
  backImage?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("لطفاً وارد شوید");

  const design = await createDesign({
    title: data.title,
    frontImage: data.frontImage,
    backImage: data.backImage,
    isPublic: true,
    userId: session.user.id,
  });

  revalidatePath("/gallery");
  return { success: true, designId: design.id };
}

export async function createOrder(data: {
  designId: string;
  size: string;
  quantity?: number;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("لطفاً وارد شوید");

  const design = await getDesignById(data.designId);
  if (!design || design.userId !== session.user.id) {
    throw new Error("طرح مورد نظر یافت نشد یا دسترسی ندارید");
  }

  const order = await createOrderRecord({
    size: data.size,
    quantity: data.quantity ?? 1,
    notes: data.notes,
    designId: design.id,
    userId: session.user.id,
  });

  revalidatePath("/dashboard");
  return { success: true, orderId: order.id };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("لطفاً وارد شوید");

  const order = await getOrderById(orderId);
  if (!order || order.userId !== session.user.id) {
    throw new Error("سفارش مورد نظر یافت نشد یا دسترسی ندارید");
  }

  const updated = await updateOrderStatusRecord(orderId, status);

  revalidatePath("/dashboard");
  return { success: true, status: updated.status };
}
