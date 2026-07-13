"use server";

import { auth } from "@/auth";
import { prisma } from "@/server/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function saveDesignToDashboard(data: {
  title: string;
  frontImage: string;
  backImage?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("لطفاً وارد شوید");

  const design = await prisma.design.create({
    data: {
      title: data.title,
      frontImage: data.frontImage,
      backImage: data.backImage ?? null,
      isPublic: false,
      userId: session.user.id,
    },
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

  const design = await prisma.design.create({
    data: {
      title: data.title,
      frontImage: data.frontImage,
      backImage: data.backImage ?? null,
      isPublic: true,
      userId: session.user.id,
    },
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

  const design = await prisma.design.findUnique({
    where: { id: data.designId },
  });
  if (!design || design.userId !== session.user.id) {
    throw new Error("طرح مورد نظر یافت نشد یا دسترسی ندارید");
  }

  const order = await prisma.order.create({
    data: {
      size: data.size,
      quantity: data.quantity ?? 1,
      notes: data.notes ?? null,
      designId: design.id,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, orderId: order.id };
}