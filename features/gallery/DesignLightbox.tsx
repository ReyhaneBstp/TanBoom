"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && activeImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease }}
            className="relative flex h-full w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
            >
              <HiOutlineXMark className="size-6" />
            </button>
            <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
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
                  className="max-h-[90vh] w-auto max-w-[90vw] select-none object-contain md:max-h-[85vh] md:max-w-[85vw]"
                />
              </AnimatePresence>
            </div>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-black/40 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              {activeImage.label}
            </span>
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="تصویر بعدی"
                  className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white md:right-6"
                >
                  <HiOutlineChevronRight className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="تصویر قبلی"
                  className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white md:left-6"
                >
                  <HiOutlineChevronLeft className="size-6" />
                </button>
              </>
            )}
            {hasMultiple && (
              <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.label}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={image.label}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6 bg-white"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}