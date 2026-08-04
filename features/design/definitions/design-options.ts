import type {
  Accessory,
  GarmentPartType,
  GarmentType,
  MeasurementCategory,
} from "@/features/design/types/design";

export const GENDER_OPTIONS = [
  { id: "women" as const, label: "زنانه", description: "برای مشاهده انواع پوشاک بانوان کلیک کنید!" },
  { id: "men" as const, label: "مردانه", description: "برای مشاهده انواع پوشاک آقایان کلیک کنید!" },
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
  { id: "mens-tshirt", gender: "men", label: "تی‌شرت", icon: "shirt" },
  { id: "men-pants", gender: "men", label: "شلوار", icon: "pants" },
  { id: "men-hat", gender: "men", label: "کلاه", icon: "hat" },
];

export const FABRIC_MATERIALS = [
  "پنبه",
  "کتان",
  "ابریشم",
  "ساتن",
  "کرپ",
  "لینن",
  "جین",
  "مخمل",
  "فوتر",
  "حریر",
  "گیپور",
  "تور",
  "شیفون",
  "ژاکارد",
  "ترگال",
  "نخ پنبه",
  "ویسکوز",
  "پلی‌استر",
  "میکرو",
  "لمه",
  "بافت",
  "تریکو",
  "دورس",
  "سوییت",
  "خز",
  "چرم",
  "جیر",
  "فاستونی",
  "پشمی",
  "ترمه",
  "کشمیر",
  "تویید",
  "فلانل",
  "پوپلین",
  "آکسفورد",
  "شامبری",
  "کدری",
  "کج‌راه (تویل)",
  "گاباردین",
  "کتان کش",
  "لی زغالی",
  "مله",
  "پارچه کت و شلواری",
];


export const ACCESSORIES: Accessory[] = [
  { id: "buttons", label: "دکمه" },
  { id: "zipper", label: "زیپ" },
  { id: "pearl-trim", label: "مروارید" },
  { id: "sequins", label: "پولک" },
  { id: "rhinestones", label: "نگین" },
  { id: "bow", label: "پاپیون" },
  { id: "ribbon", label: "روبان" },
  { id: "embroidery", label: "دانتل" },
  { id: "decorative-patch", label: "ریشه لباس" },
  { id: "tassels", label: "آویز منگوله‌دار" },
  { id: "pompom", label: "پوم‌پوم" },
  { id: "feather", label: "پر" },
  { id: "chain", label: "زنجیر" },
  { id: "metal-ring", label: "حلقه فلزی" },
  { id: "lace-trim", label: "تور گیپور" },
  { id: "applique", label: "اپلیکه" },
];



export const GARMENT_MEASUREMENT_CATEGORY: Record<string, MeasurementCategory> = {
  "women-shomiz": "upper_body",
  "women-manto": "full_body",
  "women-coat": "full_body",
  "women-pants": "lower_body",
  "women-skirt": "lower_body",
  "women-dress": "full_body",
  "women-shirt": "upper_body",
  "women-hat": "head",
  "men-coat": "full_body",
  "mens-shirt": "upper_body",
  "men-shirt": "upper_body",
  "men-pants": "lower_body",
  "men-hat": "head",
};

export const MEASUREMENT_FIELDS_BY_CATEGORY: Record<
  MeasurementCategory,
  { key: string; label: string; placeholder: string }[]
