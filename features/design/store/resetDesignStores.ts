import { useStepStore } from "./stepStore";
import { useGenderStore } from "./genderStore";
import { useGarmentStore } from "./garmentStore";
import { useFabricStore } from "./fabricStore";
import { useAccessoryStore } from "./accessoryStore";
import { useSketchStore } from "./sketchStore";
import { useGenerationStore } from "./generationStore";

export function resetDesignStores() {
  useGenderStore.getState().reset();
  useGarmentStore.getState().reset();
  useFabricStore.getState().reset();
  useAccessoryStore.getState().reset();
  useSketchStore.getState().reset();
  useGenerationStore.getState().reset();
  useStepStore.getState().reset();
}
