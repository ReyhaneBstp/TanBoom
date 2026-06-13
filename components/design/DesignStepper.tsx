"use client";

import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDesignStore } from "@/store/useDesignStore";
import { StepFabric } from "./StepFabric";
import { StepGender } from "./StepGender";
import { StepIndicator } from "./StepIndicator";
import { StepProcessing } from "./StepProcessing";
import { StepResult } from "./StepResult";
import { StepSketch } from "./StepSketch";

const stepCopy = {
  1: {
    eyebrow: "شروع انتخاب",
    title: "نوع لباس را انتخاب کنید",
    description:
      "ابتدا جنسیت و سپس نوع لباس را تعیین کنید تا مسیر طراحی دقیق‌تر شود.",
  },
  2: {
    eyebrow: "انتخاب متریال",
    title: "پارچه‌های دلخواه را اضافه کنید",
    description:
      "رنگ‌های ساده و طرح‌های پارچه‌ای می‌توانند هم‌زمان در طراحی نهایی استفاده شوند.",
  },
  3: {
    eyebrow: "اسکچ و جزئیات",
    title: "طرح پایه و توضیح کامل را وارد کنید",
    description:
      "اسکچ دستی و توضیحات شما مبنای پرامپت دقیق تولید تصویر قرار می‌گیرد.",
  },
  4: {
    eyebrow: "پردازش هوشمند",
    title: "ساخت پرامپت و شبیه‌سازی تولید تصویر",
    description:
      "فرانت‌اند داده‌ها را به پرامپت قابل ارسال به Image Generation API تبدیل می‌کند.",
  },
  5: {
    eyebrow: "تحویل نهایی",
    title: "خروجی چندنما برای خیاط آماده است",
    description:
      "نماهای روبه‌رو، پشت و کنار برای بررسی فرم و جزئیات دوخت نمایش داده می‌شوند.",
  },
} as const;

export function DesignStepper() {
  const currentStep = useDesignStore((s) => s.currentStep);
  const goBack = useDesignStore((s) => s.goBack);
  const goNext = useDesignStore((s) => s.goNext);
  const isGenerating = useDesignStore((s) => s.isGenerating);
  const gender = useDesignStore((s) => s.gender);
  const garmentTypeId = useDesignStore((s) => s.garmentTypeId);
  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const sketch = useDesignStore((s) => s.sketch);
  const generatedImages = useDesignStore((s) => s.generatedImages);

  const completedSteps = [
    Boolean(gender && garmentTypeId),
    selectedFabricIds.length > 0,
    Boolean(sketch.file && sketch.description.trim().length > 8),
    generatedImages.length > 0,
    generatedImages.length > 0,
  ];

  const canGoNext = currentStep < 4 && completedSteps[currentStep - 1];
  const canGoBack = currentStep > 1 && !isGenerating;

  const copy = stepCopy[currentStep as keyof typeof stepCopy];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            طراحی لباسی نو؛{" "}
          </h1>
          <p className="mt-4 text-2xl leading-2 text-muted-foreground">
            با روایتی از سمت تو ...
          </p>
        </div>

        <div className="w-full lg:w-[28rem]">
          <StepIndicator />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/60 bg-white/35">
          <div className="flex items-center w-full">
            <p className="text-xs font-semibold text-rose-600 whitespace-nowrap">
              {copy.eyebrow}
            </p>
            <div className="flex-1 mx-3 h-px bg-rose-200/40 rounded-full" />
            <span className="w-fit rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground whitespace-nowrap">
              مرحله {currentStep} از ۵
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="mt-2">{copy.title}</CardTitle>
              <CardDescription>{copy.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-h-[28rem] pt-5 sm:pt-6">
          {currentStep === 1 && <StepGender />}
          {currentStep === 2 && <StepFabric />}
          {currentStep === 3 && <StepSketch />}
          {currentStep === 4 && <StepProcessing />}
          {currentStep === 5 && <StepResult />}
        </CardContent>

        {currentStep < 4 && (
          <div className="flex flex-col-reverse gap-3 border-t border-white/60 bg-white/35 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={!canGoBack}
            >
              <HiOutlineArrowRight className="size-4" />
              بازگشت
            </Button>

            <Button
              type="button"
              onClick={goNext}
              disabled={!canGoNext || isGenerating}
            >
              {currentStep === 3 ? "ساخت پرامپت" : "ادامه"}
              <HiOutlineArrowLeft className="size-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}