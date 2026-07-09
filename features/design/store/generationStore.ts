import { create } from "zustand";
import type { GeneratedDesignImage } from "@/features/design/types/design";

interface GenerationState {
  generatedImages: GeneratedDesignImage[];
  isGeneratingFront: boolean;
  isGeneratingBack: boolean;
}

interface GenerationActions {
  setGeneratedImages: (images: GeneratedDesignImage[]) => void;
  addGeneratedImage: (image: GeneratedDesignImage) => void;
  setisGeneratingFront: (value: boolean) => void;
  setIsGeneratingBack: (value: boolean) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState & GenerationActions>((set) => ({
  generatedImages: [],
  isGeneratingFront: false,
  isGeneratingBack: false,

  setGeneratedImages: (images) => set({ generatedImages: images }),

  addGeneratedImage: (image) =>
    set((state) => ({ generatedImages: [...state.generatedImages, image] })),

  setisGeneratingFront: (value) => set({ isGeneratingFront: value }),

  setIsGeneratingBack: (value) => set({ isGeneratingBack: value }),

  reset: () =>
    set({ generatedImages: [], isGeneratingFront: false, isGeneratingBack: false }),
}));