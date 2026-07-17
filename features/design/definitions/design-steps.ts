export const STEP_IDS = {
  GENDER: "gender",
  FABRIC: "fabric",
  ACCESSORIES: "accessories",
  SKETCH: "sketch",
  RESULT: "result",
} as const;

export type StepId = (typeof STEP_IDS)[keyof typeof STEP_IDS];

export const STEPPER_STEPS = [
  { id: STEP_IDS.GENDER, label: "انتخاب نوع" },
  { id: STEP_IDS.FABRIC, label: "انتخاب پارچه" },
  { id: STEP_IDS.ACCESSORIES, label: "اکسسوری" },
  { id: STEP_IDS.SKETCH, label: "طراحی" },
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
  [STEP_IDS.ACCESSORIES]: {
    eyebrow: "جزئیات تزئینی",
    title: "اکسسوری و تزئینات دلخواه",
    description: "می‌تونی این مرحله رو رد کنی، یا یک یا چند مورد انتخاب کنی.",
  },
  [STEP_IDS.SKETCH]: {
    eyebrow: "طراحی اولیه",
    title: "طرح لباست رو روی کاغذ بکش",
    description: "اسکچ دستی و توضیحات شما مبنای تولید تصویر قرار می‌گیره. پس بهتره جزئیات طراحیت رو دقیق برامون توصیف کنی",
  },
  [STEP_IDS.RESULT]: {
    eyebrow: "نتیجه",
    title: "تصویر طراحی شده",
    description: "اگه لباست زنده بشه چه شکلی میشه؟",
  },
};
