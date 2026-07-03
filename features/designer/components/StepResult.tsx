/* eslint-disable @next/next/no-img-element */

import {
  HiOutlineArrowDownTray,
  HiOutlineSparkles,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import { Button } from "@/shared/components/button";
import { useDesignStore } from "@/features/designer/store/useDesignStore";

export function StepResult() {
  const generatedImages = useDesignStore((s) => s.generatedImages);
  const generatedAiPrompt = useDesignStore((s) => s.generatedAiPrompt);
  const isGeneratingBack = useDesignStore((s) => s.isGeneratingBack);
  const isGenerating = useDesignStore((s) => s.isGenerating);
  const generateBackView = useDesignStore((s) => s.generateBackView);
  const restart = useDesignStore((s) => s.restart);

  const hasBack = generatedImages.some((img) => img.id === "back");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {generatedImages.map((image) => (
          <article
            key={image.id}
            className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-soft-primary backdrop-blur-xl"
          >
            <img
              src={image.src}
              alt={image.title}
              className="aspect-[4/5] w-full rounded-[1.55rem] object-cover"
            />
            <div className="flex items-center justify-between px-2 py-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {image.title}
                </h3>
                <p className="mt-1 text-[10px] text-muted-foreground" dir="ltr">
                  {image.angle}
                </p>
              </div>
              <a
                href={image.src}
                download={`${image.id}-design.png`}
                className="flex size-9 items-center justify-center rounded-full bg-white/80 text-primary-500 transition hover:bg-primary-100"
                aria-label={`دانلود ${image.title}`}
              >
                <HiOutlineArrowDownTray className="size-5" />
              </a>
            </div>
          </article>
        ))}

        {generatedImages.length === 1 && !hasBack && (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-rose-200 bg-white/45 p-6 text-center backdrop-blur-xl">
            <HiOutlineSparkles className="size-8 text-rose-400 mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              نمای پشت لباس
            </h3>
            <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
              بر اساس نمای جلو و توضیحات شما، پشت لباس طراحی شود.
            </p>
            <Button
              type="button"
              variant="glass"
              onClick={generateBackView}
              disabled={isGeneratingBack || isGenerating}
              className="mt-5 gap-2"
            >
              {isGeneratingBack ? (
                <>
                  <HiOutlineArrowPath className="size-4 animate-spin" />
                  در حال تولید...
                </>
              ) : (
                <>
                  <HiOutlineSparkles className="size-4" />
                  تولید نمای پشت
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-[2rem] border border-white/80 bg-white/45 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <HiOutlineSparkles className="size-5 text-primary-500" />
              خروجی نهایی
            </h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              {hasBack
                ? "نمای جلو و پشت لباس آماده است."
                : "نمای جلو تولید شد. می‌توانید نمای پشت را نیز دریافت کنید."}
            </p>
          </div>
          <Button type="button" variant="glass" onClick={restart}>
            طراحی جدید
          </Button>
        </div>

        <details className="mt-4 rounded-[1.4rem] bg-white/55 p-4 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-semibold text-foreground">
            مشاهده پرامپت نهایی
          </summary>
          <pre
            className="mt-3 whitespace-pre-wrap text-left leading-6"
            dir="ltr"
          >
            {generatedAiPrompt}
          </pre>
        </details>
      </div>
    </div>
  );
}