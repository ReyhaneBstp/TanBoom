"use client";

import { useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { renameDesign } from "@/server/actions/design-actions";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import { getActionErrorMessage } from "@/shared/utils/getActionErrorMessage";
import { DashboardModal } from "./DashboardModal";

interface RenameDesignModalProps {
  open: boolean;
  designId: string;
  currentTitle: string;
  onClose: () => void;
}

export function RenameDesignModal({
  open,
  designId,
  currentTitle,
  onClose,
}: RenameDesignModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useGlobalStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showSnackbar("نام طرح نمی‌تواند خالی باشد", "error");
      return;
    }
    setLoading(true);
    try {
      await renameDesign(designId, title);
      showSnackbar("نام طرح با موفقیت تغییر کرد", "success");
      onClose();
    } catch (error) {
      showSnackbar(
        getActionErrorMessage(
          error,
          "تغییر نام طرح انجام نشد. لطفاً دوباره تلاش کنید."
        ),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardModal open={open} title="ویرایش نام طرح" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="rename-design"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
          >
            <HiOutlinePencilSquare className="size-4" />
            نام جدید طرح
          </label>
          <Input
            id="rename-design"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: مانتو تابستانه لینن"
            maxLength={80}
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "در حال ذخیره..." : "ذخیره نام"}
          </Button>
        </div>
      </form>
    </DashboardModal>
  );
}
