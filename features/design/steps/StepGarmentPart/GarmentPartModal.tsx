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
  onClose: () => void;
  onSelect: (part: GarmentPartRecord) => void;
}

export function GarmentPartModal({
  open,
  title,
  options,
  selectedId,
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

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {options.map((option) => {
                const selected = selectedId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(option)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-2xl border border-white/70 bg-white/80 p-2.5 text-center transition-all duration-200",
                      "hover:-translate-y-1 hover:bg-white/90 hover:shadow-lg hover:shadow-primary-200/15",
                      selected &&
                        "border-primary-300/80 bg-primary-50/80 shadow-md shadow-primary-200/20 ring-2 ring-primary-300/40",
                    )}
                  >
                    {selected && (
                      <span className="absolute left-2 top-2 z-20 flex size-6 items-center justify-center rounded-full bg-primary-600/80 text-white shadow-sm">
                        <HiOutlineCheck className="size-4" />
                      </span>
                    )}
                    {option.image ? (
                      <div className="relative  rounded-xl bg-white">
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
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
