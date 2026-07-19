"use client";

import { LuMenu, LuX } from "react-icons/lu";

interface MobileMenuButtonProps {
  open: boolean;
  onToggle: () => void;
}

export function MobileMenuButton({ open, onToggle }: MobileMenuButtonProps) {
  return (
    <button
      className="md:hidden p-1 text-foreground"
      onClick={onToggle}
      aria-label={open ? "بستن منو" : "باز کردن منو"}
    >
      {open ? <LuX size={20} /> : <LuMenu size={20} />}
    </button>
  );
}
