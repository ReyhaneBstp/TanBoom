"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { User } from "next-auth";
import { ease } from "@/shared/definitions/motion";
import { BrandLogo } from "./shared/BrandLogo";
import { DesignCta } from "./shared/DesignCta";
import {
  DesktopAuthSection,
  DesktopNavLinks,
} from "./desktop/DesktopNav";
import { MobileMenu } from "./mobile/MobileMenu";
import { MobileMenuButton } from "./mobile/MobileMenuButton";

export default function Navbar({
  user,
}: {
  user: User | null | undefined;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 md:backdrop-blur-lg border-b border-border shadow-sm"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center">
          <MobileMenuButton
            open={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <BrandLogo />
        </div>

        <DesktopNavLinks />

        <div className="flex items-center gap-3">
          <DesktopAuthSection user={user} />
          <DesignCta />
        </div>
      </div>

      {mobileMenuOpen && (
        <MobileMenu user={user} onClose={() => setMobileMenuOpen(false)} />
      )}
    </motion.nav>
  );
}
