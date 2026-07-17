"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineXMark } from "react-icons/hi2";
import { ease } from "@/shared/definitions/motion";

interface DashboardModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function DashboardModal({
  open,
  title,
  onClose,
  children,
}: DashboardModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
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
            className="w-full max-w-md rounded-[2rem] glass-panel bg-white/85 p-6"
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
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
