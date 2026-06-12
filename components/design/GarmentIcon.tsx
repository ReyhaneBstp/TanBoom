import {
  GiArmoredPants,
  GiTShirt,
  GiSkirt,
  GiOutbackHat,
  GiPirateCoat,
  GiLargeDress,
} from "react-icons/gi";
import type { GarmentType } from "@/types/design";

interface GarmentIconProps {
  icon: GarmentType["icon"];
  className?: string;
}

export function GarmentIcon({ icon, className }: GarmentIconProps) {
  const Icon = {
    shirt: GiTShirt,
    pants: GiArmoredPants,
    skirt: GiSkirt,
    hat: GiOutbackHat,
    coat: GiPirateCoat,
    dress: GiLargeDress,
  }[icon];

  return <Icon className={className} />;
}
