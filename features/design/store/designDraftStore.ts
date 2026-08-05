import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DesignDraft {
  title: string;
  frontImage: string;
  backImage?: string;
}

interface DesignDraftStore {
  draft: DesignDraft | null;
  setDraft: (draft: DesignDraft) => void;
  clearDraft: () => void;
}

export const useDesignDraftStore = create<DesignDraftStore>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: "design-draft",
    }
  )
);