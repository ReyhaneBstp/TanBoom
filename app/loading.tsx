import { LoadingOverlay } from "@/shared/components/LoadingOverlay";

/**
 * فال‌بک Suspense برای همه‌ی مسیرها؛
 * هنگام جابه‌جایی بین صفحات بلافاصله نمایش داده می‌شود
 * تا زمانی که دیتای سمت سرور صفحه‌ی مقصد آماده شود.
 */
export default function Loading() {
  return <LoadingOverlay text="در حال بارگذاری صفحه..." />;
}
