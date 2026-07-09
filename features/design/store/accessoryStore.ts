import { create } from "zustand";

interface AccessoryState {
  selectedAccessories: string[];
  accessoryPlacements: Record<string, string>;
}

interface AccessoryActions {
  toggleAccessory: (accessoryId: string) => void;
  setAccessoryPlacement: (accessoryId: string, placement: string) => void;
  reset: () => void;
}

export const useAccessoryStore = create<AccessoryState & AccessoryActions>((set) => ({
  selectedAccessories: [],
  accessoryPlacements: {},

  toggleAccessory: (accessoryId) =>
    set((state) => {
      const exists = state.selectedAccessories.includes(accessoryId);
      const newAccessories = exists
        ? state.selectedAccessories.filter((id) => id !== accessoryId)
        : [...state.selectedAccessories, accessoryId];
      const newPlacements = exists
        ? (() => {
            const { [accessoryId]: _, ...rest } = state.accessoryPlacements;
            return rest;
          })()
        : state.accessoryPlacements;
      return { selectedAccessories: newAccessories, accessoryPlacements: newPlacements };
    }),

  setAccessoryPlacement: (accessoryId, placement) =>
    set((state) => ({
      accessoryPlacements: { ...state.accessoryPlacements, [accessoryId]: placement },
    })),

  reset: () => set({ selectedAccessories: [], accessoryPlacements: {} }),
}));