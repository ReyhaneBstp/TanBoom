"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { createOrder } from "@/server/actions/design-actions";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
// import { toast } from "react-hot-toast";

interface OrderModalProps {
  designId: string;
  onClose: () => void;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "سفارشی"];

export function OrderModal({ designId, onClose }: OrderModalProps) {
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useGlobalStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrder({
        designId,
        size,
        quantity,
        notes: notes || undefined,
      });
      showSnackbar("سفارش شما با موفقیت ثبت شد", "success");
      onClose();
    } catch (error: any) {
      showSnackbar("خطا در ثبت سفارش", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">ثبت سفارش</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">سایز</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">تعداد</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">توضیحات</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ثبت..." : "ثبت سفارش"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
