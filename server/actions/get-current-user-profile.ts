"use server";

import { auth } from "@/auth";
import { getUserById } from "@/server/services/user-service";

export async function getCurrentUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return getUserById(session.user.id);
}