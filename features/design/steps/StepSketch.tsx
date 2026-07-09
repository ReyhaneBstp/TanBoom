/* eslint-disable @next/next/no-img-element */
"use client";

import type { DragEvent } from "react";
import { useMemo } from "react";
import { HiOutlineArrowUpTray, HiOutlinePhoto, HiOutlineSparkles } from "react-icons/hi2";
import { Textarea } from "@/shared/components/Textarea";
import { useDesignStore } from "@/features/design/store/useDesignStore";
import type { SolidFabric } from "@/features/design/types/design";
import { ACCESSORIES } from "@/features/design/definitions/design-options";
import { cn } from "@/shared/utils/mergeClasses";
import { Input } from "@/shared/components/Input";

export function StepSketch() {
  const previewUrl = useDesignStore((s) => s.sketch.previewUrl);
  const description = useDesignStore((s) => s.sketch.description);
  const updateSketchFile = useDesignStore((s) => s.updateSketchFile);
  const updateDescription = useDesignStore((s) => s.updateDescription);

  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const customFabrics = useDesignStore((s) => s.customFabrics) as SolidFabric[];
  const fabricAssignments = useDesignStore((s) => s.fabricAssignments);
  const setFabricAssignment = useDesignStore((s) => s.setFabricAssignment);

  const selectedAccessories = useDesignStore((s) => s.selectedAccessories);
  const accessoryPlacements = useDesignStore((s) => s.accessoryPlacements);
  const setAccessoryPlacement = useDesignStore((s) => s.setAccessoryPlacement);

  const allFabrics = useMemo(() => [...customFabrics], [customFabrics]);

  const selectedFabricsData = useMemo(
    () => selectedFabricIds.map((id) => allFabrics.find((f) => f.id === id)).filter(Boolean),
    [allFabrics, selectedFabricIds]
  );

  const selectedAccessoriesData = useMemo(
    () => selectedAccessories.map((id) => ACCESSORIES.find((a) => a.id === id)).filter(Boolean),
    [selectedAccessories]
  );

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
                یا برای انتخاب فایل کلیک کنید
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
              جزئیات دوخت، یقه، آستین و هرچیزی که برای شفاف‌تر شدن طرحت لازمه بدونیم رو بنویس.
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
      {selectedFabricsData.length > 0 && (
        <div className="rounded-2xl border border-white/70 bg-white/45 p-3 backdrop-blur-xl">
          <h3 className="text-sm font-medium text-foreground/80">
            پارچه‌های انتخاب‌شده و محل استفاده
          </h3>
          <p className="mt-0.5 mb-3 text-xs text-muted-foreground">
            برای هر پارچه محل استفاده در لباس را مشخص کنید.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedFabricsData.map((fabric) => (
              <div
                key={fabric!.id}
                className="flex items-start gap-2.5 rounded-xl bg-white/50 p-2"
              >
                <div className="flex-shrink-0 pt-0.5">
                  <span
                    className="flex size-8 items-center justify-center rounded-full border border-white/70 shadow-inner"
                    style={{ backgroundColor: (fabric as SolidFabric).hex }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    {fabric!.label}
                  </span>
                  <Input
                    type="text"
                    value={fabricAssignments[fabric!.id] || ""}
                    onChange={(e) => setFabricAssignment(fabric!.id, e.target.value)}
                    placeholder="مثلاً: یقه"
                    className="mt-1 w-full rounded-md border border-primary-100/70 bg-white/60 px-2 py-1 text-xs placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedAccessoriesData.length > 0 && (
        <div className="rounded-2xl border border-white/70 bg-white/45 p-3 backdrop-blur-xl">
          <h3 className="text-sm font-medium text-foreground/80">
            اکسسوری‌های انتخاب‌شده و محل استفاده
          </h3>
          <p className="mt-0.5 mb-3 text-xs text-muted-foreground">
            برای هر اکسسوری محل استفاده در لباس را مشخص کنید.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedAccessoriesData.map((accessory) => (
              <div
                key={accessory!.id}
                className="flex items-start gap-2.5 rounded-xl bg-white/50 p-2"
              >
                <div className="flex-shrink-0 pt-0.5">
                  <HiOutlineSparkles className="text-primary-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    {accessory!.label}
                  </span>
                  <Input
                    type="text"
                    value={accessoryPlacements[accessory!.id] || ""}
                    onChange={(e) => setAccessoryPlacement(accessory!.id, e.target.value)}
                    placeholder="مثلاً: یقه و حاشیه آستین"
                    className="mt-1 w-full rounded-md border border-primary-100/70 bg-white/60 px-2 py-1 text-xs placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
