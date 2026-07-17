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
 * تشخیص خطای «رکورد پیدا نشد» پاکت‌بیس.
 * از instanceof استفاده نمی‌کنیم چون باندل CJS/ESM پکیج pocketbase در Next.js
 * ممکن است دو نسخه‌ی متفاوت از ClientResponseError بسازد و چک instanceof شکست بخورد.
 */
export function isPbNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: unknown }).status === 404
  );
}

/**
 * کلاینت سرویس (superuser) برای عملیات دیتابیس در سمت سرور.
 * دسترسی کاربران به داده‌های خصوصی مانند قبل در همین لایه‌ی سرور کنترل می‌شود.
 */
export async function getPocketBase() {
  if (!pb.authStore.isValid) {
    const email = process.env.POCKETBASE_ADMIN_EMAIL;
    const password = process.env.POCKETBASE_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "POCKETBASE_ADMIN_EMAIL و POCKETBASE_ADMIN_PASSWORD در فایل .env تنظیم نشده‌اند."
      );
    }

    try {
      await pb.collection("_superusers").authWithPassword(email, password);
    } catch (error) {
      throw new Error(
        `اتصال به پاکت‌بیس (${POCKETBASE_URL}) برقرار نشد. مطمئن شوید سرور پاکت‌بیس در حال اجراست و اطلاعات ادمین درست است.`,
        { cause: error }
      );
    }
  }
  return pb;
}
