import { create } from "zustand";

interface SketchState {
  sketch: {
    file: File | null;
    previewUrl: string | null;
    description: string;
  };
}

interface SketchActions {
  updateSketchFile: (file: File | null) => void;
  updateDescription: (description: string) => void;
  reset: () => void;
}

export const useSketchStore = create<SketchState & SketchActions>((set, get) => ({
  sketch: { file: null, previewUrl: null, description: "" },

  updateSketchFile: (file) => {
    const current = get().sketch;
    if (current.previewUrl) URL.revokeObjectURL(current.previewUrl);
    const previewUrl = file ? URL.createObjectURL(file) : null;
    set({ sketch: { file, previewUrl, description: current.description } });
  },

  updateDescription: (description) =>
    set((state) => ({ sketch: { ...state.sketch, description } })),

  reset: () => {
    const { sketch } = get();
    if (sketch.previewUrl) URL.revokeObjectURL(sketch.previewUrl);
    set({ sketch: { file: null, previewUrl: null, description: "" } });
  },
}));