"use client";

import { useMemo } from "react";
import {
  STEPPER_STEPS,
  stepsInfo,
  STEP_IDS,
  StepId,
} from "@/features/design/definitions/design-steps";
import { useStepStore } from "../store/stepStore";
import { useGenderStore } from "../store/genderStore";
import { useGarmentStore } from "../store/garmentStore";
import { useFabricStore } from "../store/fabricStore";
import { useSketchStore } from "../store/sketchStore";
import { useGenerationStore } from "../store/generationStore";
import { useAccessoryStore } from "../store/accessoryStore";
import { useGlobalStore } from "@/shared/store/useGlobalStore";

const OPTIONAL_STEPS: readonly StepId[] = [
  STEP_IDS.ACCESSORIES,
];

export function useDesignStepper() {
  const currentStepId = useStepStore((s) => s.currentStepId);
  const gender = useGenderStore((s) => s.gender);
  const garmentTypeId = useGarmentStore((s) => s.garmentTypeId);
  const selectedFabricIds = useFabricStore((s) => s.selectedFabricIds);
  const fabricAssignments = useFabricStore((s) => s.fabricAssignments);
  const sketch = useSketchStore((s) => s.sketch);
  const generatedImages = useGenerationStore((s) => s.generatedImages);
  const selectedAccessories = useAccessoryStore((s) => s.selectedAccessories);
  const accessoryPlacements = useAccessoryStore((s) => s.accessoryPlacements);
  const setCurrentStepId = useStepStore((s) => s.setCurrentStepId);
  const showSnackbar = useGlobalStore((s) => s.showSnackbar);


  const currentStepIndex = useMemo(
    () => STEPPER_STEPS.findIndex((step) => step.id === currentStepId),
    [currentStepId]
  );

  const sketchStepComplete = useMemo(
    () =>
      Boolean(sketch.file) &&
      sketch.description.trim().length > 8 &&
      selectedFabricIds.every((id) => fabricAssignments[id]?.trim()) &&
      selectedAccessories.every((id) => accessoryPlacements[id]?.trim()),
    [
      sketch.file,
      sketch.description,
      selectedFabricIds,
      fabricAssignments,
      selectedAccessories,
      accessoryPlacements,
    ]
  );

  const completedSteps = useMemo(
    () =>
      [
        Boolean(gender && garmentTypeId),
        selectedFabricIds.length > 0,
        selectedAccessories.length > 0,
        sketchStepComplete,
        generatedImages.length > 0,
      ] as const,
    [
      gender,
      garmentTypeId,
      selectedFabricIds,
      selectedAccessories,
      sketchStepComplete,
      generatedImages,
    ]
  );

  const steps = useMemo(
    () =>
      STEPPER_STEPS.map((step, index) => ({
        ...step,
        isActive: currentStepId === step.id,
        isCompleted: completedSteps[index],
        isOptional: OPTIONAL_STEPS.includes(step.id),
      })),
    [currentStepId, completedSteps]
  );

  const currentStep = steps[currentStepIndex];

  const canGoNext =
    currentStepId === STEP_IDS.SKETCH ||
    currentStep?.isOptional ||
    currentStep?.isCompleted;

  const canGoBack = currentStepIndex > 0;

  const isLastStep = currentStepId === STEP_IDS.RESULT;

  const currentStepInfo = stepsInfo[currentStepId];

  const getSketchStepError = () => {
    if (!sketch.file) return "لطفاً تصویر اسکچ طرح خود را بارگذاری کنید.";
    if (sketch.description.trim().length <= 8)
      return "لطفاً توضیحات طراحی را کامل‌تر بنویسید (حداقل چند کلمه).";
    if (!selectedFabricIds.every((id) => fabricAssignments[id]?.trim()))
      return "لطفاً محل استفاده همه پارچه‌های انتخاب‌شده را مشخص کنید.";
    if (!selectedAccessories.every((id) => accessoryPlacements[id]?.trim()))
      return "لطفاً محل استفاده همه اکسسوری‌های انتخاب‌شده را مشخص کنید.";
    return null;
  };

  const handleGoNext = async () => {
    if (currentStepId === STEP_IDS.SKETCH) {
      const error = getSketchStepError();
      if (error) {
        showSnackbar(error, "error");
        return;
      }
      useGenerationStore.getState().reset();
    }

    if (!canGoNext) return;

    const nextIndex = currentStepIndex + 1;

    if (nextIndex < STEPPER_STEPS.length) {
      setCurrentStepId(STEPPER_STEPS[nextIndex].id);
    }
  };

  const handleGoBack = () => {
    if (!canGoBack) return;

    const prevIndex = currentStepIndex - 1;

    if (prevIndex >= 0) {
      setCurrentStepId(STEPPER_STEPS[prevIndex].id);
    }
  };

  return {
    currentStepId,
    currentStepIndex,
    currentStepInfo,
    steps,
    canGoNext,
    canGoBack,
    isLastStep,
    handleGoNext,
    handleGoBack,
  };
}
