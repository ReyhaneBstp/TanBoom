/* eslint-disable @next/next/no-img-element */
"use client";

import type { DragEvent } from "react";
import { HiOutlineArrowUpTray, HiOutlinePhoto } from "react-icons/hi2";
import { Textarea } from "@/shared/components/Textarea";
import { cn } from "@/shared/utils/mergeClasses";
import { useSketchStore } from "../store/sketchStore";

export function StepSketch() {
  const previewUrl = useSketchStore((s) => s.sketch.previewUrl);
  const description = useSketchStore((s) => s.sketch.description);
  const updateSketchFile = useSketchStore((s) => s.updateSketchFile);
  const updateDescription = useSketchStore((s) => s.updateDescription);

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      updateSketchFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-6">
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "group flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-primary-200 bg-white/45 p-4 text-center backdrop-blur-xl transition-all hover:border-primary-300 hover:bg-white/75",
            previewUrl && "border-solid border-primary-300 bg-white/70"
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => updateSketchFile(event.target.files?.[0] ?? null)}
          />
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="پیش‌نمایش اسکچ بارگذاری‌شده"
                className="h-44 w-full rounded-xl object-cover"
              />
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <HiOutlinePhoto className="size-3.5" />
                تغییر تصویر
              </span>
            </>
          ) : (
            <>
              <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary-100 text-primary-500 transition group-hover:scale-105">
                <HiOutlineArrowUpTray className="size-6 animate-pulse" />
              </span>
              <span className="text-sm font-medium text-foreground">
                اسکچ دستی را اینجا رها کنید
              </span>
              <span className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                اختیاری — یا برای انتخاب فایل کلیک کنید
              </span>
            </>
          )}
        </label>
        <div className="flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-foreground/80">
              توضیحات طراحی
            </h3>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              اختیاری — جزئیات دوخت، یقه، آستین و هرچیزی که برای شفاف‌تر شدن طرحت
              لازمه بدونیم رو بنویس.
            </p>
          </div>
          <Textarea
            value={description}
            onChange={(event) => updateDescription(event.target.value)}
            placeholder="مثلاً: یقه کار شده با تور، آستین آزاد…"
            className="min-h-44 flex-1"
          />
        </div>
      </div>
    </div>
  );
}
