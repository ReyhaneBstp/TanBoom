"use client";

import { useState } from "react";
import { HiOutlineCheck, HiOutlinePlus } from "react-icons/hi2";
import { LuPalette, LuGrid3X3 } from "react-icons/lu";
import { useDesignStore } from "@/features/designer/store/useDesignStore";
import { OptionCard } from "../components/OptionCard";
import type { SolidFabric, PatternedFabric } from "@/features/designer/types/design";
import { cn } from "@/shared/utils/mergeClasses";

const FABRIC_CATEGORIES = [
  {
    id: "solid" as const,
    label: "پارچه ساده",
    description: "رنگ‌های یکدست و ساده",
  },
  {
    id: "patterned" as const,
    label: "پارچه طرح‌دار",
    description: "طرح‌ها و نقش‌های متنوع",
  },
];

export function StepFabric() {
  const [category, setCategory] = useState<"solid" | "patterned">("solid");
  const customFabrics = useDesignStore((s) => s.customFabrics) as SolidFabric[];
  const patternedFabrics = useDesignStore(
    (s) => s.patternedFabrics
  ) as PatternedFabric[];
  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const addCustomFabric = useDesignStore((s) => s.addCustomFabric);
  const toggleFabric = useDesignStore((s) => s.toggleFabric);

  const [colorHex, setColorHex] = useState("#C8A2C8");

  const handleAdd = () => {
    addCustomFabric(colorHex);
    setColorHex("#C8A2C8");
  };

  return (
    <div className="flex flex-col gap-8 min-h-[22rem]">
      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground/80">
          نوع پارچه
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {FABRIC_CATEGORIES.map((option) => (
            <OptionCard
              key={option.id}
              title={option.label}
              description={option.description}
              selected={category === option.id}
              onClick={() => setCategory(option.id)}
              icon={
                option.id === "solid" ? (
                  <LuPalette className="size-6" />
                ) : (
                  <LuGrid3X3 className="size-6" />
                )
              }
              className="!rounded-2xl !p-3 !shadow-sm hover:!shadow-md transition-all duration-200"
            />
          ))}
        </div>
      </div>

      {category === "solid" && (
        <div className="flex-1">
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/80">
                رنگ پارچه
              </label>
              <input
                type="color"
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded-lg border border-white/60 bg-white/45 p-1"
              />
            </div>
            {colorHex && (
              <span
                className="self-end pb-2 text-xs text-muted-foreground"
                dir="ltr"
              >
                {colorHex}
              </span>
            )}
            <button
              type="button"
              onClick={handleAdd}
              className="flex h-10 items-center gap-2 rounded-full border border-white/80 bg-white/45 px-5 text-xs font-semibold backdrop-blur-xl transition hover:bg-primary-100 hover:text-primary-600"
            >
              <HiOutlinePlus className="size-4" />
              افزودن به لیست پارچه‌ها
            </button>
          </div>

          {customFabrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary-200/70 bg-white/30 px-6 py-10 text-center backdrop-blur-xl">
              <LuPalette className="size-10 text-primary-300 animate-pulse" />
              <p className="text-sm text-muted-foreground max-w-xs">
                هنوز پارچه‌ای اضافه نشده. یک رنگ انتخاب و اضافه کنید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {customFabrics.map((fabric) => {
                const selected = selectedFabricIds.includes(fabric.id);
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    onClick={() => toggleFabric(fabric.id)}
                    className={cn(
                      "group rounded-[1.5rem] border border-white/80 bg-white/45 p-3 text-center backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-soft-primary",
                      selected &&
                        "border-primary-300 bg-white shadow-soft-primary ring-4 ring-primary-200/35"
                    )}
                  >
                    <span
                      className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/70 shadow-inner"
                      style={{ backgroundColor: fabric.hex }}
                    >
                      {selected ? (
                        <HiOutlineCheck className="size-5 text-white drop-shadow" />
                      ) : null}
                    </span>
                    <span className="mt-2 block text-xs font-semibold text-foreground">
                      {fabric.label}
                    </span>
                    <span
                      className="mt-1 block text-[10px] text-muted-foreground"
                      dir="ltr"
                    >
                      {fabric.hex}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {category === "patterned" && (
        <div className="flex-1">
          {patternedFabrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary-200/70 bg-white/30 px-6 py-10 text-center backdrop-blur-xl">
              <LuGrid3X3 className="size-10 text-primary-300 animate-pulse" />
              <p className="text-sm text-muted-foreground max-w-xs">
                پارچه‌ای طرح‌دار موجود نیست.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {patternedFabrics.map((fabric) => {
                const selected = selectedFabricIds.includes(fabric.id);
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    onClick={() => toggleFabric(fabric.id)}
                    className={cn(
                      "group relative rounded-[1.5rem] border border-white/80 bg-white/45 p-2 text-center backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-soft-primary",
                      selected &&
                        "border-primary-300 bg-white shadow-soft-primary ring-4 ring-primary-200/35"
                    )}
                  >
                    <img
                      src={fabric.imageData}
                      alt={fabric.label}
                      className="mx-auto h-24 w-full rounded-lg object-cover border border-white/70"
                    />
                    <span className="mt-2 block text-xs font-semibold text-foreground">
                      {fabric.label}
                    </span>
                    {selected && (
                      <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary-400 text-white shadow">
                        <HiOutlineCheck className="size-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
      <p className="rounded-2xl border border-white/70 bg-white/40 px-4 py-3 text-xs leading-6 text-muted-foreground backdrop-blur-xl">
        {category === "solid"
          ? "رنگ‌های دلخواه را به لیست اولیه اضافه کنید و سپس با کلیک روی آنها انتخاب‌شان کنید. می‌توانید چند رنگ را هم‌زمان برای طراحی نهایی داشته باشید."
          : "پارچه‌های طرح‌دار را با کلیک انتخاب کنید. این طرح‌ها به همراه رنگ‌های ساده در طراحی استفاده می‌شوند."}
      </p>
    </div>
  );
}