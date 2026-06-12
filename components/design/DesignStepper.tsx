"use client";

import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineSparkles,
} from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDesignLogic } from "@/hooks/useDesignLogic";
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
  const logic = useDesignLogic();
  const copy = stepCopy[logic.currentStep as keyof typeof stepCopy];

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
          <StepIndicator
            currentStep={logic.currentStep}
            completedSteps={logic.completedSteps}
          />
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
              مرحله {logic.currentStep} از ۵
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
          {logic.currentStep === 1 ? (
            <StepGender
              gender={logic.formState.gender}
              garmentTypeId={logic.formState.garmentTypeId}
              onSelectGender={logic.selectGender}
              onSelectGarment={logic.selectGarment}
            />
          ) : null}

          {logic.currentStep === 2 ? (
            <StepFabric
              activeFabricKind={logic.activeFabricKind}
              selectedFabricIds={logic.formState.selectedFabricIds}
              onChangeKind={logic.setActiveFabricKind}
              onToggleFabric={logic.toggleFabric}
            />
          ) : null}

          {logic.currentStep === 3 ? (
            <StepSketch
              previewUrl={logic.formState.sketch.previewUrl}
              description={logic.formState.sketch.description}
              onFileChange={logic.updateSketchFile}
              onDescriptionChange={logic.updateDescription}
            />
          ) : null}

          {logic.currentStep === 4 ? (
            <StepProcessing
              enhancedPrompt={logic.enhancedPrompt}
              isGenerating={logic.isGenerating}
            />
          ) : null}

          {logic.currentStep === 5 ? (
            <StepResult
              images={logic.generatedImages}
              enhancedPrompt={logic.enhancedPrompt}
              onRestart={logic.restart}
            />
          ) : null}
        </CardContent>

        {logic.currentStep < 4 ? (
          <div className="flex flex-col-reverse gap-3 border-t border-white/60 bg-white/35 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <Button
              type="button"
              variant="ghost"
              onClick={logic.goBack}
              disabled={!logic.canGoBack}
            >
              <HiOutlineArrowRight className="size-4" />
              بازگشت
            </Button>

            <Button
              type="button"
              onClick={logic.goNext}
              disabled={!logic.canGoNext || logic.isGenerating}
            >
              {logic.currentStep === 3 ? "ساخت پرامپت" : "ادامه"}
              <HiOutlineArrowLeft className="size-4" />
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
