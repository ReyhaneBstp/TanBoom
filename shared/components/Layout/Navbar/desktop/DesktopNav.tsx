"use client";

import Link from "next/link";
import { User } from "next-auth";
import { NavLinks } from "../shared/NavLinks";
import { DesktopUserDropdown } from "./DesktopUserDropdown";

export function DesktopNavLinks() {
  return (
    <NavLinks
      className="hidden md:flex items-center gap-8 text-sm font-medium"
      linkClassName="text-muted-foreground hover:text-foreground transition-colors"
    />
  );
}

export function DesktopAuthSection({
  user,
}: {
  user: User | null | undefined;
}) {
  if (user) {
    return (
      <div className="hidden md:block">
        <DesktopUserDropdown user={user} />
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      ورود
    </Link>
  );
}
