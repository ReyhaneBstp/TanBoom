import { HiOutlineArrowPath } from "react-icons/hi2";

/**
 * اورلی لودینگ مشترک؛ هم در GlobalLoading (استور) و هم در
 * loading.tsx مسیرها (Suspense ناوبری) استفاده می‌شود.
 */
export function LoadingOverlay({
  text = "لطفاً منتظر بمانید",
}: {
  text?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/90 px-8 py-8 shadow-soft-primary backdrop-blur-xl">
        <HiOutlineArrowPath className="size-8 animate-spin text-primary-500" />
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
