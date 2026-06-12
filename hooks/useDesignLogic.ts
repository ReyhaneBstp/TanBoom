"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { FABRIC_OPTIONS, GARMENT_TYPES, GENDER_OPTIONS } from "@/constants/design-options";
import { buildEnhancedPrompt, createMockResultImages } from "@/lib/design-prompt";
import type { DesignFormState, FabricKind, Gender, GeneratedDesignImage } from "@/types/design";

const initialState: DesignFormState = {
  gender: null,
  garmentTypeId: null,
  selectedFabricIds: [],
  sketch: {
    file: null,
    previewUrl: null,
    description: ""
  }
};

export function useDesignLogic() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeFabricKind, setActiveFabricKind] = useState<FabricKind>("solid");
  const [formState, setFormState] = useState<DesignFormState>(initialState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedDesignImage[]>([]);

  const selectedFabrics = useMemo(
    () => FABRIC_OPTIONS.filter((fabric) => formState.selectedFabricIds.includes(fabric.id)),
    [formState.selectedFabricIds]
  );

  const selectedGarment = useMemo(
    () => GARMENT_TYPES.find((garment) => garment.id === formState.garmentTypeId) ?? null,
    [formState.garmentTypeId]
  );

  const selectedGenderLabel = useMemo(
    () => GENDER_OPTIONS.find((option) => option.id === formState.gender)?.label ?? "",
    [formState.gender]
  );

  const promptPayload = useMemo(() => {
    if (!formState.gender || !selectedGarment || selectedFabrics.length === 0 || !formState.sketch.description.trim()) {
      return null;
    }

    return {
      gender: formState.gender,
      genderLabel: selectedGenderLabel,
      garmentType: selectedGarment,
      selectedFabrics,
      description: formState.sketch.description.trim(),
      sketchPreviewUrl: formState.sketch.previewUrl
    };
  }, [formState.gender, formState.sketch.description, formState.sketch.previewUrl, selectedFabrics, selectedGarment, selectedGenderLabel]);

  const enhancedPrompt = useMemo(() => (promptPayload ? buildEnhancedPrompt(promptPayload) : ""), [promptPayload]);

  const completedSteps = useMemo(
    () => [
      Boolean(formState.gender && formState.garmentTypeId),
      formState.selectedFabricIds.length > 0,
      Boolean(formState.sketch.file && formState.sketch.description.trim().length > 8),
      generatedImages.length > 0,
      generatedImages.length > 0
    ],
    [formState.gender, formState.garmentTypeId, formState.selectedFabricIds.length, formState.sketch.file, formState.sketch.description, generatedImages.length]
  );

  const canGoNext = currentStep < 4 && completedSteps[currentStep - 1];
  const canGoBack = currentStep > 1 && !isGenerating;

  const selectGender = useCallback((gender: Gender) => {
    setFormState((previous) => ({
      ...previous,
      gender,
      garmentTypeId: previous.gender === gender ? previous.garmentTypeId : null
    }));
  }, []);

  const selectGarment = useCallback((garmentTypeId: string) => {
    setFormState((previous) => ({ ...previous, garmentTypeId }));
  }, []);

  const toggleFabric = useCallback((fabricId: string) => {
    setFormState((previous) => {
      const exists = previous.selectedFabricIds.includes(fabricId);

      return {
        ...previous,
        selectedFabricIds: exists
          ? previous.selectedFabricIds.filter((id) => id !== fabricId)
          : [...previous.selectedFabricIds, fabricId]
      };
    });
  }, []);

  const updateSketchFile = useCallback((file: File | null) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;

    setFormState((previous) => {
      return {
        ...previous,
        sketch: {
          ...previous.sketch,
          file,
          previewUrl
        }
      };
    });
  }, []);

  const updateDescription = useCallback((description: string) => {
    setFormState((previous) => ({
      ...previous,
      sketch: {
        ...previous.sketch,
        description
      }
    }));
  }, []);

  const goNext = useCallback(() => {
    setCurrentStep((step) => Math.min(5, step + 1));
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((step) => Math.max(1, step - 1));
  }, []);

  const restart = useCallback(() => {
    setCurrentStep(1);
    setActiveFabricKind("solid");
    setFormState(initialState);
    setGeneratedImages([]);
    setIsGenerating(false);
  }, []);

  useEffect(() => {
    if (currentStep !== 4 || !promptPayload || generatedImages.length > 0) {
      return;
    }

    setIsGenerating(true);
    const timerId = window.setTimeout(() => {
      setGeneratedImages(createMockResultImages(promptPayload));
      setIsGenerating(false);
      setCurrentStep(5);
    }, 2200);

    return () => window.clearTimeout(timerId);
  }, [currentStep, generatedImages.length, promptPayload]);

  useEffect(() => {
    return () => {
      if (formState.sketch.previewUrl) {
        URL.revokeObjectURL(formState.sketch.previewUrl);
      }
    };
  }, [formState.sketch.previewUrl]);

  return {
    currentStep,
    activeFabricKind,
    formState,
    selectedFabrics,
    selectedGarment,
    enhancedPrompt,
    isGenerating,
    generatedImages,
    completedSteps,
    canGoNext,
    canGoBack,
    setActiveFabricKind,
    selectGender,
    selectGarment,
    toggleFabric,
    updateSketchFile,
    updateDescription,
    goNext,
    goBack,
    restart
  };
}
