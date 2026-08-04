import { create } from "zustand";
import type {
  GarmentPartType,
  SelectedGarmentPart,
} from "@/features/design/types/design";

interface PartsState {
  selectedParts: Partial<Record<GarmentPartType, SelectedGarmentPart>>;
}

interface PartsActions {
  setPart: (partType: GarmentPartType, part: SelectedGarmentPart) => void;
  clearPart: (partType: GarmentPartType) => void;
  reset: () => void;
}

export const usePartsStore = create<PartsState & PartsActions>((set) => ({
  selectedParts: {},

  setPart: (partType, part) =>
    set((state) => ({
      selectedParts: { ...state.selectedParts, [partType]: part },
    })),

  clearPart: (partType) =>
    set((state) => {
      const { [partType]: _, ...rest } = state.selectedParts;
      return { selectedParts: rest };
    }),

  reset: () => set({ selectedParts: {} }),
}));
