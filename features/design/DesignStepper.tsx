"use client";

import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi2";
import { StepFabric } from "./steps/StepFabric";
import { StepAccessories } from "./steps/StepAccessories";
import { StepGender } from "./steps/StepGender";
import { StepIndicator } from "./components/StepIndicator";
import { StepResult } from "./steps/StepResult";
import { StepSketch } from "./steps/StepSketch";
import { StepMeasurements } from "./steps/StepMeasurements";
import { useGenerateDesign } from "./hooks/useGenerateDesign";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { useDesignStepper } from "./hooks/useDesignStepper";
import { STEP_IDS } from "./definitions/design-steps";


export function DesignStepper() {
  const {
    currentStepId,
    isLastStep,
    canGoNext,
    canGoBack,
    currentStepInfo,
    handleGoNext,
    handleGoBack,
  } = useDesignStepper();

  const { isGeneratingFront, isGeneratingBack } = useGenerateDesign();
  const isGenerating = isGeneratingFront || isGeneratingBack;

  return (
    <div className="mx-auto w-full max-w-5xl pt-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <h1 className="md:text-[2.75rem] font-semibold tracking-[-0.03em] text-primary-500 text-5xl">
            طراحی لباسی نو؛{" "}
          </h1>
          <p className="mt-3 text-xl leading-2 text-primary-500 tracking-[-0.001em]">
            با روایتی از سمت تو ...
          </p>
        </div>
        <div className="w-full lg:w-[35rem]">
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
              مرحله {useDesignStepper().currentStepIndex + 1} از {6}
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
          {currentStepId === STEP_IDS.GENDER && <StepGender />}
          {currentStepId === STEP_IDS.FABRIC && <StepFabric />}
          {currentStepId === STEP_IDS.ACCESSORIES && <StepAccessories />}
          {currentStepId === STEP_IDS.SKETCH && <StepSketch />}
          {currentStepId === STEP_IDS.MEASUREMENTS && <StepMeasurements />}
          {currentStepId === STEP_IDS.RESULT && <StepResult />}
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
              {currentStepId === STEP_IDS.MEASUREMENTS ? "تولید تصویر" : "ادامه"}
              <HiOutlineArrowLeft className="size-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
