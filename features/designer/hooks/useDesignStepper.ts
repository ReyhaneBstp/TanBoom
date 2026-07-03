"use client";

import { useMemo } from "react";
import { stepsInfo, STEPPER_STEPS } from "@/features/designer/definitions/design-steps";
import { useDesignStore } from "@/features/designer/store/useDesignStore";
import { useGenerateDesign } from "./useGenerateDesign";

export function useDesignStepper() {
  const currentStep = useDesignStore((s) => s.currentStep);
  const gender = useDesignStore((s) => s.gender);
  const garmentTypeId = useDesignStore((s) => s.garmentTypeId);
  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const sketch = useDesignStore((s) => s.sketch);
  const generatedImages = useDesignStore((s) => s.generatedImages);

  const { generateFront } = useGenerateDesign();

  const completedSteps = useMemo(
    () =>
      [
        Boolean(gender && garmentTypeId),
        selectedFabricIds.length > 0,
        Boolean(sketch.file && sketch.description.trim().length > 8),
        generatedImages.length > 0,
      ] as const,
    [
      gender,
      garmentTypeId,
      selectedFabricIds,
      sketch.file,
      sketch.description,
      generatedImages,
    ]
  );

  const steps = useMemo(
    () =>
      STEPPER_STEPS.map((step, index) => ({
        ...step,
        isActive: currentStep === index + 1,
        isCompleted: completedSteps[index],
      })),
    [currentStep, completedSteps]
  );

  const canGoNext =
    currentStep < STEPPER_STEPS.length &&
    completedSteps[currentStep - 1];

  const canGoBack = currentStep > 1;

  const isLastStep = currentStep === STEPPER_STEPS.length;

  const currentStepInfo =
    stepsInfo[currentStep as keyof typeof stepsInfo];

  const handleGoNext = async () => {
    if (!canGoNext) return;

    if (currentStep === 3) {
      await generateFront();
      return;
    }

    useDesignStore.setState((state) => ({
      currentStep: state.currentStep + 1,
    }));
  };

  const handleGoBack = () => {
    if (!canGoBack) return;

    useDesignStore.setState((state) => ({
      currentStep: state.currentStep - 1,
    }));
  };

  return {
    currentStep,
    currentStepInfo,
    steps,
    canGoNext,
    canGoBack,
    isLastStep,
    handleGoNext,
    handleGoBack,
  };
}