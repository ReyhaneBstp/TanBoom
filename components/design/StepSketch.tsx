/* eslint-disable @next/next/no-img-element */
"use client";

import type { DragEvent } from "react";
import { useMemo } from "react";
import { HiOutlineArrowUpTray, HiOutlinePhoto } from "react-icons/hi2";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDesignStore } from "@/store/useDesignStore";
import type { SolidFabric, PatternedFabric } from "@/types/design";

export function StepSketch() {
  const previewUrl = useDesignStore((s) => s.sketch.previewUrl);
  const description = useDesignStore((s) => s.sketch.description);
  const updateSketchFile = useDesignStore((s) => s.updateSketchFile);
  const updateDescription = useDesignStore((s) => s.updateDescription);

  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const customFabrics = useDesignStore((s) => s.customFabrics) as SolidFabric[];
  const patternedFabrics = useDesignStore(
    (s) => s.patternedFabrics
  ) as PatternedFabric[];
  const fabricAssignments = useDesignStore((s) => s.fabricAssignments);
  const setFabricAssignment = useDesignStore((s) => s.setFabricAssignment);

  const allFabrics = useMemo(
    () => [...customFabrics, ...patternedFabrics],
    [customFabrics, patternedFabrics]
  );

  const selectedFabricsData = useMemo(
    () =>
      selectedFabricIds
        .map((id) => allFabrics.find((f) => f.id === id))
        .filter(Boolean),
    [allFabrics, selectedFabricIds]
  );

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      updateSketchFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "group flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-rose-200 bg-white/45 p-5 text-center backdrop-blur-xl transition-all hover:border-rose-300 hover:bg-white/75 hover:shadow-soft-rose",
            previewUrl && "border-solid border-rose-300 bg-white/70"
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) =>
              updateSketchFile(event.target.files?.[0] ?? null)
            }
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="پیش‌نمایش اسکچ بارگذاری‌شده"
              className="h-56 w-full rounded-[1.5rem] object-cover"
            />
          ) : (
            <>
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-500 transition group-hover:scale-105">
                <HiOutlineArrowUpTray className="size-7" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                اسکچ دستی را اینجا رها کنید
              </span>
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
            <h3 className="text-sm font-semibold text-foreground">
              توضیحات طراحی
            </h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              جزئیات دوخت، یقه، آستین، محل استفاده پارچه‌ها و حس کلی لباس را
              بنویسید.
            </p>
          </div>
          <Textarea
            value={description}
            onChange={(event) => updateDescription(event.target.value)}
            placeholder="مثلاً: یقه کار شده با تور، آستین آزاد، پارچه طرح‌دار فقط برای سرآستین و قسمت پشت استفاده شود."
            className="min-h-56"
          />
        </div>
      </div>

      {selectedFabricsData.length > 0 && (
        <div className="rounded-2xl border border-white/70 bg-white/45 p-4 backdrop-blur-xl">
          <h3 className="mb-1 text-sm font-semibold text-foreground">
            پارچه‌های انتخاب‌شده و محل استفاده
          </h3>
          <p className="mb-4 text-xs text-muted-foreground">
            برای هر پارچه توضیح دهید در کدام قسمت لباس (مانند یقه، آستین، دامن) استفاده می‌شود.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectedFabricsData.map((fabric) => {
              const isSolid = fabric?.kind === "solid";
              return (
                <div
                  key={fabric!.id}
                  className="flex items-start gap-3 rounded-xl bg-white/50 p-3"
                >
                  <div className="flex-shrink-0">
                    {isSolid ? (
                      <span
                        className="flex size-10 items-center justify-center rounded-full border border-white/70 shadow-inner"
                        style={{
                          backgroundColor: (fabric as SolidFabric).hex,
                        }}
                      />
                    ) : (
                      <img
                        src={(fabric as PatternedFabric).imageData}
                        alt={fabric!.label}
                        className="size-10 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">
                      {fabric!.label}
                    </span>
                    <input
                      type="text"
                      value={fabricAssignments[fabric!.id] || ""}
                      onChange={(e) =>
                        setFabricAssignment(fabric!.id, e.target.value)
                      }
                      placeholder="مثلاً: یقه"
                      className="mt-1 w-full rounded-md border border-rose-100/70 bg-white/60 px-2 py-1 text-xs placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}