import { HiOutlineCpuChip, HiOutlineSparkles } from "react-icons/hi2";
import { useDesignStore } from "@/store/useDesignStore";

export function StepProcessing() {
  const generatedAiPrompt = useDesignStore((s) => s.generatedAiPrompt);
  const isGenerating = useDesignStore((s) => s.isGenerating);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-white/80 bg-white/45 p-6 text-center backdrop-blur-xl">
        <div className="relative mb-5 flex size-20 items-center justify-center rounded-full bg-rose-100 text-rose-500">
          <span className="absolute inset-0 animate-ping rounded-full bg-rose-300/25" />
          {isGenerating ? (
            <HiOutlineCpuChip className="relative size-9 animate-pulse" />
          ) : (
            <HiOutlineSparkles className="relative size-9" />
          )}
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {isGenerating
            ? "هوش مصنوعی در حال آماده‌سازی طرح است"
            : "پرامپت آماده شد"}
        </h3>
        <p className="mt-2 max-w-sm text-xs leading-6 text-muted-foreground">
          اطلاعات مراحل قبل به یک پرامپت دقیق برای تولید تصویر چندنما تبدیل شده
          است.
        </p>
        {isGenerating ? (
          <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/70">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-rose-300" />
          </div>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-white/80 bg-white/50 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            پرامپت بهینه‌شده
          </h3>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-semibold text-rose-600">
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