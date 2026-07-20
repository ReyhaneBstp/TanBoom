"use client";

import { useState } from "react";
import { HiOutlineArrowsPointingOut } from "react-icons/hi2";
import type { DesignRecord } from "@/server/services/design-service";
import {
  DesignLightbox,
  type LightboxImage,
} from "@/shared/components/DesignLightbox";

interface GalleryCardProps {
  design: DesignRecord;
}

export function GalleryCard({ design }: GalleryCardProps) {
  const [showLightbox, setShowLightbox] = useState(false);

  const images: LightboxImage[] = [
    { src: design.frontImage, label: "نمای جلو" },
    ...(design.backImage
      ? [{ src: design.backImage, label: "نمای پشت" }]
      : []),
  ];

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-soft-primary backdrop-blur-xl transition-shadow hover:shadow-glass">
      <button
        type="button"
        onClick={() => setShowLightbox(true)}
        aria-label={`نمایش بزرگ‌تر ${design.title}`}
        className="relative block w-full overflow-hidden rounded-[1.55rem]"
      >
        <img
          src={design.frontImage}
          alt={design.title}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/15 group-hover:opacity-100">
          <span className="flex size-11 items-center justify-center rounded-full border border-white/70 bg-white/80 text-foreground backdrop-blur-md">
            <HiOutlineArrowsPointingOut className="size-5" />
          </span>
        </span>
        {design.backImage && (
          <span className="absolute top-3 right-3 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-foreground backdrop-blur-md">
            دارای نمای پشت
          </span>
        )}
      </button>

      <div className="px-2 pb-2 pt-3">
        <h2 className="line-clamp-1 text-sm font-semibold text-foreground">
          {design.title}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          طراح: {design.creatorName ?? "کاربر تن‌بوم"}
        </p>
      </div>

      <DesignLightbox
        open={showLightbox}
        title={design.title}
        images={images}
        onClose={() => setShowLightbox(false)}
      />
    </article>
  );
}