> = {
  upper_body: [
    { key: "height_cm", label: "قد لباس", placeholder: "مثلاً ۷۰" },
    { key: "shoulder_cm", label: "سرشانه", placeholder: "مثلاً ۳۸" },
    { key: "chest_cm", label: "دور سینه", placeholder: "مثلاً ۹۰" },
    { key: "waist_cm", label: "دور کمر", placeholder: "مثلاً ۷۵" },
    { key: "sleeve_length_cm", label: "قد آستین", placeholder: "مثلاً ۶۰" },
    { key: "upper_arm_cm", label: "دور بازو", placeholder: "مثلاً ۳۰" },
  ],

  lower_body: [
    { key: "height_cm", label: "قد شلوار / دامن", placeholder: "مثلاً ۱۰۰" },
    { key: "rise_cm", label: "قد فاق", placeholder: "مثلاً ۲۸" },
    { key: "waist_cm", label: "دور کمر", placeholder: "مثلاً ۸۰" },
    { key: "hips_cm", label: "دور باسن", placeholder: "مثلاً ۱۰۰" },
    { key: "thigh_cm", label: "دور ران", placeholder: "مثلاً ۵۸" },
    { key: "knee_cm", label: "دور زانو", placeholder: "مثلاً ۳۸" },
    { key: "calf_cm", label: "دور ساق", placeholder: "مثلاً ۳۵" },
  ],

  head: [
    { key: "head_circumference_cm", label: "دور سر", placeholder: "مثلاً ۵۶" },
  ],

  full_body: [
    { key: "height_cm", label: "قد لباس", placeholder: "مثلاً ۱۱۰" },
    { key: "shoulder_cm", label: "سرشانه", placeholder: "مثلاً ۳۸" },
    { key: "chest_cm", label: "دور سینه", placeholder: "مثلاً ۹۰" },
    { key: "waist_cm", label: "دور کمر", placeholder: "مثلاً ۷۵" },
    { key: "hips_cm", label: "دور باسن", placeholder: "مثلاً ۹۵" },
    { key: "armhole_cm", label: "دور حلقه آستین", placeholder: "مثلاً ۴۴" },
    { key: "sleeve_length_cm", label: "قد آستین", placeholder: "مثلاً ۶۰" },
    { key: "upper_arm_cm", label: "دور بازو", placeholder: "مثلاً ۳۰" },
    { key: "wrist_cm", label: "دور مچ", placeholder: "مثلاً ۱۶" },
  ],
};

/** برچسب فارسی هر اندازه برای نمایش در کارت سفارش */
export const MEASUREMENT_LABELS: Record<string, string> = Object.values(
  MEASUREMENT_FIELDS_BY_CATEGORY
)
  .flat()
  .reduce<Record<string, string>>((acc, field) => {
    acc[field.key] ??= field.label;
    return acc;
  }, {});

/** برچسب فارسی هر نوع بخش لباس برای نمایش در فرم مرحلهٔ بخش‌ها */
export const GARMENT_PART_LABELS: Record<GarmentPartType, string> = {
  base: "فرم پایه",
  neckline: "یقه",
  sleeve: "آستین",
};

/**
 * نوع لباس هر گارمنت به یک baseKey در کالکشن garment_parts نگاشت می‌شود.
 * انواعی که پایهٔ اختصاصی ندارند (مثل کت) در اینجا نیستند و بخش «فرم پایه»
 * برایشان گزینه‌ای نشان نمی‌دهد.
 */
export const GARMENT_BASE_KEY: Record<string, string> = {
  "women-shomiz": "shomiz",
  "women-manto": "manto",
  "women-pants": "pants",
  "women-skirt": "skirt",
  "women-dress": "dress",
  "women-hat": "hat",
  "mens-shirt": "shirt",
  "mens-tshirt": "tshirt",
  "men-pants": "pants",
  "men-hat": "hat",
};

/**
 * بخش‌های قابل‌نمایش برای هر نوع لباس بر اساس دستهٔ اندازه‌گیری:
 * بالاتنه/تمام‌تنه → پایه + یقه + آستین، پایین‌تنه/سر → فقط پایه.
 */
export const GARMENT_PART_CATEGORIES: Record<
  MeasurementCategory,
  GarmentPartType[]
> = {
  upper_body: ["base", "neckline", "sleeve"],
  full_body: ["base", "neckline", "sleeve"],
  lower_body: ["base"],
  head: ["base"],
};
