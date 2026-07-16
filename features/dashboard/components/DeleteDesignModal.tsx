"use client";

import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { Button } from "@/shared/components/Button";
import { deleteDesign } from "@/server/actions/design-actions";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import { DashboardModal } from "./DashboardModal";

interface DeleteDesignModalProps {
  open: boolean;
  designId: string;
  designTitle: string;
  onClose: () => void;
}

export function DeleteDesignModal({
  open,
  designId,
  designTitle,
  onClose,
}: DeleteDesignModalProps) {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useGlobalStore();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDesign(designId);
      showSnackbar("طرح با موفقیت حذف شد", "success");
      onClose();
    } catch {
      showSnackbar("خطا در حذف طرح", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardModal open={open} title="حذف طرح" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-[1.6rem] border border-destructive/15 bg-destructive/5 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <HiOutlineTrash className="size-5 text-destructive" />
          </div>
          <p className="text-sm leading-7 text-foreground">
            آیا از حذف طرح «{designTitle}» مطمئن هستید؟ این عملیات قابل بازگشت
            نیست و طرح از گالری عمومی نیز حذف خواهد شد.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground shadow-destructive/20 hover:bg-destructive/90"
          >
            {loading ? "در حال حذف..." : "بله، حذف شود"}
          </Button>
        </div>
      </div>
    </DashboardModal>
  );
}
