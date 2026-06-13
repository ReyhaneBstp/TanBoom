"use client";

import { useState } from "react";
import { HiOutlineCheck, HiOutlinePlus } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useDesignStore } from "@/store/useDesignStore";
import type { SolidFabric, PatternedFabric } from "@/types/design";

const TABS = [
  { id: "solid" as const, label: "پارچه‌های ساده" },
  { id: "patterned" as const, label: "پارچه‌های طرح‌دار" },
];

export function StepFabric() {
  const [activeTab, setActiveTab] = useState<"solid" | "patterned">("solid");
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
    <div className="space-y-5">
      <div className="flex w-fit gap-1 rounded-full border border-white/60 bg-white/40 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeTab === tab.id
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "solid" && (
        <>
          <div className="flex items-end gap-3">
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
              className="flex h-10 items-center gap-2 rounded-full border border-white/80 bg-white/45 px-5 text-xs font-semibold backdrop-blur-xl transition hover:bg-rose-100 hover:text-rose-600"
            >
              <HiOutlinePlus className="size-4" />
              افزودن به لیست پارچه‌ها
            </button>
          </div>

          {customFabrics.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200/70 bg-white/30 px-6 py-10 text-center backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">
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
                      "group rounded-[1.5rem] border border-white/80 bg-white/45 p-3 text-center backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-soft-rose",
                      selected &&
                        "border-rose-300 bg-white shadow-soft-rose ring-4 ring-rose-200/35"
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
        </>
      )}

      {activeTab === "patterned" && (
        <>
          {patternedFabrics.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200/70 bg-white/30 px-6 py-10 text-center backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">
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
                      "group relative rounded-[1.5rem] border border-white/80 bg-white/45 p-2 text-center backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-soft-rose",
                      selected &&
                        "border-rose-300 bg-white shadow-soft-rose ring-4 ring-rose-200/35"
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
                      <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-rose-400 text-white shadow">
                        <HiOutlineCheck className="size-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
      <p className="rounded-[1.3rem] border border-white/70 bg-white/40 px-4 py-3 text-xs leading-6 text-muted-foreground backdrop-blur-xl">
        {activeTab === "solid"
          ? "رنگ‌های دلخواه را به لیست اولیه اضافه کنید و سپس با کلیک روی آنها انتخاب‌شان کنید. می‌توانید چند رنگ را هم‌زمان برای طراحی نهایی داشته باشید."
          : "پارچه‌های طرح‌دار را با کلیک انتخاب کنید. این طرح‌ها به همراه رنگ‌های ساده در طراحی استفاده می‌شوند."}
      </p>
    </div>
  );
}
