"use client";

import { useState, useRef, useEffect } from "react";
import {
  HiOutlineCheck,
  HiOutlinePlus,
  HiOutlineXMark,
  HiChevronDown,
} from "react-icons/hi2";
import { LuPalette } from "react-icons/lu";
import { FABRIC_MATERIALS } from "../definitions/design-options";
import { useDesignStore } from "@/features/designer/store/useDesignStore";
import type { SolidFabric } from "@/features/designer/types/design";
import { cn } from "@/shared/utils/mergeClasses";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export function StepFabric() {
  const customFabrics = useDesignStore((s) => s.customFabrics) as SolidFabric[];
  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const addCustomFabric = useDesignStore((s) => s.addCustomFabric);
  const removeCustomFabric = useDesignStore((s) => s.removeCustomFabric);
  const toggleFabric = useDesignStore((s) => s.toggleFabric);

  const [colorHex, setColorHex] = useState("#b3c6af");
  const [materialInput, setMaterialInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const filteredMaterials = FABRIC_MATERIALS.filter((m) =>
    m.includes(materialInput.trim())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
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
    setColorHex("#b3c6af");
    setMaterialInput("");
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col gap-6 min-h-[22rem]">

      <div className="flex items-end gap-3 flex-wrap">

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-medium text-muted-foreground">
            رنگ
          </span>
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            className="relative size-11 rounded-full border-2 border-white/80 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: colorHex }}
            title="انتخاب رنگ پارچه"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
          </button>
          <input
            ref={colorInputRef}
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="sr-only"
          />
        </div>

        <div className="h-10 w-px bg-white/50 self-center hidden sm:block" />

        <div className="flex flex-col gap-1.5 relative flex-1 min-w-[160px]" ref={wrapperRef}>
          <label className="text-xs font-medium text-foreground/80">
            جنس پارچه
          </label>
          <div className="relative">
            <Input
              type="text"
              value={materialInput}
              onChange={(e) => {
                setMaterialInput(e.target.value);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="مثلاً پنبه، کتان، مخمل..."
            />
            <button
              type="button"
              onClick={() => setShowSuggestions((prev) => !prev)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-white/50 transition-colors"
            >
              <HiChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform duration-200",
                  showSuggestions && "rotate-180"
                )}
              />
            </button>
          </div>

          {showSuggestions && filteredMaterials.length > 0 && (
            <ul className="absolute top-full mt-1.5 z-20 w-full rounded-xl border border-white/70 bg-white/85 backdrop-blur-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto">
              {filteredMaterials.map((material, idx) => (
                <li
                  key={material}
                  onMouseDown={() => selectMaterial(material)}
                  className={cn(
                    "cursor-pointer px-3.5 py-2.5 text-sm transition-colors",
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

        <Button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          variant={canAdd ? "outline" : "ghost"}
          size={"sm"}
        >
          <HiOutlinePlus className="size-4" />
          <span className="hidden sm:inline">افزودن </span>
        </Button>
      </div>

      <div className="h-px bg-gradient-to-l from-transparent via-white/40 to-transparent" />

      {customFabrics.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary-200/60 bg-white/25 px-8 py-14 text-center backdrop-blur-xl">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary-100/60">
            <LuPalette className="size-8 text-primary-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/70">
              هنوز پارچه‌ای اضافه نشده
            </p>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              یک رنگ و جنس انتخاب کنید، سپس روی دکمه «افزودن پارچه» بزنید.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {customFabrics.map((fabric) => {
            const selected = selectedFabricIds.includes(fabric.id);
            return (
              <button
                key={fabric.id}
                type="button"
                onClick={() => toggleFabric(fabric.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-2.5 rounded-2xl border border-white/70 bg-white/40 px-4 py-5 text-center backdrop-blur-xl transition-all duration-200",
                  "hover:-translate-y-1 hover:bg-white/65 hover:shadow-lg hover:shadow-primary-200/15",
                  selected &&
                    "border-primary-300/80 bg-primary-50/60 shadow-md shadow-primary-200/20 ring-2 ring-primary-300/40"
                )}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomFabric(fabric.id);
                  }}
                  className={cn(
                    "absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-sm transition-all duration-200",
                    "opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 hover:scale-110"
                  )}
                  title="حذف پارچه"
                >
                  <HiOutlineXMark className="size-3" />
                </button>

                <span
                  className="flex size-14 items-center justify-center rounded-full border-2 border-white/70 shadow-md transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: fabric.hex }}
                >
                  {selected && (
                    <span className="flex size-7 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                      <HiOutlineCheck className="size-4 text-white drop-shadow-md" />
                    </span>
                  )}
                </span>

                <div className="space-y-0.5">
                  <span className="block text-sm font-semibold text-foreground leading-tight">
                    {fabric.label}
                  </span>
                  <span
                    className="block text-[10px] text-muted-foreground/70 font-mono tracking-wide"
                    dir="ltr"
                  >
                    {fabric.hex}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}