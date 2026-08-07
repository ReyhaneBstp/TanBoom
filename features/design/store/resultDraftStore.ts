import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratedDesignImage } from "@/features/design/types/design";

interface ResultDraftState {
  images: GeneratedDesignImage[];
  title: string;
}

interface ResultDraftActions {
  setImages: (images: GeneratedDesignImage[]) => void;
  addImage: (image: GeneratedDesignImage) => void;
  setTitle: (title: string) => void;
  clear: () => void;
}

export const useResultDraftStore = create<ResultDraftState & ResultDraftActions>()(
  persist(
    (set) => ({
      images: [],
      title: "",
      setImages: (images) => set({ images }),
      addImage: (image) => set((state) => ({ images: [...state.images, image] })),
      setTitle: (title) => set({ title }),
      clear: () => set({ images: [], title: "" }),
    }),
    {
      name: "design-result-draft",
    }
  )
);