import type { GarmentType } from "@/features/designer/types/design";

export const GENDER_OPTIONS = [
  { id: "women" as const, label: "زنانه", description: "برای مشاهده انواع پوشاک بانوان کلیک کنید!" },
  { id: "men" as const, label: "مردانه", description: "برای مشاهده انواع پوشاک آقاان کلیک کنید!" },
];

export const GARMENT_TYPES: GarmentType[] = [
  { id: "women-shomiz", gender: "women", label: "شومیز", icon: "shomiz" },
  { id: "women-manto", gender: "women", label: "مانتو", icon: "manto" },
  { id: "women-coat", gender: "women", label: "کت", icon: "coat" },
  { id: "women-pants", gender: "women", label: "شلوار", icon: "pants" },
  { id: "women-skirt", gender: "women", label: "دامن", icon: "skirt" },
  { id: "women-dress", gender: "women", label: "پیراهن", icon: "dress" },
  { id: "women-shirt", gender: "women", label: "تی‌شرت", icon: "shirt" },
  { id: "women-hat", gender: "women", label: "کلاه", icon: "hat" },

  { id: "men-coat", gender: "men", label: "کت", icon: "coat" },
  { id: "mens-shirt", gender: "men", label: "پیراهن مردانه", icon: "mensShirt" },
  { id: "men-shirt", gender: "men", label: "تی‌شرت", icon: "shirt" },
  { id: "men-pants", gender: "men", label: "شلوار", icon: "pants" },
  { id: "men-hat", gender: "men", label: "کلاه", icon: "hat" }
];