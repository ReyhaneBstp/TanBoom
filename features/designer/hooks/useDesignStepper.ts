"use client";

import { useDesignStore } from "@/features/designer/store/useDesignStore";
import { stepsInfo } from "@/features/designer/definitions/design-steps";

export function useDesignStepper() {
  const currentStep = useDesignStore((s) => s.currentStep);
  const goBack = useDesignStore((s) => s.goBack);
  const goNext = useDesignStore((s) => s.goNext);

  const isFrontGenerating = useDesignStore((s) => s.isFrontGenerating);
  const isGeneratingBack = useDesignStore((s) => s.isGeneratingBack);


  const gender = useDesignStore((s) => s.gender);
  const garmentTypeId = useDesignStore((s) => s.garmentTypeId);
  const selectedFabricIds = useDesignStore((s) => s.selectedFabricIds);
  const sketch = useDesignStore((s) => s.sketch);
  const generatedImages = useDesignStore((s) => s.generatedImages);

  const completedSteps = [
    Boolean(gender && garmentTypeId),                    
    selectedFabricIds.length > 0,                      
    Boolean(sketch.file && sketch.description.trim().length > 8), 
    generatedImages.length > 0,                        
  ] as const;

  const canGoNext = currentStep < 4 && completedSteps[currentStep - 1];
  const canGoBack = currentStep > 1 && !isFrontGenerating && !isGeneratingBack;

  const currentStepInfo = stepsInfo[currentStep as keyof typeof stepsInfo];

  const isLastStep = currentStep === 4;

  const handleGoNext = () => {
    if (canGoNext) goNext();
  };

  const handleGoBack = () => {
    if (canGoBack) goBack();
  };

  return {
    currentStep,
    isLastStep,
    canGoNext,
    canGoBack,
    completedSteps,
    currentStepInfo,
    handleGoNext,
    handleGoBack,
    isGenerating: isFrontGenerating || isGeneratingBack,
  };
}