import { create } from "zustand";
import {
  GARMENT_TYPES,
  GENDER_OPTIONS,
  MOCK_PATTERNED_FABRICS,
} from "@/app/designer/constants/design-options";
import {
  buildEnhancedPrompt,
  buildBackViewPrompt,
} from "@/app/designer/utils/design-prompt";
import type {
  Gender,
  SolidFabric,
  PatternedFabric,
  GeneratedDesignImage,
} from "@/app/designer/types/design";

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
  isGeneratingBack: boolean; 
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
  generateBackView: () => Promise<void>;
  restart: () => void;
}

let fabricIdCounter = 0;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

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
  const genderLabel = GENDER_OPTIONS.find((g) => g.id === gender)?.label ?? "";

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
  isGeneratingBack: false,
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
      const newSketch = { file, previewUrl, description: state.sketch.description };
      return {
        sketch: newSketch,
        generatedAiPrompt: computePrompt({ ...state, sketch: newSketch } as DesignStore),
      };
    }),

  updateDescription: (description) =>
    set((state) => {
      const newSketch = { ...state.sketch, description };
      return {
        sketch: newSketch,
        generatedAiPrompt: computePrompt({ ...state, sketch: newSketch } as DesignStore),
      };
    }),

  goNext: async () => {
    const state = get();
    const nextStep = Math.min(5, state.currentStep + 1);
    set({ currentStep: nextStep });

    if (nextStep === 4 && state.generatedImages.length === 0) {
      set({ isGenerating: true });

      try {
        let sketchBase64: string | undefined = undefined;
        if (state.sketch.file) {
          sketchBase64 = await fileToBase64(state.sketch.file);
        }

        const response = await fetch("/api/design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: state.generatedAiPrompt,
            imageBase64: sketchBase64,
          }),
        });

        if (!response.ok) {
          throw new Error("Front image generation failed");
        }

        const data = await response.json();
        const frontImage: GeneratedDesignImage = {
          id: "front",
          title: "نمای روبه‌رو",
          angle: "front",
          src: data.image,
        };

        set({
          generatedImages: [frontImage],
          isGenerating: false,
          currentStep: 5,
        });
      } catch (error) {
        console.error(error);
        set({ isGenerating: false });
      }
    }
  },

  goBack: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1),
    })),

  generateBackView: async () => {
    const state = get();
    if (state.generatedImages.length === 0) return;

    set({ isGeneratingBack: true, isGenerating: true });

    try {
      const frontImageSrc = state.generatedImages[0].src;
      const backPrompt = buildBackViewPrompt(state.generatedAiPrompt);

      const response = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: backPrompt,
          imageBase64: frontImageSrc, 
        }),
      });

      if (!response.ok) throw new Error("Back view generation failed");

      const data = await response.json();
      const backImage: GeneratedDesignImage = {
        id: "back",
        title: "نمای پشت",
        angle: "back",
        src: data.image,
      };

      set((prev) => ({
        generatedImages: [...prev.generatedImages, backImage],
        isGeneratingBack: false,
        isGenerating: false,
      }));
    } catch (error) {
      console.error(error);
      set({ isGeneratingBack: false, isGenerating: false });
    }
  },

  restart: () => {
    const { sketch } = get();
    if (sketch.previewUrl) URL.revokeObjectURL(sketch.previewUrl);
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
      isGeneratingBack: false,
      generatedImages: [],
      generatedAiPrompt: "",
    });
  },
}));