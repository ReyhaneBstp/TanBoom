import {
  HiOutlineBriefcase,
  HiOutlineCake,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineSquare2Stack,
  HiOutlineUserCircle
} from "react-icons/hi2";

import type { GarmentType } from "@/types/design";

interface GarmentIconProps {
  icon: GarmentType["icon"];
  className?: string;
}

export function GarmentIcon({ icon, className }: GarmentIconProps) {
  const Icon = {
    shirt: HiOutlineSparkles,
    pants: HiOutlineSquare2Stack,
    skirt: HiOutlineCake,
    hat: HiOutlineUserCircle,
    coat: HiOutlineBriefcase,
    dress: HiOutlineShoppingBag
  }[icon];

  return <Icon className={className} />;
}
