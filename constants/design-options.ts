import type { FabricOption, GarmentType, Gender } from "@/types/design";

const createPatternSvg = (primary: string, secondary: string, motif: "waves" | "dots" | "grid" | "floral") => {
  const motifMarkup = {
    waves: `<path d="M0 44 C28 20 52 68 80 44 S132 20 160 44" fill="none" stroke="${secondary}" stroke-width="10" stroke-linecap="round" opacity=".82"/><path d="M0 92 C28 68 52 116 80 92 S132 68 160 92" fill="none" stroke="${secondary}" stroke-width="8" stroke-linecap="round" opacity=".52"/>`,
    dots: `<g fill="${secondary}" opacity=".78"><circle cx="28" cy="28" r="9"/><circle cx="78" cy="58" r="6"/><circle cx="126" cy="30" r="8"/><circle cx="42" cy="112" r="7"/><circle cx="118" cy="108" r="10"/></g>`,
    grid: `<g stroke="${secondary}" stroke-width="6" opacity=".48"><path d="M40 0v160M88 0v160M136 0v160M0 40h160M0 88h160M0 136h160"/></g>`,
    floral: `<g fill="${secondary}" opacity=".72"><path d="M76 44c12-24 34-12 20 8 24-12 34 12 8 20 22 14 6 34-12 16-8 26-34 18-22-6-24 12-34-12-8-20-22-14-6-34 14-18Z"/><path d="M28 102c9-18 26-9 15 6 18-9 26 9 6 15 17 11 5 26-9 12-6 20-26 14-17-5-18 9-26-9-6-15-17-11-5-26 11-14Z"/></g>`
  }[motif];

  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="32" fill="${primary}"/><circle cx="132" cy="18" r="52" fill="#fff" opacity=".2"/>${motifMarkup}</svg>`
  )}`;
};

export const GENDER_OPTIONS: Array<{ id: Gender; label: string; description: string }> = [
  { id: "women", label: "زنانه", description: "فرم‌های لطیف، ظریف و آزاد" },
  { id: "men", label: "مردانه", description: "فرم‌های تمیز، مینیمال و کاربردی" }
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

export const FABRIC_OPTIONS: FabricOption[] = [
  { id: "solid-rose", kind: "solid", label: "یاسی", hex: "#C8A2C8" },
  { id: "solid-ivory", kind: "solid", label: "استخوانی", hex: "#F8F4EC" },
  { id: "solid-sage", kind: "solid", label: "مریم‌گلی", hex: "#BFCAB5" },
  { id: "solid-rose", kind: "solid", label: "رز ملایم", hex: "#EBC6CF" },
  { id: "solid-sky", kind: "solid", label: "آبی مه‌آلود", hex: "#C9DDF2" },
  { id: "solid-charcoal", kind: "solid", label: "زغالی", hex: "#3D3A40" },
  {
    id: "pattern-waves",
    kind: "patterned",
    label: "موج یاسی",
    imageData: createPatternSvg("#F6EAF7", "#B47AB4", "waves")
  },
  {
    id: "pattern-dots",
    kind: "patterned",
    label: "خال‌دار نرم",
    imageData: createPatternSvg("#FFF7F1", "#D79CB8", "dots")
  },
  {
    id: "pattern-grid",
    kind: "patterned",
    label: "چهارخانه روشن",
    imageData: createPatternSvg("#EFF5FF", "#9EB1D9", "grid")
  },
  {
    id: "pattern-floral",
    kind: "patterned",
    label: "گل‌ریز",
    imageData: createPatternSvg("#F8F7EE", "#AEBB91", "floral")
  }
];

export const STEPPER_STEPS = [
  { id: 1, title: "نوع لباس", caption: "جنسیت و مدل" },
  { id: 2, title: "پارچه", caption: "رنگ یا طرح" },
  { id: 3, title: "طرح اولیه", caption: "اسکچ و توضیح" },
  { id: 4, title: "پردازش", caption: "پرامپت هوشمند" },
  { id: 5, title: "خروجی", caption: "نماهای خیاطی" }
] as const;
