"use client";

import { useEffect, useMemo } from "react";
import {
  STEPPER_STEPS,
  stepsInfo,
  STEP_IDS,
  type StepId,
} from "@/features/design/definitions/design-steps";
import { useStepUrl } from "./useStepUrl";
import { useStepGenderUrl } from "./useStepGenderUrl";
import { useStepGarmentUrl } from "./useStepGarmentUrl";
import { useStepPartsUrl } from "./useStepPartsUrl";
import { useStepFabricUrl } from "./useStepFabricUrl";
import { useStepAccessoryUrl } from "./useStepAccessoryUrl";
import { useStepSketchUrl } from "./useStepSketchUrl";
import { useSketchStore } from "../store/sketchStore";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import { useGenerationStore } from "../store/generationStore";
import { useResultDraftStore } from "../store/resultDraftStore";

// Zustand stores for sync
import { useGenderStore } from "../store/genderStore";
import { useGarmentStore } from "../store/garmentStore";
import { usePartsStore } from "../store/partsStore";
import { useFabricStore } from "../store/fabricStore";
import { useAccessoryStore } from "../store/accessoryStore";

const OPTIONAL_STEPS: readonly StepId[] = [
  STEP_IDS.PARTS,
  STEP_IDS.ACCESSORIES,
  STEP_IDS.SKETCH,
];

export function useDesignStepper() {
  const [currentStepId, setCurrentStepId] = useStepUrl();
  const { gender } = useStepGenderUrl();
  const { garmentTypeId } = useStepGarmentUrl();
  const { selectedParts } = useStepPartsUrl();
  const {
    customFabrics,
    selectedFabricIds,
    fabricAssignments,
  } = useStepFabricUrl();
  const { selectedAccessories, accessoryPlacements } = useStepAccessoryUrl();
  const { description: sketchDesc } = useStepSketchUrl();
  const sketchFile = useSketchStore((s) => s.sketch.file);
  const images = useResultDraftStore((s) => s.images);
  const showSnackbar = useGlobalStore((s) => s.showSnackbar);

  // Sync Zustand stores with URL
  useEffect(() => {
    useGenderStore.setState({ gender });
  }, [gender]);

  useEffect(() => {
    useGarmentStore.setState({ garmentTypeId });
  }, [garmentTypeId]);

  useEffect(() => {
    usePartsStore.setState({ selectedParts });
  }, [selectedParts]);

  useEffect(() => {
    useFabricStore.setState({
      customFabrics,
      selectedFabricIds,
      fabricAssignments,
    });
  }, [customFabrics, selectedFabricIds, fabricAssignments]);

  useEffect(() => {
    useAccessoryStore.setState({
      selectedAccessories,
      accessoryPlacements,
    });
  }, [selectedAccessories, accessoryPlacements]);

  useEffect(() => {
    useSketchStore.getState().updateDescription(sketchDesc);
  }, [sketchDesc]);

  const currentStepIndex = useMemo(
    () => STEPPER_STEPS.findIndex((step) => step.id === currentStepId),
    [currentStepId]
  );

  const completedSteps = useMemo(
    () =>
      [
        Boolean(gender && garmentTypeId),
        Object.keys(selectedParts).length > 0,
        selectedFabricIds.length > 0 &&
          selectedFabricIds.every((id) => fabricAssignments[id]?.trim()),
        selectedAccessories.length > 0 &&
          selectedAccessories.every((id) => accessoryPlacements[id]?.trim()),
        Boolean(sketchDesc.trim() || sketchFile),
        images.length > 0,
      ] as const,
    [
      gender,
      garmentTypeId,
      selectedParts,
      selectedFabricIds,
      fabricAssignments,
      selectedAccessories,
      accessoryPlacements,
      sketchDesc,
      sketchFile,
      images,
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
      useGenerationStore.getState().reset();
      useResultDraftStore.getState().clear(); // پاک کردن تصاویر قبلی
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