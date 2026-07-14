import PocketBase from "pocketbase";

const POCKETBASE_URL =
  process.env.POCKETBASE_URL ?? "https://YOUR_POCKETBASE_URL_HERE";

const globalForPocketBase = globalThis as unknown as {
  pocketbase: PocketBase | undefined;
};

export function createPocketBaseClient() {
  const client = new PocketBase(POCKETBASE_URL);
  // جلوگیری از لغو خودکار درخواست‌های موازی در سمت سرور
  client.autoCancellation(false);
  return client;
}

const pb = globalForPocketBase.pocketbase ?? createPocketBaseClient();

if (process.env.NODE_ENV !== "production") {
  globalForPocketBase.pocketbase = pb;
}

/**
 * کلاینت سرویس (superuser) برای عملیات دیتابیس در سمت سرور.
 * دسترسی کاربران به داده‌های خصوصی مانند قبل در همین لایه‌ی سرور کنترل می‌شود.
 */
export async function getPocketBase() {
  if (!pb.authStore.isValid) {
    await pb
      .collection("_superusers")
      .authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL ?? "",
        process.env.POCKETBASE_ADMIN_PASSWORD ?? ""
      );
  }
  return pb;
}
