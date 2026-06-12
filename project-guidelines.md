# راهنمای پروژه طراحی لباس سفارشی

## پالت رنگ و تنظیمات Tailwind

- رنگ غالب: سفید خالص `#FFFFFF` و سفید شفاف برای سطح‌های شیشه‌ای.
- رنگ پس‌زمینه فرعی: خاکستری بسیار روشن و گرادیان‌های محو یاسی.
- رنگ اصلی/اکسنت: یاسی `#C8A2C8` با طیف‌های `lilac-100` تا `lilac-600`.
- فونت اصلی: `Vazirmatn` از پکیج `@fontsource/vazirmatn`.
- مسیر تنظیمات: `tailwind.config.ts`.
- کلیدهای مهم Tailwind:
  - `colors.lilac.300 = #C8A2C8`
  - `fontFamily.vazir`
  - `boxShadow.glass`
  - `boxShadow.soft-lilac`
  - `backgroundImage.lilac-mesh`

## قوانین طراحی Glassmorphism

- کلاس پایه کارت‌ها: `glass-panel`
- کلاس پایه چیپ‌ها و دکمه‌های شیشه‌ای: `glass-chip`
- ترکیب پیشنهادی سطح‌ها:
  - `border border-white/70`
  - `bg-white/45` تا `bg-white/60`
  - `backdrop-blur-xl` یا `backdrop-blur-2xl`
  - `shadow-glass` برای کارت‌های اصلی
  - `shadow-soft-lilac` برای حالت انتخاب‌شده یا hover
- گوشه‌ها باید نرم و بزرگ باشند: `rounded-[1.5rem]` تا `rounded-[2rem]`.
- چیدمان باید خلوت، کم‌تراکم، راست‌به‌چپ و دارای فضای سفید کافی باشد.
- از رنگ‌های تند و پس‌زمینه‌های شلوغ استفاده نشود.

## ساختار پوشه‌ها

```txt
app/
  layout.tsx
  page.tsx
  globals.css
components/
  design/
    DesignStepper.tsx
    StepGender.tsx
    StepFabric.tsx
    StepSketch.tsx
    StepProcessing.tsx
    StepResult.tsx
    StepIndicator.tsx
    OptionCard.tsx
    GarmentIcon.tsx
  ui/
    button.tsx
    card.tsx
    textarea.tsx
constants/
  design-options.ts
hooks/
  useDesignLogic.ts
lib/
  design-prompt.ts
  utils.ts
types/
  design.ts
```

## دستورالعمل معماری تمیز

- کامپوننت‌های `components/design` فقط مسئول نمایش و دریافت رویدادهای کاربر هستند.
- منطق جریان مرحله‌ای، اعتبارسنجی، ساخت state و شبیه‌سازی تولید تصویر فقط در `hooks/useDesignLogic.ts` قرار می‌گیرد.
- ساخت پرامپت و داده‌های خروجی تصویر فقط در `lib/design-prompt.ts` انجام می‌شود.
- داده‌های ثابت مانند جنسیت، نوع لباس، پارچه و متن مراحل فقط در `constants/design-options.ts` نگهداری می‌شوند.
- تایپ‌های دامنه در `types/design.ts` تعریف می‌شوند و نباید داخل کامپوننت‌ها تکرار شوند.
- هر مرحله باید شرط تکمیل مستقل داشته باشد و کاربر بدون تکمیل مرحله فعلی به مرحله بعد نرود.
- متن رابط کاربری باید کاملاً فارسی باشد؛ نام متغیرها و توابع می‌توانند انگلیسی و معنادار باشند.
- کامپوننت‌ها کوچک، قابل تست و تک‌مسئولیتی باشند؛ از تکرار کلاس‌ها با helperهایی مثل `OptionCard` و `cn` جلوگیری شود.
- برای افزودن API واقعی تولید تصویر، فقط hook و `lib/design-prompt.ts` تغییر کنند و UI مراحل بدون وابستگی مستقیم به API باقی بماند.
