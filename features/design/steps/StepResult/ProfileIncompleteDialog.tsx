"use client";

import { HiOutlineUserCircle } from "react-icons/hi2";
import { Button } from "@/shared/components/Button";

interface ProfileIncompleteDialogProps {
  open: boolean;
  actionType: "order" | "gallery";
  onCompleteProfile: () => void;
  onContinue: () => void;
  onClose: () => void;
}

const messages = {
  order: {
    title: "تکمیل اطلاعات شخصی",
    description:
      "برای ثبت سفارش دوخت، تکمیل اطلاعات شخصی (مانند شماره تماس و آدرس) ضروری است. آیا می‌خواهید همین الان اطلاعات را تکمیل کنید؟",
  },
  gallery: {
    title: "تکمیل اطلاعات کاربری",
    description:
      "برای انتشار طرح در گالری، توصیه می‌شود نام کاربری خود را تکمیل کنید تا طرح با نام شما نمایش داده شود. می‌توانید بعداً هم این کار را انجام دهید.",
  },
};

export function ProfileIncompleteDialog({
  open,
  actionType,
  onCompleteProfile,
  onContinue,
  onClose,
}: ProfileIncompleteDialogProps) {
  if (!open) return null;

  const content = messages[actionType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <HiOutlineUserCircle className="size-6" />
          </span>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">
              {content.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {content.description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            onClick={onContinue}
            className="w-full sm:w-auto"
          >
            فعلاً نه
          </Button>
          <Button
            onClick={onCompleteProfile}
            className="w-full sm:w-auto"
          >
            تکمیل اطلاعات شخصی
          </Button>
        </div>
      </div>
    </div>
  );
}