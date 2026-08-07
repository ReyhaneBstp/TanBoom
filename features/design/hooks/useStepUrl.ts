"use client";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { STEP_IDS, type StepId } from "@/features/design/definitions/design-steps";
import { useUpdateUrl } from "./useUpdateUrl";

export function useStepUrl(): [StepId, (step: StepId) => void] {
  const searchParams = useSearchParams();
  const updateUrl = useUpdateUrl();
  const stepParam = searchParams.get("step") as StepId | null;
  const currentStep: StepId =
    stepParam && Object.values(STEP_IDS).includes(stepParam as StepId)
      ? (stepParam as StepId)
      : STEP_IDS.GENDER;

  const setStep = useCallback(
    (step: StepId) => updateUrl({ step }),
    [updateUrl]
  );

  return [currentStep, setStep];
}