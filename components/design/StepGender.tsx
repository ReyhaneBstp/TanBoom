import { LuShirt } from "react-icons/lu";
import { GENDER_OPTIONS, GARMENT_TYPES } from "@/constants/design-options";
import type { Gender } from "@/types/design";
import { GarmentIcon } from "./GarmentIcon";
import { OptionCard } from "./OptionCard";
import { GiFemale, GiMale } from "react-icons/gi";

interface StepGenderProps {
  gender: Gender | null;
  garmentTypeId: string | null;
  onSelectGender: (gender: Gender) => void;
  onSelectGarment: (garmentTypeId: string) => void;
}

export function StepGender({ gender, garmentTypeId, onSelectGender, onSelectGarment }: StepGenderProps) {
  const filteredGarments = GARMENT_TYPES.filter((garment) => garment.gender === gender);

  return (
    <div className="flex flex-col gap-8 min-h-[22rem]">
      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground/80">جنسیت</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {GENDER_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              title={option.label}
              description={option.description}
              selected={gender === option.id}
              onClick={() => onSelectGender(option.id)}
              icon={
                option.id === "women" ? (
                  <GiFemale className="size-6" />
                ) : (
                  <GiMale className="size-6" />
                )
              }
              className="!rounded-2xl !p-5 !shadow-sm hover:!shadow-md transition-all duration-200"
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="mb-4 text-sm font-medium text-foreground/80">نوع پوشاک</h3>

        {!gender ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rose-200/70 bg-white/30 px-6 py-10 text-center backdrop-blur-xl">
            <LuShirt className="size-10 text-rose-300 animate-bounce" />
            <p className="text-sm text-muted-foreground max-w-xs">
              ابتدا یکی از گزینه‌های <span className="font-medium text-foreground/70">زنانه</span> یا{" "}
              <span className="font-medium text-foreground/70">مردانه</span> را انتخاب کنید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredGarments.map((garment) => (
              <OptionCard
                key={garment.id}
                title={garment.label}
                selected={garmentTypeId === garment.id}
                onClick={() => onSelectGarment(garment.id)}
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