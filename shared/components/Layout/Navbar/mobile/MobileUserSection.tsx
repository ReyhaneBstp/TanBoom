"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { User } from "next-auth";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { getInitials } from "../shared/getInitials";
import { UserAvatar } from "../shared/UserAvatar";

interface MobileUserSectionProps {
  user: User;
  onNavigate: () => void;
}


export function MobileUserSection({ user, onNavigate }: MobileUserSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const initials = getInitials(user?.name, user?.email);

  return (
    <div className="border-t border-border pt-4 mt-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          <UserAvatar initials={initials} />
          <span>{user?.name || user?.email}</span>
        </div>
        <LuChevronDown
          size={16}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="flex flex-col gap-1 mt-3 mr-11"
        >
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="text-sm font-medium text-foreground hover:text-accent transition-colors py-1"
          >
            داشبورد
          </Link>
          <LogoutButton
            variant="ghost"
            className="h-auto px-0 py-1 text-sm font-medium text-foreground shadow-none hover:bg-transparent hover:text-accent justify-start"
          />
        </motion.div>
      )}
    </div>
  );
}
