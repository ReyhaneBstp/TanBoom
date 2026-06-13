/* eslint-disable @next/next/no-img-element */
import { HiOutlineArrowDownTray, HiOutlineSparkles } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { useDesignStore } from "@/store/useDesignStore";

export function StepResult() {
  const generatedImages = useDesignStore((s) => s.generatedImages);
  const generatedAiPrompt = useDesignStore((s) => s.generatedAiPrompt);
  const restart = useDesignStore((s) => s.restart);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {generatedImages.map((image) => (
          <article
            key={image.id}
            className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-soft-rose backdrop-blur-xl"
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
                download={`${image.id}-custom-design.svg`}
                className="flex size-9 items-center justify-center rounded-full bg-white/80 text-rose-500 transition hover:bg-rose-100"
                aria-label={`دانلود ${image.title}`}
              >
                <HiOutlineArrowDownTray className="size-5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/80 bg-white/45 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <HiOutlineSparkles className="size-5 text-rose-500" />
              خروجی آماده تحویل به خیاط
            </h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              سه نمای اصلی تولید شده‌اند و پرامپت نهایی برای اتصال به API آماده
              است.
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