"use client";

import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi2";
import { Button } from "@/shared/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/card";

import { useDesignStepper } from "@/features/designer/hooks/useDesignStepper";
import { StepFabric } from "./steps/StepFabric";
import { StepGender } from "./steps/StepGender";
import { StepIndicator } from "./components/StepIndicator";
import { StepResult } from "./steps/StepResult";
import { StepSketch } from "./steps/StepSketch";

export function DesignStepper() {
  const {
    currentStep,
    isLastStep,
    canGoNext,
    canGoBack,
    currentStepInfo,
    handleGoNext,
    handleGoBack,
    isGenerating,
  } = useDesignStepper();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-primary-300 sm:text-5xl">
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
          <div className="flex w-full items-center">
            <p className="whitespace-nowrap text-xs font-semibold text-primary-600">
              {currentStepInfo.eyebrow}
            </p>
            <div className="mx-3 h-px flex-1 rounded-full bg-primary-100/40" />
            <span className="w-fit whitespace-nowrap rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              مرحله {currentStep} از ۴
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="mt-2">{currentStepInfo.title}</CardTitle>
              <CardDescription>{currentStepInfo.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-h-[28rem] pt-5 sm:pt-6">
          {currentStep === 1 && <StepGender />}
          {currentStep === 2 && <StepFabric />}
          {currentStep === 3 && <StepSketch />}
          {currentStep === 4 && <StepResult />}
        </CardContent>

        {!isLastStep && (
          <div className="flex flex-col-reverse gap-3 border-t border-white/60 bg-white/35 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleGoBack}
              disabled={!canGoBack}
            >
              <HiOutlineArrowRight className="size-4" />
              بازگشت
            </Button>

            <Button
              type="button"
              onClick={handleGoNext}
              disabled={!canGoNext || isGenerating}
            >
              {currentStep === 3 ? "تولید تصویر" : "ادامه"}
              <HiOutlineArrowLeft className="size-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}