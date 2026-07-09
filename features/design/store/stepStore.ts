import { create } from "zustand";
import { STEP_IDS, type StepId } from "@/features/design/definitions/design-steps";

interface StepState {
  currentStepId: StepId;
}

interface StepActions {
  setCurrentStepId: (stepId: StepId) => void;
  reset: () => void;
}

export const useStepStore = create<StepState & StepActions>((set) => ({
  currentStepId: STEP_IDS.GENDER,

  setCurrentStepId: (stepId) => set({ currentStepId: stepId }),

  reset: () => set({ currentStepId: STEP_IDS.GENDER }),
}));