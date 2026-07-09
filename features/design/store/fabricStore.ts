import { create } from "zustand";
import type { SolidFabric } from "@/features/design/types/design";

let fabricIdCounter = 0;

interface FabricState {
  customFabrics: SolidFabric[];
  selectedFabricIds: string[];
  fabricAssignments: Record<string, string>;
}

interface FabricActions {
  addCustomFabric: (hex: string, material: string) => void;
  removeCustomFabric: (fabricId: string) => void;
  toggleFabric: (fabricId: string) => void;
  setFabricAssignment: (fabricId: string, part: string) => void;
  reset: () => void;
}

export const useFabricStore = create<FabricState & FabricActions>((set) => ({
  customFabrics: [],
  selectedFabricIds: [],
  fabricAssignments: {},

  addCustomFabric: (hex, material) => {
    const id = `custom-${++fabricIdCounter}-${Date.now()}`;
    const label = `${material} (${hex})`;
    const newFabric: SolidFabric = { id, kind: "solid", hex, material, label };
    set((state) => ({
      customFabrics: [...state.customFabrics, newFabric],
      selectedFabricIds: [...state.selectedFabricIds, id],
    }));
  },

  removeCustomFabric: (fabricId) =>
    set((state) => {
      const { [fabricId]: _, ...restAssignments } = state.fabricAssignments;
      return {
        customFabrics: state.customFabrics.filter((f) => f.id !== fabricId),
        selectedFabricIds: state.selectedFabricIds.filter((id) => id !== fabricId),
        fabricAssignments: restAssignments,
      };
    }),

  toggleFabric: (fabricId) =>
    set((state) => {
      const exists = state.selectedFabricIds.includes(fabricId);
      const newSelectedIds = exists
        ? state.selectedFabricIds.filter((id) => id !== fabricId)
        : [...state.selectedFabricIds, fabricId];
      const newAssignments = exists
        ? (() => {
            const { [fabricId]: _, ...rest } = state.fabricAssignments;
            return rest;
          })()
        : state.fabricAssignments;
      return { selectedFabricIds: newSelectedIds, fabricAssignments: newAssignments };
    }),

  setFabricAssignment: (fabricId, part) =>
    set((state) => ({
      fabricAssignments: { ...state.fabricAssignments, [fabricId]: part },
    })),

  reset: () => {
    fabricIdCounter = 0;
    set({ customFabrics: [], selectedFabricIds: [], fabricAssignments: {} });
  },
}));