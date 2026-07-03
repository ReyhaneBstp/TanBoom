import type { GarmentType, PatternedFabric } from "@/app/designer/types/design";

export const GENDER_OPTIONS = [
  { id: "women" as const, label: "زنانه", description: "برای مشاهده انواع پوشاک بانوان کلیک کنید!" },
  { id: "men" as const, label: "مردانه", description: "برای مشاهده انواع پوشاک آقاان کلیک کنید!" },
];

export const GARMENT_TYPES: GarmentType[] = [
  { id: "women-dress", gender: "women", label: "پیراهن", icon: "dress" },
  { id: "women-skirt", gender: "women", label: "دامن", icon: "skirt" },
  { id: "women-shirt", gender: "women", label: "بلوز", icon: "shirt" },
  { id: "women-coat", gender: "women", label: "مانتو", icon: "coat" },
  { id: "women-pants", gender: "women", label: "شلوار", icon: "pants" },
  { id: "women-hat", gender: "women", label: "کلاه", icon: "hat" },
  { id: "men-shirt", gender: "men", label: "تی‌شرت", icon: "shirt" },
  { id: "men-pants", gender: "men", label: "شلوار", icon: "pants" },
  { id: "men-coat", gender: "men", label: "کت", icon: "coat" },
  { id: "men-hat", gender: "men", label: "کلاه", icon: "hat" }
];


const createDotsSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#fdf2f8"/>
  <circle cx="30" cy="30" r="12" fill="#db2777" opacity="0.6"/>
  <circle cx="100" cy="60" r="14" fill="#db2777" opacity="0.7"/>
  <circle cx="70" cy="140" r="12" fill="#db2777" opacity="0.5"/>
  <circle cx="150" cy="30" r="16" fill="#db2777" opacity="0.55"/>
  <circle cx="160" cy="150" r="13" fill="#db2777" opacity="0.65"/>
  <circle cx="30" cy="180" r="14" fill="#db2777" opacity="0.7"/>
</svg>`;

const createStripesSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#fef2f2"/>
  <line x1="0" y1="20" x2="200" y2="20" stroke="#b91c1c" stroke-width="12" opacity="0.6"/>
  <line x1="0" y1="70" x2="200" y2="70" stroke="#b91c1c" stroke-width="14" opacity="0.5"/>
  <line x1="0" y1="120" x2="200" y2="120" stroke="#b91c1c" stroke-width="16" opacity="0.55"/>
  <line x1="0" y1="170" x2="200" y2="170" stroke="#b91c1c" stroke-width="12" opacity="0.5"/>
</svg>`;

const createFloralSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#ecfdf5"/>
  <circle cx="50" cy="50" r="20" fill="#10b981" opacity="0.45"/>
  <circle cx="50" cy="50" r="8" fill="#facc15" opacity="0.7"/>
  <circle cx="140" cy="70" r="18" fill="#10b981" opacity="0.4"/>
  <circle cx="140" cy="70" r="7" fill="#facc15" opacity="0.65"/>
  <circle cx="90" cy="140" r="22" fill="#10b981" opacity="0.45"/>
  <circle cx="90" cy="140" r="9" fill="#facc15" opacity="0.7"/>
</svg>`;

const createPlaidSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#f1f5f9"/>
  <line x1="0" y1="0" x2="200" y2="200" stroke="#475569" stroke-width="6" opacity="0.3"/>
  <line x1="200" y1="0" x2="0" y2="200" stroke="#475569" stroke-width="6" opacity="0.3"/>
  <line x1="50" y1="0" x2="50" y2="200" stroke="#3b82f6" stroke-width="10" opacity="0.25"/>
  <line x1="0" y1="80" x2="200" y2="80" stroke="#3b82f6" stroke-width="10" opacity="0.25"/>
</svg>`;

export const MOCK_PATTERNED_FABRICS: PatternedFabric[] = [
  {
    id: "pattern-dots",
    kind: "patterned",
    label: "خال‌خالی",
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(createDotsSvg())}`,
  },
  {
    id: "pattern-stripes",
    kind: "patterned",
    label: "راه‌راه",
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(createStripesSvg())}`,
  },
  {
    id: "pattern-floral",
    kind: "patterned",
    label: "گل‌دار",
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(createFloralSvg())}`,
  },
  {
    id: "pattern-plaid",
    kind: "patterned",
    label: "چهارخانه",
    imageData: `data:image/svg+xml;utf8,${encodeURIComponent(createPlaidSvg())}`,
  },
];