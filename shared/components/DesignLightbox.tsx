"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
} from "react-icons/hi2";
import { ease } from "@/shared/definitions/motion";

export interface LightboxImage {
  src: string;
  label: string;
}

interface DesignLightboxProps {
  open: boolean;
  title: string;
  images: LightboxImage[];
  onClose: () => void;
}

export function DesignLightbox({
  open,
  title,
  images,
  onClose,
}: DesignLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!hasMultiple) return;
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hasMultiple, images.length, onClose]);

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const activeImage = images[activeIndex];

  return (
    <AnimatePresence>
      {open && activeImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease }}
            className="w-full max-w-lg overflow-hidden rounded-[2rem] glass-panel bg-white/90 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-muted-foreground transition-colors hover:text-foreground"
              >
                <HiOutlineXMark className="size-5" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[1.55rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeIndex}
                  src={activeImage.src}
                  alt={`${title} - ${activeImage.label}`}
                  drag={hasMultiple ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 60) goPrev();
                    else if (info.offset.x < -60) goNext();
                  }}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.25, ease }}
                  className="aspect-[4/5] w-full cursor-grab select-none object-cover active:cursor-grabbing"
                />
              </AnimatePresence>

              <span className="absolute top-3 right-3 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-foreground backdrop-blur-md">
                {activeImage.label}
              </span>

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="تصویر بعدی"
                    className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/75 text-foreground backdrop-blur-md transition-all hover:bg-white"
                  >
                    <HiOutlineChevronRight className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="تصویر قبلی"
                    className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/75 text-foreground backdrop-blur-md transition-all hover:bg-white"
                  >
                    <HiOutlineChevronLeft className="size-5" />
                  </button>
                </>
              )}
            </div>

            {hasMultiple && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.label}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={image.label}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6 bg-primary-400"
                        : "w-2 bg-primary-200 hover:bg-primary-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
