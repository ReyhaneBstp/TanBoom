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

const OPTIONAL_STEPS: readonly StepId[] = [
  STEP_IDS.ACCESSORIES,
  STEP_IDS.SKETCH,
];

export function useDesignStepper() {
  const currentStepId = useStepStore((s) => s.currentStepId);
  const gender = useGenderStore((s) => s.gender);
  const garmentTypeId = useGarmentStore((s) => s.garmentTypeId);
  const selectedFabricIds = useFabricStore((s) => s.selectedFabricIds);
  const sketch = useSketchStore((s) => s.sketch);
  const generatedImages = useGenerationStore((s) => s.generatedImages);
  const selectedAccessories = useAccessoryStore((s) => s.selectedAccessories);
  const setCurrentStepId = useStepStore((s) => s.setCurrentStepId);


  const currentStepIndex = useMemo(
    () => STEPPER_STEPS.findIndex((step) => step.id === currentStepId),
    [currentStepId]
  );

  const completedSteps = useMemo(
    () =>
      [
        Boolean(gender && garmentTypeId),
        selectedFabricIds.length > 0,
        selectedAccessories.length > 0,
        Boolean(sketch.file && sketch.description.trim().length > 8),
        generatedImages.length > 0,
      ] as const,
    [
      gender,
      garmentTypeId,
      selectedFabricIds,
      selectedAccessories,
      sketch.file,
      sketch.description,
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

  const canGoNext = currentStep?.isOptional || currentStep?.isCompleted;

  const canGoBack = currentStepIndex > 0;

  const isLastStep = currentStepId === STEP_IDS.RESULT;

  const currentStepInfo = stepsInfo[currentStepId];

  const handleGoNext = async () => {
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
