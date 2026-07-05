import { create } from "zustand";
import { GARMENT_TYPES, GENDER_OPTIONS } from "@/features/designer/definitions/design-options";
import { buildEnhancedPrompt } from "@/features/designer/utils/design-prompt";
import type { Gender, SolidFabric, GeneratedDesignImage, BodyMeasurements } from "@/features/designer/types/design";
import { STEP_IDS, type StepId } from "@/features/designer/definitions/design-steps";

interface DesignState {
  gender: Gender | null;
  garmentTypeId: string | null;
  customFabrics: SolidFabric[];
  selectedFabricIds: string[];
  fabricAssignments: Record<string, string>;
  sketch: {
    file: File | null;
    previewUrl: string | null;
    description: string;
  };
  currentStepId: StepId;
  generatedImages: GeneratedDesignImage[];
  generatedAiPrompt: string;
  measurements: BodyMeasurements;

  isFrontGenerating: boolean;
  isGeneratingBack: boolean;
}

interface DesignActions {
  setGender: (gender: Gender) => void;
  setGarment: (garmentTypeId: string) => void;
  addCustomFabric: (hex: string, material: string) => void;
  removeCustomFabric: (fabricId: string) => void;
  toggleFabric: (fabricId: string) => void;
  setFabricAssignment: (fabricId: string, part: string) => void;
  updateSketchFile: (file: File | null) => void;
  updateDescription: (description: string) => void;
  setGeneratedImages: (images: GeneratedDesignImage[]) => void;
  addGeneratedImage: (image: GeneratedDesignImage) => void;
  setCurrentStepId: (stepId: StepId) => void;
  setIsFrontGenerating: (value: boolean) => void;
  setIsGeneratingBack: (value: boolean) => void;
  setMeasurements: (measurements: BodyMeasurements) => void;
  restart: () => void;
}

let fabricIdCounter = 0;

const computePrompt = (state: DesignState): string => {
  const {
    gender,
    garmentTypeId,
    selectedFabricIds,
    customFabrics,
    sketch,
    fabricAssignments,
    measurements,
  } = state;

  const selectedGarment = GARMENT_TYPES.find((g) => g.id === garmentTypeId) ?? null;
  const selectedFabrics = customFabrics.filter((f) => selectedFabricIds.includes(f.id));
  const genderLabel = GENDER_OPTIONS.find((g) => g.id === gender)?.label ?? "";

  if (!gender || !selectedGarment || selectedFabrics.length === 0 || !sketch.description.trim()) {
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
    measurements,
  });
};

