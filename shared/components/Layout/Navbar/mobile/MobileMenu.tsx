"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { User } from "next-auth";
import { NavLinks } from "../shared/NavLinks";
import { MobileUserSection } from "./MobileUserSection";

interface MobileMenuProps {
  user: User | null | undefined;
  onClose: () => void;
}


export function MobileMenu({ user, onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:hidden bg-background border-b border-border px-6 pb-5 pt-2 flex flex-col gap-4 -mt-2"
    >
      <NavLinks
        className="flex flex-col gap-4"
        linkClassName="text-sm font-medium text-foreground hover:text-accent transition-colors"
        onNavigate={onClose}
      />

      {user ? (
        <MobileUserSection user={user} onNavigate={onClose} />
      ) : (
        <Link
          href="/login"
          onClick={onClose}
          className="text-sm font-medium text-foreground hover:text-accent transition-colors"
        >
          ورود
        </Link>
      )}

      <Link
        href="/design"
        onClick={onClose}
        className="text-sm font-bold text-accent hover:text-accent/80 transition-colors"
      >
        شروع طراحی
      </Link>
    </motion.div>
  );
}
