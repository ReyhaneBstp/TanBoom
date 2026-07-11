"use client";

import { LogoutButton } from "@/features/auth/components/LogoutButton";
import Link from "next/link";
import { ease } from "@/shared/definitions/motion";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { LuMenu, LuScissors, LuX } from "react-icons/lu";

export default function Navbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          <button
            className="md:hidden p-1 text-foreground"
            onClick={() => setOpen(!open)}
          >
            {open ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>
          <Link href="/" className="flex items-center gap-2.5 group mr-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <LuScissors size={13} className="text-accent-foreground" />
            </div>
            <span className="text-lg font-black tracking-tight">تن‌بوم</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {[
            ["چطور کار می‌کنه؟", "#how"],
            ["گالری طرح‌ها", "#gallery"],
            ["برای طراحان", "#designers"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <LogoutButton
              variant="ghost"
              className="hidden md:inline-flex bg-transparent px-0 py-0 text-sm font-medium text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
            />
          ) : (
            <Link
              href="/login"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ورود
            </Link>
          )}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/design"
              className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-md shadow-accent/25"
            >
              شروع طراحی
            </Link>
          </motion.div>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background border-b border-border px-6 pb-5 pt-2 flex flex-col gap-4 -mt-2"
        >
          {[
            ["چطور کار می‌کنه؟", "#how"],
            ["گالری طرح‌ها", "#gallery"],
            ["برای طراحان", "#designers"],
            [isAuthenticated ? "خروج" : "ورود", isAuthenticated ? "__logout__" : "/login"],
            ["شروع طراحی", "/design"],
          ].map(([label, href]) =>
            href === "__logout__" ? (
              <div key={label} onClick={() => setOpen(false)}>
                <LogoutButton
                  variant="ghost"
                  className="h-auto px-0 py-0 text-sm font-medium text-foreground shadow-none hover:bg-transparent hover:text-accent"
                />
              </div>
            ) : (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {label}
              </Link>
            )
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
