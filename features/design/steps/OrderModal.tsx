"use client";

import { useState } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { Button } from "@/shared/components/Button";
import { Label } from "@/shared/components/Label";
import { Input } from "@/shared/components/Input";
import { createOrder } from "@/server/actions/design-actions";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import {
  GARMENT_MEASUREMENT_CATEGORY,
  MEASUREMENT_FIELDS_BY_CATEGORY,
} from "@/features/design/definitions/design-options";
import type {
  BodyMeasurements,
  MeasurementCategory,
} from "@/features/design/types/design";
import { useGarmentStore } from "../store/garmentStore";

interface OrderModalProps {
  designId: string;
  onClose: () => void;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "سفارشی"];

export function OrderModal({ designId, onClose }: OrderModalProps) {
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [measurements, setMeasurements] = useState<BodyMeasurements>({});
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useGlobalStore();

  const garmentTypeId = useGarmentStore((s) => s.garmentTypeId);
  const category: MeasurementCategory =
    (garmentTypeId && GARMENT_MEASUREMENT_CATEGORY[garmentTypeId]) ||
    "full_body";
  const fields = MEASUREMENT_FIELDS_BY_CATEGORY[category];

  const hasMeasurements = Object.values(measurements).some(
    (v) => typeof v === "number" && Number.isFinite(v)
  );

  const handleMeasurementChange = (key: string, value: string) => {
    const num = value === "" ? undefined : Number(value);
    setMeasurements((prev) => {
      const updated: BodyMeasurements = { ...prev, [key]: num };
      Object.keys(updated).forEach((k) => {
        if (updated[k as keyof BodyMeasurements] === undefined) {
          delete updated[k as keyof BodyMeasurements];
        }
      });
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMeasurements) {
      showSnackbar("لطفاً حداقل یکی از اندازه‌های بدن را وارد کنید", "error");
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        designId,
        size,
        quantity,
        notes: notes || undefined,
        measurements,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

          <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-4">
            <h3 className="text-sm font-semibold mb-1">اندازه‌های بدن</h3>
            <p className="text-xs text-muted-foreground mb-3">
              اندازه‌ها را بر اساس سانتی‌متر وارد کنید تا لباس دقیقاً متناسب با
              بدن شما دوخته شود.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <Label htmlFor={`order-${field.key}`}>{field.label}</Label>
                  <Input
                    id={`order-${field.key}`}
                    type="number"
                    placeholder={field.placeholder}
                    value={
                      measurements[field.key as keyof BodyMeasurements] ?? ""
                    }
                    onChange={(e) =>
                      handleMeasurementChange(field.key, e.target.value)
                    }
                    min={0}
                    className="text-left"
                  />
                </div>
              ))}
            </div>
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
              {loading ? (
                <>
                  <HiOutlineArrowPath className="size-4 animate-spin" />
                  در حال ثبت...
                </>
              ) : (
                "ثبت سفارش"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
