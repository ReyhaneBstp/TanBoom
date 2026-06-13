import { create } from "zustand";
import {
  FABRIC_OPTIONS,
  GARMENT_TYPES,
  GENDER_OPTIONS,
} from "@/constants/design-options";
import { buildEnhancedPrompt, createMockResultImages } from "@/lib/design-prompt";
import type {
  FabricKind,
  Gender,
  GeneratedDesignImage,
} from "@/types/design";

interface DesignStore {
  gender: Gender | null;
  garmentTypeId: string | null;
  selectedFabricIds: string[];
  sketch: {
    file: File | null;
    previewUrl: string | null;
    description: string;
  };
  currentStep: number;
  activeFabricKind: FabricKind;
  isGenerating: boolean;
  generatedImages: GeneratedDesignImage[];
  generatedAiPrompt: string;

  // --- Actions ---
  setGender: (gender: Gender) => void;
  setGarment: (garmentTypeId: string) => void;
  setActiveFabricKind: (kind: FabricKind) => void;
  toggleFabric: (fabricId: string) => void;
  updateSketchFile: (file: File | null) => void;
  updateDescription: (description: string) => void;
  goNext: () => void;
  goBack: () => void;
  restart: () => void;
}

const computePrompt = (state: DesignStore): string => {
  const { gender, garmentTypeId, selectedFabricIds, sketch } = state;
  const selectedGarment = GARMENT_TYPES.find((g) => g.id === garmentTypeId) ?? null;
  const selectedFabrics = FABRIC_OPTIONS.filter((f) =>
    selectedFabricIds.includes(f.id)
  );
  const genderLabel =
    GENDER_OPTIONS.find((g) => g.id === gender)?.label ?? "";

  if (
    !gender ||
    !selectedGarment ||
    selectedFabrics.length === 0 ||
    !sketch.description.trim()
  ) {
    return "";
  }

  return buildEnhancedPrompt({
    gender,
    genderLabel,
    garmentType: selectedGarment,
    selectedFabrics,
    description: sketch.description.trim(),
    sketchPreviewUrl: sketch.previewUrl,
  });
};

export const useDesignStore = create<DesignStore>((set, get) => ({
  gender: null,
  garmentTypeId: null,
  selectedFabricIds: [],
  sketch: { file: null, previewUrl: null, description: "" },
  currentStep: 1,
  activeFabricKind: "solid",
  isGenerating: false,
  generatedImages: [],
  generatedAiPrompt: "",


  setGender: (gender) =>
    set((state) => {
      const newState: Partial<DesignStore> = {
        gender,
        garmentTypeId: state.gender === gender ? state.garmentTypeId : null,
      };
      return {
        ...newState,
        generatedAiPrompt: computePrompt({ ...state, ...newState } as DesignStore),
      };
    }),

  setGarment: (garmentTypeId) =>
    set((state) => {
      const newState = { garmentTypeId };
      return {
        ...newState,
        generatedAiPrompt: computePrompt({ ...state, ...newState } as DesignStore),
      };
    }),

  setActiveFabricKind: (kind) => set({ activeFabricKind: kind }),

  toggleFabric: (fabricId) =>
    set((state) => {
      const exists = state.selectedFabricIds.includes(fabricId);
      const newFabricIds = exists
        ? state.selectedFabricIds.filter((id) => id !== fabricId)
        : [...state.selectedFabricIds, fabricId];

      const newState = { selectedFabricIds: newFabricIds };
      return {
        ...newState,
        generatedAiPrompt: computePrompt({ ...state, ...newState } as DesignStore),
      };
    }),

  updateSketchFile: (file) =>
    set((state) => {
      if (state.sketch.previewUrl) {
        URL.revokeObjectURL(state.sketch.previewUrl);
      }
      const previewUrl = file ? URL.createObjectURL(file) : null;
      const newSketch = {
        file,
        previewUrl,
        description: state.sketch.description,
      };
      const newState = { sketch: newSketch };
      return {
        ...newState,
        generatedAiPrompt: computePrompt({ ...state, ...newState } as DesignStore),
      };
    }),

  updateDescription: (description) =>
    set((state) => {
      const newSketch = { ...state.sketch, description };
      const newState = { sketch: newSketch };
      return {
        ...newState,
        generatedAiPrompt: computePrompt({ ...state, ...newState } as DesignStore),
      };
    }),

  goNext: () => {
    const { currentStep } = get();
    const nextStep = Math.min(5, currentStep + 1);
    set({ currentStep: nextStep });

    if (nextStep === 4 && get().generatedImages.length === 0) {
      set({ isGenerating: true });
      setTimeout(() => {
        const state = get();
        const promptPayload = {
          gender: state.gender!,
          genderLabel:
            GENDER_OPTIONS.find((g) => g.id === state.gender)?.label ?? "",
          garmentType: GARMENT_TYPES.find((g) => g.id === state.garmentTypeId)!,
          selectedFabrics: FABRIC_OPTIONS.filter((f) =>
            state.selectedFabricIds.includes(f.id)
          ),
          description: state.sketch.description.trim(),
          sketchPreviewUrl: state.sketch.previewUrl,
        };
        const images = createMockResultImages(promptPayload);
        set({ generatedImages: images, isGenerating: false, currentStep: 5 });
      }, 2200);
    }
  },

  goBack: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1),
    })),

  restart: () => {
    const { sketch } = get();
    if (sketch.previewUrl) {
      URL.revokeObjectURL(sketch.previewUrl);
    }
    set({
      gender: null,
      garmentTypeId: null,
      selectedFabricIds: [],
      sketch: { file: null, previewUrl: null, description: "" },
      currentStep: 1,
      activeFabricKind: "solid",
      isGenerating: false,
      generatedImages: [],
      generatedAiPrompt: "",
    });
  },
}));