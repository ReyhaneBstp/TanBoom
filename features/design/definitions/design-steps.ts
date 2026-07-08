export const STEP_IDS = {
  GENDER: "gender",
  FABRIC: "fabric",
  SKETCH: "sketch",
  MEASUREMENTS: "measurements",
  RESULT: "result",
} as const;

export type StepId = (typeof STEP_IDS)[keyof typeof STEP_IDS];

export const STEPPER_STEPS = [
  { id: STEP_IDS.GENDER, label: "انتخاب نوع" },
  { id: STEP_IDS.FABRIC, label: "انتخاب پارچه" },
  { id: STEP_IDS.SKETCH, label: "طراحی" },
  { id: STEP_IDS.MEASUREMENTS, label: "سایزبندی" },
  { id: STEP_IDS.RESULT, label: "نتیجه" },
] as const;

export const stepsInfo: Record<StepId, { eyebrow: string; title: string; description: string }> = {
  [STEP_IDS.GENDER]: {
    eyebrow: "شروع انتخاب",
    title: "چه لباسی مد نظرته؟",
    description: "جنسیت و نوع لباس رو مشخص کن تا مسیر طراحی دقیق‌تر بشه..",
  },
  [STEP_IDS.FABRIC]: {
    eyebrow: "انتخاب متریال",
    title: "پارچه‌های لباست رو انتخاب کن",
    description:
      "در این مرحله، پارچه‌های تشکیل‌دهنده‌ی لباست رو مشخص کن.",
  },
  [STEP_IDS.SKETCH]: {
    eyebrow: "طراحی اولیه",
    title: "طرح لباست رو روی کاغذ بکش",
    description: "اسکچ دستی و توضیحات شما مبنای تولید تصویر قرار می‌گیره. پس بهتره جزئیات طراحیت رو دقیق برامون توصیف کنی",
  },
  [STEP_IDS.MEASUREMENTS]: {
    eyebrow: "سایز و اندازه",
    title: "قد و اندازه‌های بدن",
    description: "قد دلخواه لباس و سایزبندیش رو مشخص کن تا اندازه لباس دقیق‌تر بشه.",
  },
  [STEP_IDS.RESULT]: {
    eyebrow: "نتیجه",
    title: "تصویر طراحی شده",
    description: "اگه لباست زنده بشه چه شکلی میشه؟",
  },
};