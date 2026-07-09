import { create } from "zustand";

interface GarmentState {
  garmentTypeId: string | null;
}

interface GarmentActions {
  setGarment: (id: string) => void;
  reset: () => void;
}

export const useGarmentStore = create<GarmentState & GarmentActions>((set) => ({
  garmentTypeId: null,

  setGarment: (id) => set({ garmentTypeId: id }),

  reset: () => set({ garmentTypeId: null }),
}));