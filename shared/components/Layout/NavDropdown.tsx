"use client";

import { LogoutButton } from "@/features/auth/components/LogoutButton";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { User } from "next-auth";

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim().length > 0) {
    const clean = name.trim();
    return clean.slice(0, 2).toUpperCase();
  }
  if (email && email.trim().length > 0) {
    const localPart = email.split("@")[0];
    if (localPart) return localPart.slice(0, 2).toUpperCase();
  }
  return "U";
}

interface NavbarDropdownProps {
  user: User;
}

export function NavbarDropdown({ user }: NavbarDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = getInitials(user?.name, user?.email);
  const displayName = user?.name || user?.email || "کاربر";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-accent/20 transition-colors text-sm font-bold text-foreground"
        aria-label="منوی کاربری"
      >
        {initials}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-0 mt-2 w-56 rounded-xl bg-background border border-border shadow-xl p-2 origin-top-left z-50"
        >
          <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border mb-1">
            {displayName}
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            onClick={() => setOpen(false)}
          >
            داشبورد
          </Link>
          <LogoutButton
            variant="ghost"
            className="w-full justify-start px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors text-foreground"
          />
        </motion.div>
      )}
    </div>
  );
}