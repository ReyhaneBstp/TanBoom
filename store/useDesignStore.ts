import { create } from "zustand";
import {
  GARMENT_TYPES,
  GENDER_OPTIONS,
  MOCK_PATTERNED_FABRICS,
} from "@/constants/design-options";
import {
  buildEnhancedPrompt,
  createMockResultImages,
} from "@/lib/design-prompt";
import type {
  Gender,
  SolidFabric,
  PatternedFabric,
  GeneratedDesignImage,
  EnhancedPromptPayload,
} from "@/types/design";

interface DesignStore {
  gender: Gender | null;
  garmentTypeId: string | null;
  customFabrics: SolidFabric[];
  patternedFabrics: PatternedFabric[];
  selectedFabricIds: string[];
  fabricAssignments: Record<string, string>;
  sketch: {
    file: File | null;
    previewUrl: string | null;
    description: string;
  };
  currentStep: number;
  isGenerating: boolean;
  generatedImages: GeneratedDesignImage[];
  generatedAiPrompt: string;

  setGender: (gender: Gender) => void;
  setGarment: (garmentTypeId: string) => void;
  addCustomFabric: (hex: string) => void;
  toggleFabric: (fabricId: string) => void;
  setFabricAssignment: (fabricId: string, part: string) => void;
  updateSketchFile: (file: File | null) => void;
  updateDescription: (description: string) => void;
  goNext: () => void;
  goBack: () => void;
  restart: () => void;
}

let fabricIdCounter = 0;

const computePrompt = (state: DesignStore): string => {
  const {
    gender,
    garmentTypeId,
    selectedFabricIds,
    customFabrics,
    patternedFabrics,
    sketch,
    fabricAssignments,
  } = state;
  const selectedGarment = GARMENT_TYPES.find((g) => g.id === garmentTypeId) ?? null;
  const allFabrics = [...customFabrics, ...patternedFabrics];
  const selectedFabrics = allFabrics.filter((f) =>
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
    fabricAssignments,
  });
};

export const useDesignStore = create<DesignStore>((set, get) => ({
  gender: null,
  garmentTypeId: null,
  customFabrics: [],
  patternedFabrics: MOCK_PATTERNED_FABRICS,
  selectedFabricIds: [],
  fabricAssignments: {},
  sketch: { file: null, previewUrl: null, description: "" },
  currentStep: 1,
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

  addCustomFabric: (hex) =>
    set((state) => {
      const id = `custom-${++fabricIdCounter}-${Date.now()}`;
      const newFabric: SolidFabric = {
        id,
        kind: "solid",
        hex,
        label: hex,
      };
      return {
        customFabrics: [...state.customFabrics, newFabric],
        generatedAiPrompt: computePrompt({
          ...state,
          customFabrics: [...state.customFabrics, newFabric],
        } as DesignStore),
      };
    }),

  toggleFabric: (fabricId) =>
    set((state) => {
      const exists = state.selectedFabricIds.includes(fabricId);
      const newFabricIds = exists
        ? state.selectedFabricIds.filter((id) => id !== fabricId)
        : [...state.selectedFabricIds, fabricId];

      const newAssignments = { ...state.fabricAssignments };
      if (exists) delete newAssignments[fabricId];

      return {
        selectedFabricIds: newFabricIds,
        fabricAssignments: newAssignments,
        generatedAiPrompt: computePrompt({
          ...state,
          selectedFabricIds: newFabricIds,
          fabricAssignments: newAssignments,
        } as DesignStore),
      };
    }),

  setFabricAssignment: (fabricId, part) =>
    set((state) => {
      const newAssignments = {
        ...state.fabricAssignments,
        [fabricId]: part,
      };
      return {
        fabricAssignments: newAssignments,
        generatedAiPrompt: computePrompt({
          ...state,
          fabricAssignments: newAssignments,
        } as DesignStore),
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
        const promptPayload: EnhancedPromptPayload = {
          gender: state.gender!,
          genderLabel:
            GENDER_OPTIONS.find((g) => g.id === state.gender)?.label ?? "",
          garmentType: GARMENT_TYPES.find((g) => g.id === state.garmentTypeId)!,
          selectedFabrics: [
            ...state.customFabrics,
            ...state.patternedFabrics,
          ].filter((f) => state.selectedFabricIds.includes(f.id)),
          description: state.sketch.description.trim(),
          sketchPreviewUrl: state.sketch.previewUrl,
          fabricAssignments: state.fabricAssignments,
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
    fabricIdCounter = 0;
    set({
      gender: null,
      garmentTypeId: null,
      customFabrics: [],
      patternedFabrics: MOCK_PATTERNED_FABRICS,
      selectedFabricIds: [],
      fabricAssignments: {},
      sketch: { file: null, previewUrl: null, description: "" },
      currentStep: 1,
      isGenerating: false,
      generatedImages: [],
      generatedAiPrompt: "",
    });
  },
}));