export const useDesignStore = create<DesignState & DesignActions>((set, get) => ({
  gender: null,
  garmentTypeId: null,
  customFabrics: [],
  selectedFabricIds: [],
  fabricAssignments: {},
  sketch: { file: null, previewUrl: null, description: "" },
  currentStepId: STEP_IDS.GENDER,
  generatedImages: [],
  generatedAiPrompt: "",
  measurements: {},

  isFrontGenerating: false,
  isGeneratingBack: false,

  setGender: (gender) =>
    set((state) => {
      const newState = { gender, garmentTypeId: state.gender === gender ? state.garmentTypeId : null };
      return {
        ...newState,
        generatedAiPrompt: computePrompt({ ...state, ...newState } as DesignState),
      };
    }),

  setGarment: (garmentTypeId) =>
    set((state) => ({
      garmentTypeId,
      generatedAiPrompt: computePrompt({ ...state, garmentTypeId } as DesignState),
    })),

  addCustomFabric: (hex, material) =>
    set((state) => {
      const id = `custom-${++fabricIdCounter}-${Date.now()}`;
      const label = `${material} (${hex})`;
      const newFabric: SolidFabric = { id, kind: "solid", hex, material, label };
      const newCustomFabrics = [...state.customFabrics, newFabric];
      const newSelectedIds = [...state.selectedFabricIds, id];

      return {
        customFabrics: newCustomFabrics,
        selectedFabricIds: newSelectedIds,
        generatedAiPrompt: computePrompt({
          ...state,
          customFabrics: newCustomFabrics,
          selectedFabricIds: newSelectedIds,
        } as DesignState),
      };
    }),

  removeCustomFabric: (fabricId) =>
    set((state) => {
      const newCustomFabrics = state.customFabrics.filter((f) => f.id !== fabricId);
      const newSelectedIds = state.selectedFabricIds.filter((id) => id !== fabricId);
      const newAssignments = { ...state.fabricAssignments };
      delete newAssignments[fabricId];

      return {
        customFabrics: newCustomFabrics,
        selectedFabricIds: newSelectedIds,
        fabricAssignments: newAssignments,
        generatedAiPrompt: computePrompt({
          ...state,
          customFabrics: newCustomFabrics,
          selectedFabricIds: newSelectedIds,
          fabricAssignments: newAssignments,
        } as DesignState),
      };
    }),

  toggleFabric: (fabricId) =>
    set((state) => {
      const exists = state.selectedFabricIds.includes(fabricId);
      const newSelectedIds = exists
        ? state.selectedFabricIds.filter((id) => id !== fabricId)
        : [...state.selectedFabricIds, fabricId];

      const newAssignments = { ...state.fabricAssignments };
      if (exists) delete newAssignments[fabricId];

      return {
        selectedFabricIds: newSelectedIds,
        fabricAssignments: newAssignments,
        generatedAiPrompt: computePrompt({
          ...state,
          selectedFabricIds: newSelectedIds,
          fabricAssignments: newAssignments,
        } as DesignState),
      };
    }),

  setFabricAssignment: (fabricId, part) =>
    set((state) => {
      const newAssignments = { ...state.fabricAssignments, [fabricId]: part };
      return {
        fabricAssignments: newAssignments,
        generatedAiPrompt: computePrompt({ ...state, fabricAssignments: newAssignments } as DesignState),
      };
    }),

  updateSketchFile: (file) =>
    set((state) => {
      if (state.sketch.previewUrl) URL.revokeObjectURL(state.sketch.previewUrl);
      const previewUrl = file ? URL.createObjectURL(file) : null;
      const newSketch = { file, previewUrl, description: state.sketch.description };

      return {
        sketch: newSketch,
        generatedAiPrompt: computePrompt({ ...state, sketch: newSketch } as DesignState),
      };
    }),

  updateDescription: (description) =>
    set((state) => {
      const newSketch = { ...state.sketch, description };
      return {
        sketch: newSketch,
        generatedAiPrompt: computePrompt({ ...state, sketch: newSketch } as DesignState),
      };
    }),

  setGeneratedImages: (images) => set({ generatedImages: images }),
  addGeneratedImage: (image) =>
    set((state) => ({ generatedImages: [...state.generatedImages, image] })),
  setCurrentStepId: (stepId) => set({ currentStepId: stepId }),
  setIsFrontGenerating: (value) => set({ isFrontGenerating: value }),
  setIsGeneratingBack: (value) => set({ isGeneratingBack: value }),

  setMeasurements: (measurements) =>
    set((state) => ({
      measurements,
      generatedAiPrompt: computePrompt({ ...state, measurements } as DesignState),
    })),

  restart: () => {
    const { sketch } = get();
    if (sketch.previewUrl) URL.revokeObjectURL(sketch.previewUrl);
    fabricIdCounter = 0;

    set({
      gender: null,
      garmentTypeId: null,
      customFabrics: [],
      selectedFabricIds: [],
      fabricAssignments: {},
      sketch: { file: null, previewUrl: null, description: "" },
      currentStepId: STEP_IDS.GENDER,
      generatedImages: [],
      generatedAiPrompt: "",
      measurements: {},
      isFrontGenerating: false,
      isGeneratingBack: false,
    });
  },
}));