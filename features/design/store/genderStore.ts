import { create } from "zustand";
import type { Gender } from "@/features/design/types/design";
import { useGarmentStore } from "./garmentStore";


interface GenderState {
  gender: Gender | null;
}

interface GenderActions {
  setGender: (gender: Gender) => void;
  reset: () => void;
}

export const useGenderStore = create<GenderState & GenderActions>((set, get) => ({
  gender: null,

  setGender: (newGender) => {
    const { garmentTypeId } = useGarmentStore.getState();
    const currentGender = get().gender;
    const newGarment = currentGender === newGender ? garmentTypeId : null;
    set({ gender: newGender });
    if (newGarment !== garmentTypeId) {
      useGarmentStore.setState({ garmentTypeId: newGarment });
    }
  },

  reset: () => set({ gender: null }),
}));