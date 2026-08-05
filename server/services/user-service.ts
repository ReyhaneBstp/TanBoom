import { randomBytes } from "crypto";
import { getPocketBase, isPbNotFound } from "@/server/pocketbase/pocketbase";

export type AuthUser = {
  id: string;
  name: string; 
  fullName: string | null;
  email: string;
  mobile: string;
  address: string | null;
  postalCode: string | null;
};

function toAuthUser(record: {
  id: string;
  name?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  address?: string;
  postalCode?: string;
}): AuthUser {
  return {
    id: record.id,
    name: (record.name as string) ?? "",
    fullName: (record.fullName as string) ?? null,
    email: (record.email as string) ?? "",
    mobile: (record.mobile as string) ?? "",
    address: (record.address as string) ?? null,
    postalCode: (record.postalCode as string) ?? null,
  };
}

export async function findUserByMobile(mobile: string): Promise<AuthUser | null> {
  const pb = await getPocketBase();
  try {
    const record = await pb
      .collection("users")
      .getFirstListItem(pb.filter("mobile = {:mobile}", { mobile }));
    return toAuthUser(record);
  } catch (error) {
    if (isPbNotFound(error)) return null;
    throw error;
  }
}

export async function createMobileUser(mobile: string): Promise<AuthUser> {
  const pb = await getPocketBase();
  const password = randomBytes(24).toString("hex");
  const record = await pb.collection("users").create({
    mobile,
    password,
    passwordConfirm: password,
  });
  return toAuthUser(record);
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const pb = await getPocketBase();
  try {
    const record = await pb.collection("users").getOne(id);
    return toAuthUser(record);
  } catch (error) {
    if (isPbNotFound(error)) return null;
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    fullName?: string;
    address?: string;
    postalCode?: string;
  }
): Promise<AuthUser> {
  const pb = await getPocketBase();
  const record = await pb.collection("users").update(userId, data);
  return toAuthUser(record);
}

export function isProfileCompleteForOrder(user: AuthUser): boolean {
  return !!(
    user.name?.trim() &&
    user.fullName?.trim() &&
    user.address?.trim() &&
    user.postalCode?.trim()
  );
}