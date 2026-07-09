import { create } from "zustand";
import type { BodyMeasurements } from "@/features/design/types/design";

interface MeasurementsState {
  measurements: BodyMeasurements;
}

interface MeasurementsActions {
  setMeasurements: (measurements: BodyMeasurements) => void;
  reset: () => void;
}

export const useMeasurementsStore = create<MeasurementsState & MeasurementsActions>((set) => ({
  measurements: {},

  setMeasurements: (measurements) => set({ measurements }),

  reset: () => set({ measurements: {} }),
}));