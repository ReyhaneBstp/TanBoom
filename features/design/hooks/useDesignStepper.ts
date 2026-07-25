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
import { useGenerationStore } from "../store/generationStore";
import { useAccessoryStore } from "../store/accessoryStore";
import { useGlobalStore } from "@/shared/store/useGlobalStore";

const OPTIONAL_STEPS: readonly StepId[] = [
  STEP_IDS.PARTS,
  STEP_IDS.ACCESSORIES,
];

export function useDesignStepper() {
  const currentStepId = useStepStore((s) => s.currentStepId);
  const gender = useGenderStore((s) => s.gender);
  const garmentTypeId = useGarmentStore((s) => s.garmentTypeId);
  const selectedFabricIds = useFabricStore((s) => s.selectedFabricIds);
  const fabricAssignments = useFabricStore((s) => s.fabricAssignments);
  const generatedImages = useGenerationStore((s) => s.generatedImages);
  const selectedAccessories = useAccessoryStore((s) => s.selectedAccessories);
  const accessoryPlacements = useAccessoryStore((s) => s.accessoryPlacements);
  const setCurrentStepId = useStepStore((s) => s.setCurrentStepId);
  const showSnackbar = useGlobalStore((s) => s.showSnackbar);


  const currentStepIndex = useMemo(
    () => STEPPER_STEPS.findIndex((step) => step.id === currentStepId),
    [currentStepId]
  );

  const completedSteps = useMemo(
    () =>
      [
        Boolean(gender && garmentTypeId),
        true,
        selectedFabricIds.length > 0 &&
          selectedFabricIds.every((id) => fabricAssignments[id]?.trim()),
        selectedAccessories.length > 0 &&
          selectedAccessories.every((id) => accessoryPlacements[id]?.trim()),
        true,
        generatedImages.length > 0,
      ] as const,
    [
      gender,
      garmentTypeId,
      selectedFabricIds,
      fabricAssignments,
      selectedAccessories,
      accessoryPlacements,
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

  const getFabricStepError = () => {
    if (selectedFabricIds.length === 0)
      return "لطفاً حداقل یک پارچه انتخاب کنید.";
    if (!selectedFabricIds.every((id) => fabricAssignments[id]?.trim()))
      return "لطفاً محل استفاده همه پارچه‌های انتخاب‌شده را مشخص کنید.";
    return null;
  };

  const getAccessoryStepError = () => {
    // اکسسوری اختیاری است؛ فقط اگر انتخاب شده، محل استفاده لازم است.
    if (!selectedAccessories.every((id) => accessoryPlacements[id]?.trim()))
      return "لطفاً محل استفاده همه اکسسوری‌های انتخاب‌شده را مشخص کنید.";
    return null;
  };

  const handleGoNext = async () => {
    if (currentStepId === STEP_IDS.FABRIC) {
      const error = getFabricStepError();
      if (error) {
        showSnackbar(error, "error");
        return;
      }
    }

    if (currentStepId === STEP_IDS.ACCESSORIES) {
      const error = getAccessoryStepError();
      if (error) {
        showSnackbar(error, "error");
        return;
      }
    }

    if (currentStepId === STEP_IDS.SKETCH) {
      // اسکچ و توضیحات هر دو اختیاری‌اند؛ مستقیم به تولید تصویر می‌رویم.
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
