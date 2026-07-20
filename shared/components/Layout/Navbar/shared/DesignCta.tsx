"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";


export function DesignCta() {
    const pathname = usePathname();
    const isDesignPage = pathname === "/design";

  if (isDesignPage) return null;

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Link
        href="/design"
        className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-md shadow-accent/25"
      >
        شروع طراحی
      </Link>
    </motion.div>
  );
}
