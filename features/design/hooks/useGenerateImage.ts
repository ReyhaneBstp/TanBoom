"use client";

import { buildBackViewPrompt } from "../utils/design-prompt";
import { useGlobalStore } from "@/shared/store/useGlobalStore";
import type { GeneratedDesignImage } from "../types/design";
import { fileToBase64 } from "@/shared/utils/fileToBase64";
import { STEP_IDS } from "../definitions/design-steps";
import { useDesignPrompt } from "@/features/home/hooks/useDesignPrompt";
import { useSketchStore } from "../store/sketchStore";
import { useGenerationStore } from "../store/generationStore";
import { useResultDraftStore } from "../store/resultDraftStore";
import { useStepUrl } from "./useStepUrl";
import { generateImageAction } from "@/server/actions/generate-image";

export function useGenerateImage() {
  const generatedAiPrompt = useDesignPrompt();
  const sketchFile = useSketchStore((s) => s.sketch.file);
  const {
    setisGeneratingFront,
    setIsGeneratingBack,
    isGeneratingFront,
    isGeneratingBack,
    setFrontError,
    setBackError,
  } = useGenerationStore();

  const setImages = useResultDraftStore((s) => s.setImages);
  const addImage = useResultDraftStore((s) => s.addImage);
  const images = useResultDraftStore((s) => s.images);

  const [, setCurrentStepId] = useStepUrl();
  const { showLoading, hideLoading, showSnackbar } = useGlobalStore();

  const generateFront = async () => {
    if (!generatedAiPrompt) return;
    if (useGenerationStore.getState().isGeneratingFront) return;

    showLoading("در حال تولید تصویر...");
    setisGeneratingFront(true);
    setFrontError(false);

    try {
      let sketchBase64: string | undefined;
      if (sketchFile) {
        sketchBase64 = await fileToBase64(sketchFile);
      }
      const result = await generateImageAction(generatedAiPrompt, sketchBase64);

      if (!result.success) {
        setFrontError(true);
        setCurrentStepId(STEP_IDS.RESULT);
        showSnackbar(result.error, "error");
        return;
      }

      const frontImage: GeneratedDesignImage = {
        id: "front",
        title: "نمای روبه‌رو",
        angle: "front",
        src: result.imageUrl,
      };

      setImages([frontImage]);
      setCurrentStepId(STEP_IDS.RESULT);
    } catch (error) {
      console.error(error);
      setFrontError(true);
      setCurrentStepId(STEP_IDS.RESULT);
      showSnackbar(
        "ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.",
        "error"
      );
    } finally {
      hideLoading();
      setisGeneratingFront(false);
    }
  };

  const generateBackView = async () => {
    if (images.length === 0) return;
    if (useGenerationStore.getState().isGeneratingBack) return;

    showLoading("در حال تولید نمای پشت...");
    setIsGeneratingBack(true);
    setBackError(false);

    try {
      const backPrompt = buildBackViewPrompt(generatedAiPrompt);
      const frontImageSrc = images[0].src;

      const result = await generateImageAction(backPrompt, frontImageSrc);

      if (!result.success) {
        setBackError(true);
        showSnackbar(result.error, "error");
        return;
      }

      const backImage: GeneratedDesignImage = {
        id: "back",
        title: "نمای پشت",
        angle: "back",
        src: result.imageUrl,
      };

      addImage(backImage);
    } catch (error) {
      console.error(error);
      setBackError(true);
      showSnackbar(
        "ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.",
        "error"
      );
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