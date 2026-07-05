"use client";

import { LuShirt } from "react-icons/lu";
import { GENDER_OPTIONS, GARMENT_TYPES } from "@/features/designer/definitions/design-options";
import { useDesignStore } from "@/features/designer/store/useDesignStore";
import { GarmentIcon } from "../components/GarmentIcon";
import { OptionCard } from "../components/OptionCard";
import { GiFemale, GiMale } from "react-icons/gi";

export function StepGender() {
  const gender = useDesignStore((s) => s.gender);
  const garmentTypeId = useDesignStore((s) => s.garmentTypeId);
  const setGender = useDesignStore((s) => s.setGender);
  const setGarment = useDesignStore((s) => s.setGarment);

  const filteredGarments = GARMENT_TYPES.filter(
    (garment) => garment.gender === gender
  );

  return (
    <div className="flex flex-col gap-8 min-h-[22rem]">
      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground/80">جنسیت</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {GENDER_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              title={option.label}
              description={option.description}
              selected={gender === option.id}
              onClick={() => setGender(option.id)}
              icon={
                option.id === "women" ? (
                  <GiFemale className="size-6" />
                ) : (
                  <GiMale className="size-6" />
                )
              }
              className="!rounded-2xl !p-3 !shadow-sm hover:!shadow-md transition-all duration-200"
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="mb-4 text-sm font-medium text-foreground/80">
          نوع پوشاک
        </h3>

        {!gender ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary-200/70 bg-white/30 px-6 py-10 text-center backdrop-blur-xl">
            <LuShirt className="size-10 text-primary-300 animate-bounce" />
            <p className="text-sm text-muted-foreground max-w-xs">
              ابتدا یکی از گزینه‌های{" "}
              <span className="font-medium text-foreground/70">زنانه</span> یا{" "}
              <span className="font-medium text-foreground/70">مردانه</span> را
              انتخاب کنید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredGarments.map((garment) => (
              <OptionCard
                key={garment.id}
                title={garment.label}
                selected={garmentTypeId === garment.id}
                onClick={() => setGarment(garment.id)}
                className="items-center text-center !rounded-xl !py-4 hover:!shadow-sm transition-all duration-200"
                icon={<GarmentIcon icon={garment.icon} className="size-6" />}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}