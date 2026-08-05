"use server";

import { auth } from "@/auth";
import { updateUserProfile } from "@/server/services/user-service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "نام کاربری الزامی است"),
  fullName: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "لطفاً وارد شوید." };
  }

  const raw = {
    name: (formData.get("name") as string) || "",
    fullName: (formData.get("fullName") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    postalCode: (formData.get("postalCode") as string) || undefined,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  try {
    await updateUserProfile(session.user.id, parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/design/result");
    return { success: true };
  } catch (error) {
    return { success: false, message: "خطا در به‌روزرسانی پروفایل." };
  }
}