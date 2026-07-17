import {
  createPocketBaseClient,
  getPocketBase,
  isPbNotFound,
} from "@/server/pocketbase/pocketbase";
import { RegisterInput } from "@/features/auth/lib/validations";

export async function findUserByEmail(email: string) {
  const pb = await getPocketBase();

  try {
    return await pb
      .collection("users")
      .getFirstListItem(
        pb.filter("email = {:email}", { email: email.toLowerCase() })
      );
  } catch (error) {
    if (isPbNotFound(error)) {
      return null;
    }
    throw error;
  }
}

export async function createUser(data: RegisterInput) {
  const pb = await getPocketBase();

  // پاکت‌بیس خودش رمز عبور را هش می‌کند
  const user = await pb.collection("users").create({
    name: data.name.trim(),
    email: data.email.toLowerCase(),
    phone: data.phone.trim(),
    password: data.password,
    passwordConfirm: data.confirmPassword,
    emailVisibility: true,
  });

  return {
    id: user.id,
    name: user.name as string,
    email: user.email as string,
    createdAt: user.created as string,
    updatedAt: user.updated as string,
  };
}

export async function authenticateUser(email: string, password: string) {
  // کلاینت جداگانه تا وضعیت لاگین کاربر با کلاینت سرویس قاطی نشود
  const pb = createPocketBaseClient();

  try {
    const { record } = await pb
      .collection("users")
      .authWithPassword(email.toLowerCase(), password);

    return {
      id: record.id,
      name: record.name as string,
      email: record.email as string,
    };
  } catch {
    return null;
  } finally {
    pb.authStore.clear();
  }
}
