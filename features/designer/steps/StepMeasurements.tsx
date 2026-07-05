"use client";

import { useDesignStore } from "@/features/designer/store/useDesignStore";
import {
  GARMENT_MEASUREMENT_CATEGORY,
  MEASUREMENT_FIELDS_BY_CATEGORY,
} from "@/features/designer/definitions/design-options";
import type { BodyMeasurements } from "@/features/designer/types/design";
import { Label } from "@/shared/components/Label";
import { Input } from "@/shared/components/Input";


export function StepMeasurements() {
  const garmentTypeId = useDesignStore((s) => s.garmentTypeId);
  const measurements = useDesignStore((s) => s.measurements);
  const setMeasurements = useDesignStore((s) => s.setMeasurements);

  const category = garmentTypeId ? GARMENT_MEASUREMENT_CATEGORY[garmentTypeId] : undefined;
  const fields = category ? MEASUREMENT_FIELDS_BY_CATEGORY[category] : [];

  const handleChange = (key: string, value: string) => {
    const num = value === "" ? undefined : Number(value);
    const updated: BodyMeasurements = { ...measurements, [key]: num };

    Object.keys(updated).forEach((k) => {
      if (updated[k as keyof BodyMeasurements] === undefined) {
        delete updated[k as keyof BodyMeasurements];
      }
    });
    setMeasurements(updated);
  };

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[22rem] text-muted-foreground">
        لطفاً ابتدا نوع پوشاک را انتخاب کنید.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-h-[22rem]">
      <p className="text-sm text-muted-foreground">
        اندازه‌های زیر را بر اساس سانتی‌متر وارد کنید تا طراحی دقیقاً متناسب با بدن شما انجام شود.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="number"
              placeholder={field.placeholder}
              value={measurements[field.key as keyof BodyMeasurements] ?? ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              min={0}
              className="text-left"
            />
          </div>
        ))}
      </div>
    </div>
  );
}