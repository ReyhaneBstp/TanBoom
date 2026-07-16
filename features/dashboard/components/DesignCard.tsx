"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  HiOutlineArrowPath,
  HiOutlineCalendarDays,
  HiOutlineGlobeAlt,
  HiOutlineLockClosed,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import type { DesignRecord } from "@/server/services/design-service";
import { setDesignVisibility } from "@/server/actions/design-actions";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import { ease } from "@/shared/definitions/motion";
import { formatPersianDate } from "../definitions/order-status";
import { RenameDesignModal } from "./RenameDesignModal";
import { DeleteDesignModal } from "./DeleteDesignModal";

interface DesignCardProps {
  design: DesignRecord;
  index: number;
}

export function DesignCard({ design, index }: DesignCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { showSnackbar } = useGlobalStore();

  const handleToggleVisibility = async () => {
    setIsToggling(true);
    try {
      const res = await setDesignVisibility(design.id, !design.isPublic);
      showSnackbar(
        res.isPublic
          ? "طرح در گالری عمومی منتشر شد"
          : "طرح از گالری عمومی برداشته شد",
        "success"
      );
    } catch {
      showSnackbar("خطا در تغییر وضعیت انتشار", "error");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: Math.min(index * 0.06, 0.4) }}
      className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-soft-rose backdrop-blur-xl transition-shadow hover:shadow-glass"
    >
      <div className="relative overflow-hidden rounded-[1.55rem]">
        <img
          src={design.frontImage}
          alt={design.title}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold backdrop-blur-md ${
            design.isPublic
              ? "border-emerald-200 bg-emerald-50/90 text-emerald-700"
              : "border-white/80 bg-white/75 text-muted-foreground"
          }`}
        >
          {design.isPublic ? (
            <HiOutlineGlobeAlt className="size-3.5" />
          ) : (
            <HiOutlineLockClosed className="size-3.5" />
          )}
          {design.isPublic ? "عمومی" : "خصوصی"}
        </span>
      </div>

      <div className="space-y-3 px-2 pb-2 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
            {design.title}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
            <HiOutlineCalendarDays className="size-3.5" />
            {formatPersianDate(design.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVisibility}
            disabled={isToggling}
            className={`flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border text-xs font-bold transition-all disabled:opacity-50 ${
              design.isPublic
                ? "border-primary-200 bg-white/70 text-muted-foreground hover:border-primary-300 hover:text-foreground"
                : "border-accent/25 bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            {isToggling ? (
              <HiOutlineArrowPath className="size-4 animate-spin" />
            ) : design.isPublic ? (
              <HiOutlineLockClosed className="size-4" />
            ) : (
              <HiOutlineGlobeAlt className="size-4" />
            )}
            {design.isPublic ? "خصوصی شود" : "انتشار در گالری"}
          </button>

          <button
            type="button"
            onClick={() => setShowRename(true)}
            aria-label="ویرایش نام طرح"
            title="ویرایش نام"
            className="flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/70 text-primary-600 transition-all hover:border-primary-300 hover:bg-white"
          >
            <HiOutlinePencilSquare className="size-4.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowDelete(true)}
            aria-label="حذف طرح"
            title="حذف طرح"
            className="flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/70 text-destructive/80 transition-all hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
          >
            <HiOutlineTrash className="size-4.5" />
          </button>
        </div>
      </div>

      <RenameDesignModal
        open={showRename}
        designId={design.id}
        currentTitle={design.title}
        onClose={() => setShowRename(false)}
      />
      <DeleteDesignModal
        open={showDelete}
        designId={design.id}
        designTitle={design.title}
        onClose={() => setShowDelete(false)}
      />
    </motion.article>
  );
}
