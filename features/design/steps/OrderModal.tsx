"use client";

import { useState } from "react";
import {
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineDevicePhoneMobile,
} from "react-icons/hi2";
import { Button } from "@/shared/components/Button";
import { Label } from "@/shared/components/Label";
import { Input } from "@/shared/components/Input";
import { createOrder } from "@/server/actions/design-actions";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import { getActionErrorMessage } from "@/shared/utils/getActionErrorMessage";
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
  const [submitted, setSubmitted] = useState(false);
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

    if (loading) return;

    setLoading(true);
    try {
      await createOrder({
        designId,
        size,
        quantity,
        notes: notes || undefined,
        measurements,
      });
      setSubmitted(true);
    } catch (error: any) {
      showSnackbar(
        getActionErrorMessage(
          error,
          "ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید؛ اگر مشکل ادامه داشت با پشتیبانی تماس بگیرید."
        ),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <HiOutlineCheckCircle className="size-9 text-emerald-500" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">
            سفارش شما با موفقیت ثبت شد
          </h2>
          <div className="mt-4 rounded-2xl border border-primary-100 bg-primary-50/40 p-4 text-right">
            <p className="text-sm leading-7 text-foreground/85">
              چون قیمت هر لباس به طرح، پارچه و جزئیات دوخت بستگی دارد، تعیین
              قیمت توسط خیاط انجام می‌شود. طی{" "}
              <span className="font-bold">۲۴ ساعت آینده</span> قیمت سفارش شما
              مشخص می‌شود و{" "}
              <span className="font-bold">
                لینک پرداخت به‌همراه اطلاعات خیاط و راه ارتباطی با او
              </span>{" "}
              برایتان پیامک می‌شود تا سفارشتان را کامل کنید.
            </p>
            <p className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              منتظر پیامک ما باشید
              <HiOutlineDevicePhoneMobile className="size-4" />
            </p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            وضعیت سفارش را هر لحظه می‌توانید از داشبورد پیگیری کنید.
          </p>
          <Button type="button" onClick={onClose} className="mt-5 w-full">
            متوجه شدم
          </Button>
        </div>
      </div>
    );
  }

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

          <p className="rounded-xl bg-primary-50/60 p-3 text-xs leading-6 text-muted-foreground">
            بعد از ثبت سفارش، قیمت طی ۲۴ ساعت توسط خیاط تعیین می‌شود و لینک
            پرداخت و اطلاعات خیاط برایتان پیامک خواهد شد.
          </p>

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
