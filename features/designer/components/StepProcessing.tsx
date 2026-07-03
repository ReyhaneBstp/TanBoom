import {
  HiOutlineCpuChip,
  HiOutlineSparkles,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import { useDesignStore } from "@/features/designer/store/useDesignStore";

export function StepProcessing() {
  const generatedAiPrompt = useDesignStore((s) => s.generatedAiPrompt);
  const isGenerating = useDesignStore((s) => s.isGenerating);
  const isGeneratingBack = useDesignStore((s) => s.isGeneratingBack);

  const message = isGeneratingBack
    ? "در حال تولید نمای پشت بر اساس نمای جلو..."
    : isGenerating
    ? "هوش مصنوعی در حال آماده‌سازی طرح جلو است"
    : "پرامپت آماده شد";

  const icon = isGeneratingBack ? (
    <HiOutlineArrowPath className="relative size-9 animate-spin" />
  ) : isGenerating ? (
    <HiOutlineCpuChip className="relative size-9 animate-pulse" />
  ) : (
    <HiOutlineSparkles className="relative size-9" />
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-white/80 bg-white/45 p-6 text-center backdrop-blur-xl">
        <div className="relative mb-5 flex size-20 items-center justify-center rounded-full bg-primary-100 text-primary-500">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary-300/25" />
          {icon}
        </div>
        <h3 className="text-base font-semibold text-foreground">{message}</h3>
        <p className="mt-2 max-w-sm text-xs leading-6 text-muted-foreground">
          {isGeneratingBack
            ? "از تصویر نمای جلو به‌عنوان ورودی استفاده می‌شود."
            : "اطلاعات مراحل قبل به یک پرامپت دقیق تبدیل شده است."}
        </p>
        {isGenerating && !isGeneratingBack && (
          <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/70">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-primary-300" />
          </div>
        )}
        {isGeneratingBack && (
          <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/70">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-rose-300" />
          </div>
        )}
      </div>

      <div className="rounded-[2rem] border border-white/80 bg-white/50 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            {isGeneratingBack ? "پرامپت نمای پشت" : "پرامپت بهینه‌شده"}
          </h3>
          <span className="rounded-full bg-primary-100 px-3 py-1 text-[10px] font-semibold text-primary-600">
            Image API
          </span>
        </div>
        <pre
          className="hide-scrollbar max-h-72 overflow-auto whitespace-pre-wrap rounded-[1.4rem] bg-white/60 p-4 text-left text-xs leading-6 text-muted-foreground"
          dir="ltr"
        >
          {generatedAiPrompt}
        </pre>
      </div>
    </div>
  );
}