import { HiOutlineUser, HiOutlineUsers } from "react-icons/hi2";

import { GENDER_OPTIONS, GARMENT_TYPES } from "@/constants/design-options";
import type { Gender } from "@/types/design";
import { GarmentIcon } from "./GarmentIcon";
import { OptionCard } from "./OptionCard";

interface StepGenderProps {
  gender: Gender | null;
  garmentTypeId: string | null;
  onSelectGender: (gender: Gender) => void;
  onSelectGarment: (garmentTypeId: string) => void;
}

export function StepGender({ gender, garmentTypeId, onSelectGender, onSelectGarment }: StepGenderProps) {
  const filteredGarments = GARMENT_TYPES.filter((garment) => garment.gender === gender);

  return (
    <div className="gap-5 flex flex-col justify-between min-h-[18rem]">
      <div className="grid gap-3 sm:grid-cols-2">
        {GENDER_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            title={option.label}
            description={option.description}
            selected={gender === option.id}
            onClick={() => onSelectGender(option.id)}
            icon={option.id === "women" ? <HiOutlineUsers /> : <HiOutlineUser />}
          />
        ))}
      </div>

      <div>
        {!gender ? (
          <div className="rounded-[1.4rem] border border-dashed border-rose-200 bg-white/40 px-4 py-5 text-center text-xs text-muted-foreground backdrop-blur-xl">
            ابتدا یکی از گزینه‌های زنانه یا مردانه را انتخاب کنید.
          </div>
        ) : 
        (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {filteredGarments.map((garment) => (
            <OptionCard
              key={garment.id}
              title={garment.label}
              selected={garmentTypeId === garment.id}
              onClick={() => onSelectGarment(garment.id)}
              className="items-center text-center"
              icon={<GarmentIcon icon={garment.icon} className="size-6" />}
            />
          ))}
        </div>
        )
        }
      </div>
    </div>
  );
}
