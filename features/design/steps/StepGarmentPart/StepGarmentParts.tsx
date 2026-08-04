/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineXMark,
  HiOutlineSquares2X2,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { Button } from "@/shared/components/Button";
import { cn } from "@/shared/utils/mergeClasses";
import { GARMENT_PART_LABELS } from "../../definitions/design-options";
import type { GarmentPartType } from "@/features/design/types/design";
import type { GarmentPartRecord } from "@/server/services/garment-parts-service";
import { useGarmentParts } from "../../hooks/useGarmentParts";
import { usePartsStore } from "../../store/partsStore";
import { GarmentPartModal } from "./GarmentPartModal";

export function StepGarmentParts() {
  const { partsByCategory, availableCategories, loading, error } =
    useGarmentParts();

  const selectedParts = usePartsStore((s) => s.selectedParts);
  const setPart = usePartsStore((s) => s.setPart);
  const clearPart = usePartsStore((s) => s.clearPart);

  const [openCategory, setOpenCategory] = useState<GarmentPartType | null>(
    null,
  );

  const handleSelect = (category: GarmentPartType, part: GarmentPartRecord) => {
    setPart(category, {
      id: part.id,
      name: part.name,
      label: part.label,
      image: part.image,
    });
    setOpenCategory(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[22rem] items-center justify-center">
        <span className="text-sm text-muted-foreground">
          در حال بارگذاری بخش‌های لباس…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[22rem] flex-col items-center justify-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-rose-100">
          <HiOutlineExclamationTriangle className="size-7 text-rose-500" />
        </span>
        <p className="max-w-xs text-sm text-muted-foreground">
          بارگذاری بخش‌های لباس ممکن نشد. می‌توانید این مرحله را رد کنید و طرح
          خود را به‌صورت دستی ادامه دهید.
        </p>
      </div>
    );
  }

  if (availableCategories.length === 0) {
    return (
      <div className="flex min-h-[22rem] flex-col items-center justify-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary-100/60">
          <HiOutlineSquares2X2 className="size-7 text-primary-400" />
        </span>
        <p className="max-w-sm text-sm text-muted-foreground">
          برای این نوع لباس بخش آماده‌ای ثبت نشده. می‌توانید این مرحله را رد
          کنید و طرح دلخواهتان را در مرحله‌ی طراحی به‌صورت دستی بسازید.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-[22rem]">
      <div className="flex flex-col gap-3">
        {availableCategories.map((category) => {
          const selected = selectedParts[category];
          return (
            <div
              key={category}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-white/70 bg-white/45 p-3 backdrop-blur-xl transition-all",
                selected && "border-primary-300/70 bg-primary-50/50",
              )}
            >
              <div className="flex flex-1 items-center gap-3 min-w-0">
                {selected?.image ? (
                  <img
                    src={selected.image}
                    alt={selected.label}
                    className="size-12 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-100/50 text-primary-400">
                    <HiOutlineSquares2X2 className="size-6" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {GARMENT_PART_LABELS[category]}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {selected ? selected.label : "انتخاب نشده"}
                  </p>
                </div>
              </div>

              {selected && (
                <button
                  type="button"
                  onClick={() => clearPart(category)}
                  aria-label="حذف انتخاب"
                  className="flex size-8 items-center justify-center rounded-full bg-white/70 text-muted-foreground transition-colors hover:bg-rose-100 hover:text-rose-500"
                >
                  <HiOutlineXMark className="size-4" />
                </button>
              )}

              <Button
                type="button"
                variant={selected ? "outline" : "ghost"}
                size="sm"
                onClick={() => setOpenCategory(category)}
              >
                {selected ? "تغییر" : "انتخاب"}
                <HiOutlineChevronLeft className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {openCategory && (
        <GarmentPartModal
          open
          title={GARMENT_PART_LABELS[openCategory]}
          options={partsByCategory[openCategory] ?? []}
          selectedId={selectedParts[openCategory]?.id ?? null}
          onClose={() => setOpenCategory(null)}
          onSelect={(part) => handleSelect(openCategory, part)}
        />
      )}
    </div>
  );
}
