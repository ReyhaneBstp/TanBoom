"use client";

import { useMemo } from "react";
import { STEPPER_STEPS, stepsInfo, STEP_IDS } from "@/features/design/definitions/design-steps";
import { useDesignStore } from "@/features/design/store/useDesignStore";
import { useGenerateDesign } from "./useGenerateDesign";
import { GARMENT_MEASUREMENT_CATEGORY } from "@/features/design/definitions/design-options";

export function useDesignStepper() {
  const currentStepId = useDesignStore((s) => s.currentStepId);
  const gender = useDesignStore((s) => s.gender);
  const garmentTypeId = useDesignStore((s) => s.garmentTypeId);
  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const sketch = useDesignStore((s) => s.sketch);
  const generatedImages = useDesignStore((s) => s.generatedImages);
  const measurements = useDesignStore((s) => s.measurements);

  const { generateFront } = useGenerateDesign();

  const currentStepIndex = useMemo(
    () => STEPPER_STEPS.findIndex((step) => step.id === currentStepId),
    [currentStepId]
  );

  const isMeasurementsValid = useMemo(() => {
    if (!garmentTypeId) return false;
    const category = GARMENT_MEASUREMENT_CATEGORY[garmentTypeId];
    if (!category) return false;


    const m = measurements;
    switch (category) {
      case "head":
        return Boolean(m.head_circumference_cm);
      case "upper_body":
        return Boolean(m.height_cm || m.chest_cm || m.waist_cm);
      case "lower_body":
        return Boolean(m.height_cm || m.waist_cm || m.hips_cm);
      case "full_body":
        return Boolean(m.height_cm || m.chest_cm || m.waist_cm || m.hips_cm);
      default:
        return false;
    }
  }, [garmentTypeId, measurements]);

  const completedSteps = useMemo(
    () =>
      [
        Boolean(gender && garmentTypeId),
        selectedFabricIds.length > 0,
        Boolean(sketch.file && sketch.description.trim().length > 8),
        isMeasurementsValid,
        generatedImages.length > 0,
      ] as const,
    [gender, garmentTypeId, selectedFabricIds, sketch.file, sketch.description, isMeasurementsValid, generatedImages]
  );

  const steps = useMemo(
    () =>
      STEPPER_STEPS.map((step, index) => ({
        ...step,
        isActive: currentStepId === step.id,
        isCompleted: completedSteps[index],
      })),
    [currentStepId, completedSteps]
  );

  const canGoNext = completedSteps[currentStepIndex];

  const canGoBack = currentStepIndex > 0;

  const isLastStep = currentStepId === STEP_IDS.RESULT;

  const currentStepInfo = stepsInfo[currentStepId];

  const handleGoNext = async () => {
    if (!canGoNext) return;

    if (currentStepId === STEP_IDS.MEASUREMENTS) {
      await generateFront();
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPPER_STEPS.length) {
      useDesignStore.setState({ currentStepId: STEPPER_STEPS[nextIndex].id });
    }
  };

  const handleGoBack = () => {
    if (!canGoBack) return;
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      useDesignStore.setState({ currentStepId: STEPPER_STEPS[prevIndex].id });
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