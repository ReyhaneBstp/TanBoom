"use client";

import { HiOutlineCheck, HiOutlineSparkles } from "react-icons/hi2";
import { ACCESSORIES } from "../definitions/design-options";
import { useDesignStore } from "@/features/design/store/useDesignStore";
import { cn } from "@/shared/utils/mergeClasses";

export function StepAccessories() {
  const selectedAccessories = useDesignStore((s) => s.selectedAccessories);
  const toggleAccessory = useDesignStore((s) => s.toggleAccessory);

  return (
    <div className="flex flex-col gap-6 min-h-[22rem]">
      <div className="rounded-2xl border border-primary-200/60 bg-primary-50/30 px-4 py-3 backdrop-blur-xl">
        <p className="text-sm text-foreground/80 leading-relaxed">
          این مرحله اختیاری است. می‌توانید یک یا چند اکسسوری انتخاب کنید، یا بدون انتخاب ادامه دهید.
        </p>
      </div>

      {selectedAccessories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary-200/60 bg-white/25 px-8 py-14 text-center backdrop-blur-xl">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary-100/60">
            <HiOutlineSparkles className="size-8 text-primary-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/70">
              هیچ اکسسوری انتخاب نشده
            </p>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              برای افزودن جزئیات تزئینی، از لیست زیر انتخاب کنید.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ACCESSORIES.map((accessory) => {
          const selected = selectedAccessories.includes(accessory.id);
          return (
            <button
              key={accessory.id}
              type="button"
              onClick={() => toggleAccessory(accessory.id)}
              className={cn(
                "group relative flex flex-col items-center gap-3 rounded-2xl border border-white/70 bg-white/40 px-4 py-5 text-center backdrop-blur-xl transition-all duration-200",
                "hover:-translate-y-1 hover:bg-white/65 hover:shadow-lg hover:shadow-primary-200/15",
                selected &&
                  "border-primary-300/80 bg-primary-50/60 shadow-md shadow-primary-200/20 ring-2 ring-primary-300/40"
              )}
            >
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border-2 border-white/70 shadow-md transition-all duration-200",
                  selected ? "bg-primary-400 scale-105" : "bg-white/60 group-hover:bg-white/80"
                )}
              >
                {selected ? (
                  <HiOutlineCheck className="size-6 text-white drop-shadow-md" />
                ) : (
                  <HiOutlineSparkles className="size-5 text-primary-400" />
                )}
              </span>

              <div className="space-y-0.5">
                <span className="block text-sm font-semibold text-foreground leading-tight">
                  {accessory.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
