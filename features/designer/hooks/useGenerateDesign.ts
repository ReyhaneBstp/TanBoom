"use client";

import { useDesignStore } from "../store/useDesignStore";
import { DesignService } from "../service/ai-api";
import { buildBackViewPrompt } from "../utils/design-prompt";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import type { GeneratedDesignImage } from "../types/design";
import { fileToBase64 } from "@/shared/utils/fileToBase64";

export function useGenerateDesign() {
  const {
    generatedAiPrompt,
    sketch,
    generatedImages,
    setGeneratedImages,
    addGeneratedImage,
    setCurrentStep,
    setIsFrontGenerating,
    setIsGeneratingBack,
  } = useDesignStore();

  const { showLoading, hideLoading, showSnackbar } = useGlobalStore();

  const generateFront = async () => {
    if (!generatedAiPrompt) return;

    showLoading("در حال تولید تصویر...");
    setIsFrontGenerating(true);

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
      setCurrentStep(4);
    } catch (error) {
      console.error(error);
      showSnackbar("خطا در تولید تصویر. لطفاً دوباره تلاش کنید.", "error");
    } finally {
      hideLoading();
      setIsFrontGenerating(false);
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
    isGeneratingFront: useDesignStore((s) => s.isFrontGenerating),
    isGeneratingBack: useDesignStore((s) => s.isGeneratingBack),
  };
}
