/* eslint-disable @next/next/no-img-element */
"use client";

import type { DragEvent } from "react";
import { HiOutlineArrowUpTray, HiOutlinePhoto } from "react-icons/hi2";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface StepSketchProps {
  previewUrl: string | null;
  description: string;
  onFileChange: (file: File | null) => void;
  onDescriptionChange: (description: string) => void;
}

export function StepSketch({ previewUrl, description, onFileChange, onDescriptionChange }: StepSketchProps) {
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];

    if (file?.type.startsWith("image/")) {
      onFileChange(file);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "group flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-lilac-200 bg-white/45 p-5 text-center backdrop-blur-xl transition-all hover:border-lilac-300 hover:bg-white/75 hover:shadow-soft-lilac",
          previewUrl && "border-solid border-lilac-300 bg-white/70"
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
        {previewUrl ? (
          <img src={previewUrl} alt="پیش‌نمایش اسکچ بارگذاری‌شده" className="h-56 w-full rounded-[1.5rem] object-cover" />
        ) : (
          <>
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-lilac-100 text-lilac-500 transition group-hover:scale-105">
              <HiOutlineArrowUpTray className="size-7" />
            </span>
            <span className="text-sm font-semibold text-foreground">اسکچ دستی را اینجا رها کنید</span>
            <span className="mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
              یا برای انتخاب فایل کلیک کنید. فرمت‌های تصویری رایج پشتیبانی می‌شوند.
            </span>
          </>
        )}
        {previewUrl ? (
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <HiOutlinePhoto className="size-4" />
            تغییر تصویر
          </span>
        ) : null}
      </label>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">توضیحات طراحی</h3>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            جزئیات دوخت، یقه، آستین، محل استفاده پارچه‌ها و حس کلی لباس را بنویسید.
          </p>
        </div>
        <Textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="مثلاً: یقه کار شده با تور، آستین آزاد، پارچه طرح‌دار فقط برای سرآستین و قسمت پشت استفاده شود."
          className="min-h-56"
        />
      </div>
    </div>
  );
}
