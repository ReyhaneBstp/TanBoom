"use client";

import { HiOutlineCheck, HiOutlineSparkles } from "react-icons/hi2";
import { ACCESSORIES } from "../definitions/design-options";
import { cn } from "@/shared/utils/mergeClasses";
import { DebouncedInput } from "@/shared/components/DebouncedInput";
import { useStepAccessoryUrl } from "../hooks/useStepAccessoryUrl";

export function StepAccessories() {
  const {
    selectedAccessories,
    accessoryPlacements,
    toggleAccessory,
    setAccessoryPlacement,
  } = useStepAccessoryUrl();

  const selectedAccessoriesData = selectedAccessories
    .map((id) => ACCESSORIES.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-6 min-h-[22rem]">
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

      {selectedAccessoriesData.length > 0 && (
        <div className="rounded-2xl border border-white/70 bg-white/45 p-3 backdrop-blur-xl">
          <h3 className="text-sm font-medium text-foreground/80">محل استفاده هر اکسسوری</h3>
          <p className="mt-0.5 mb-3 text-xs text-muted-foreground">
            برای هر اکسسوری مشخص کن که روی کدام قسمت لباس قرار می‌گیرد.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedAccessoriesData.map((accessory) => (
              <div key={accessory!.id} className="flex items-start gap-2.5 rounded-xl bg-white/50 p-2">
                <div className="flex-shrink-0 pt-0.5">
                  <HiOutlineSparkles className="text-primary-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    {accessory!.label}
                  </span>
                  <DebouncedInput
                    type="text"
                    value={accessoryPlacements[accessory!.id] || ""}
                    onDebouncedChange={(v) => setAccessoryPlacement(accessory!.id, v)}
                    placeholder="مثلاً: یقه و حاشیه آستین"
                    className="mt-1 px-2 py-1 text-xs placeholder:text-muted-foreground/60"
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