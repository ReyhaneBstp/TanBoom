"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";
import { ease } from "@/shared/definitions/motion";
import { cn } from "@/shared/utils/mergeClasses";
import type { GarmentPartRecord } from "@/server/services/garment-parts-service";

interface GarmentPartModalProps {
  open: boolean;
  title: string;
  options: GarmentPartRecord[];
  selectedId: string | null;
  isLoading?: boolean;      
  error?: string | null;    
  onClose: () => void;
  onSelect: (part: GarmentPartRecord) => void;
}

export function GarmentPartModal({
  open,
  title,
  options,
  selectedId,
  isLoading = false,
  error = null,
  onClose,
  onSelect,
}: GarmentPartModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col items-center gap-2 rounded-2xl bg-white/60 p-2.5"
            >
              <div className="aspect-square w-full rounded-xl bg-primary-100/60" />
              <div className="h-3 w-3/4 rounded bg-primary-100/60" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="mt-2 text-sm text-muted-foreground">
            خطا در دریافت اطلاعات: {error}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 text-sm text-primary-600 underline"
          >
            بستن
          </button>
        </div>
      );
    }

    if (options.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground">گزینه‌ای برای انتخاب وجود ندارد.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = selectedId === option.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => onSelect(option)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease }}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-2xl border border-white/70 bg-white/80 p-2.5 text-center transition-all duration-200",
                "hover:-translate-y-1 hover:bg-white/90 hover:shadow-lg hover:shadow-primary-200/15",
                selected &&
                  "border-primary-300/80 bg-primary-50/80 shadow-md shadow-primary-200/20 ring-2 ring-primary-300/40"
              )}
            >
              {selected && (
                <span className="absolute left-2 top-2 z-20 flex size-6 items-center justify-center rounded-full bg-primary-600/80 text-white shadow-sm">
                  <HiOutlineCheck className="size-4" />
                </span>
              )}
              {option.image ? (
                <div className="relative w-full rounded-xl bg-white">
                  <img
                    src={option.image}
                    alt={option.label}
                  />
                </div>
              ) : (
                <span className="aspect-square w-full rounded-xl bg-primary-100/50" />
              )}
              <span className="block text-xs font-semibold leading-tight text-foreground">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease }}
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem] glass-panel bg-white/85 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن"
                className="flex size-9 items-center justify-center rounded-full bg-white/70 text-muted-foreground transition-colors hover:text-foreground"
              >
                <HiOutlineXMark className="size-5" />
              </button>
            </div>
            <div className="min-h-[200px]">{renderContent()}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}