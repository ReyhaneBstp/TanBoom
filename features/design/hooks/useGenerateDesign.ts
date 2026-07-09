"use client";

import { DesignService } from "../service/ai-api";
import { buildBackViewPrompt } from "../utils/design-prompt";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import type { GeneratedDesignImage } from "../types/design";
import { fileToBase64 } from "@/shared/utils/fileToBase64";
import { STEP_IDS } from "../definitions/design-steps";
import { useDesignPrompt } from "@/features/home/hooks/useDesignPrompt";
import { useSketchStore } from "../store/sketchStore";
import { useGenerationStore } from "../store/generationStore";
import { useStepStore } from "../store/stepStore";


export function useGenerateDesign() {
  const generatedAiPrompt = useDesignPrompt();
  const sketch = useSketchStore((s) => s.sketch);
  const {
    generatedImages,
    setGeneratedImages,
    addGeneratedImage,
    setisGeneratingFront,
    setIsGeneratingBack,
    isGeneratingFront,
    isGeneratingBack,
  } = useGenerationStore();
  const setCurrentStepId = useStepStore((s) => s.setCurrentStepId);

  const { showLoading, hideLoading, showSnackbar } = useGlobalStore();

  const generateFront = async () => {
    if (!generatedAiPrompt) return;

    showLoading("در حال تولید تصویر...");
    setisGeneratingFront(true);

    try {
      let sketchBase64: string | undefined;
      if (sketch.file) {
        sketchBase64 = await fileToBase64(sketch.file);
      }

      const imageUrl = await DesignService.generateImage(generatedAiPrompt, sketchBase64);

      const frontImage: GeneratedDesignImage = {
        id: "front",
        title: "نمای روبه‌رو",
        angle: "front",
        src: imageUrl,
      };

      setGeneratedImages([frontImage]);
      setCurrentStepId(STEP_IDS.RESULT);
    } catch (error) {
      console.error(error);
      showSnackbar("خطا در تولید تصویر. لطفاً دوباره تلاش کنید.", "error");
    } finally {
      hideLoading();
      setisGeneratingFront(false);
    }
  };

  const generateBackView = async () => {
    if (generatedImages.length === 0) return;

    showLoading("در حال تولید نمای پشت...");
    setIsGeneratingBack(true);

    try {
      const backPrompt = buildBackViewPrompt(generatedAiPrompt);
      const frontImageSrc = generatedImages[0].src;

      const imageUrl = await DesignService.generateImage(backPrompt, frontImageSrc);

      const backImage: GeneratedDesignImage = {
        id: "back",
        title: "نمای پشت",
        angle: "back",
        src: imageUrl,
      };

      addGeneratedImage(backImage);
    } catch (error) {
      console.error(error);
      showSnackbar("خطا در تولید نمای پشت.", "error");
    } finally {
      hideLoading();
      setIsGeneratingBack(false);
    }
  };

  return {
    generateFront,
    generateBackView,
    isGeneratingFront,
    isGeneratingBack,
  };
}