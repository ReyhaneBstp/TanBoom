"use client";

import { useTransition } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { logoutAction } from "@/server/actions/auth-actions";
import { Button, type ButtonProps } from "@/shared/components/Button";

export function LogoutButton(props: ButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      {...props}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <HiOutlineArrowPath className="size-4 animate-spin" />
          در حال خروج...
        </span>
      ) : (
        "خروج"
      )}
    </Button>
  );
}
