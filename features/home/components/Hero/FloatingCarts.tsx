"use client";

import { floatingAnimation, floatingCards } from "./definitions";
import { motion } from "motion/react";

export default function FloatingCarts() {
  return (
    <>
      {floatingCards.map(({ Icon, title, subtitle, className }) => (
        <motion.div
          key={title}
          {...floatingAnimation}
          className={`${className} rounded-2xl border border-border bg-card px-4 py-3 shadow-xl`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Icon size={15} className="text-primary" />
            </div>

            <div>
              <div className="text-[10px] text-muted-foreground">{title}</div>

              <div className="text-sm font-bold">{subtitle}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}
