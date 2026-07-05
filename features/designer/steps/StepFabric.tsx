"use client";

import { useState, useRef, useEffect } from "react";
import { HiOutlineCheck, HiOutlinePlus, HiOutlineXMark, HiChevronDown } from "react-icons/hi2";
import { LuPalette } from "react-icons/lu";
import { FABRIC_MATERIALS } from "../definitions/design-options";
import { useDesignStore } from "@/features/designer/store/useDesignStore";
import type { SolidFabric } from "@/features/designer/types/design";
import { cn } from "@/shared/utils/mergeClasses";

export function StepFabric() {
  const customFabrics = useDesignStore((s) => s.customFabrics) as SolidFabric[];
  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const addCustomFabric = useDesignStore((s) => s.addCustomFabric);
  const removeCustomFabric = useDesignStore((s) => s.removeCustomFabric);
  const toggleFabric = useDesignStore((s) => s.toggleFabric);

  const [colorHex, setColorHex] = useState("#C8A2C8");
  const [materialInput, setMaterialInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredMaterials = FABRIC_MATERIALS.filter((m) =>
    m.includes(materialInput.trim())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectMaterial = (material: string) => {
    setMaterialInput(material);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredMaterials.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredMaterials.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredMaterials.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      selectMaterial(filteredMaterials[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const isValidMaterial = FABRIC_MATERIALS.includes(materialInput.trim());
  const canAdd = isValidMaterial && colorHex.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    addCustomFabric(colorHex, materialInput.trim());
    setColorHex("#C8A2C8");
    setMaterialInput("");
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col gap-8 min-h-[22rem]">
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

          <div className="flex flex-col gap-1.5 relative" ref={wrapperRef}>
            <label className="text-xs font-medium text-foreground/80">
              جنس پارچه
            </label>
            <div className="relative">
              <input
                type="text"
                value={materialInput}
                onChange={(e) => {
                  setMaterialInput(e.target.value);
                  setShowSuggestions(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="مثلاً پنبه"
                className="h-10 w-40 rounded-lg border border-white/60 bg-white/45 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-200/50"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <HiChevronDown className="size-4 text-muted-foreground" />
              </span>
            </div>

            {showSuggestions && filteredMaterials.length > 0 && (
              <ul className="absolute top-full mt-1 z-20 w-full rounded-xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto">
                {filteredMaterials.map((material, idx) => (
                  <li
                    key={material}
                    onMouseDown={() => selectMaterial(material)}
                    className={cn(
                      "cursor-pointer px-3 py-2 text-sm transition-colors",
                      idx === highlightedIndex
                        ? "bg-primary-100 text-primary-800"
                        : "hover:bg-primary-50 text-foreground"
                    )}
                  >
                    {material}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={cn(
              "flex h-10 items-center gap-2 rounded-full border border-white/80 px-5 text-xs font-semibold backdrop-blur-xl transition",
              canAdd
                ? "bg-white/45 hover:bg-primary-100 hover:text-primary-600"
                : "bg-white/30 text-muted-foreground cursor-not-allowed"
            )}
          >
            <HiOutlinePlus className="size-4" />
            افزودن به لیست پارچه‌ها
          </button>
        </div>

        {customFabrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary-200/70 bg-white/30 px-6 py-10 text-center backdrop-blur-xl">
            <LuPalette className="size-10 text-primary-300 animate-pulse" />
            <p className="text-sm text-muted-foreground max-w-xs">
              هنوز پارچه‌ای اضافه نشده. یک رنگ و جنس انتخاب و اضافه کنید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {customFabrics.map((fabric) => {
              const selected = selectedFabricIds.includes(fabric.id);
              return (
                <button
                  key={fabric.id}
                  type="button"
                  onClick={() => toggleFabric(fabric.id)}
                  className={cn(
                    "group relative rounded-[1.5rem] border border-white/80 bg-white/45 p-3 text-center backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-soft-primary",
                    selected &&
                      "border-primary-300 bg-white shadow-soft-primary ring-4 ring-primary-200/35"
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomFabric(fabric.id);
                    }}
                    className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-white/70 text-muted-foreground shadow-sm hover:bg-red-100 hover:text-red-500 transition"
                    title="حذف پارچه"
                  >
                    <HiOutlineXMark className="size-3" />
                  </button>

                  <span
                    className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/70 shadow-inner"
                    style={{ backgroundColor: fabric.hex }}
                  >
                    {selected ? (
                      <HiOutlineCheck className="size-5 text-white drop-shadow" />
                    ) : null}
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-foreground leading-tight">
                    {fabric.label}
                  </span>
                  <span className="mt-1 block text-[10px] text-muted-foreground" dir="ltr">
                    {fabric.hex}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="rounded-2xl border border-white/70 bg-white/40 px-4 py-3 text-xs leading-6 text-muted-foreground backdrop-blur-xl">
        با کلیک روی دکمه «افزودن»، رنگ و جنس پارچه انتخاب می‌شود. برای حذف کامل یک پارچه، روی ضربدر کلیک کنید.
      </p>
    </div>
  );
}