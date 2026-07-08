import {
  GiArmoredPants,
  GiTShirt,
  GiSkirt,
  GiOutbackHat,
  GiPirateCoat,
  GiLargeDress,
  GiLabCoat,
  GiPoloShirt
} from "react-icons/gi";
import type { GarmentType } from "@/features/design/types/design";

interface GarmentIconProps {
  icon: GarmentType["icon"];
  className?: string;
}

export function GarmentIcon({ icon, className }: GarmentIconProps) {
  const Icon = {
    mensShirt: GiPoloShirt,
    shirt: GiTShirt,
    pants: GiArmoredPants,
    skirt: GiSkirt,
    hat: GiOutbackHat,
    coat: GiPirateCoat,
    manto: GiLabCoat,
    dress: GiLargeDress,
    shomiz: GiPoloShirt
  }[icon];

  return <Icon className={className} />;
}
