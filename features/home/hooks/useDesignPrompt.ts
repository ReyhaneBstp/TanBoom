import { useMemo } from "react";
import { GARMENT_TYPES, GENDER_OPTIONS } from "@/features/design/definitions/design-options";
import { buildEnhancedPrompt } from "@/features/design/utils/design-prompt";
import { useGenderStore } from "@/features/design/store/genderStore";
import { useGarmentStore } from "@/features/design/store/garmentStore";
import { useFabricStore } from "@/features/design/store/fabricStore";
import { useAccessoryStore } from "@/features/design/store/accessoryStore";
import { useSketchStore } from "@/features/design/store/sketchStore";


export function useDesignPrompt(): string {
  const gender = useGenderStore((s) => s.gender);
  const garmentTypeId = useGarmentStore((s) => s.garmentTypeId);
  const customFabrics = useFabricStore((s) => s.customFabrics);
  const selectedFabricIds = useFabricStore((s) => s.selectedFabricIds);
  const fabricAssignments = useFabricStore((s) => s.fabricAssignments);
  const selectedAccessories = useAccessoryStore((s) => s.selectedAccessories);
  const accessoryPlacements = useAccessoryStore((s) => s.accessoryPlacements);
  const sketch = useSketchStore((s) => s.sketch);

  return useMemo(() => {
    const selectedGarment = GARMENT_TYPES.find((g) => g.id === garmentTypeId) ?? null;
    const selectedFabrics = customFabrics.filter((f) => selectedFabricIds.includes(f.id));
    const genderLabel = GENDER_OPTIONS.find((g) => g.id === gender)?.label ?? "";

    if (!gender || !selectedGarment || selectedFabrics.length === 0 || !sketch.description.trim()) {
      return "";
    }

    return buildEnhancedPrompt({
      gender,
      genderLabel,
      garmentType: selectedGarment,
      selectedFabrics,
      description: sketch.description.trim(),
      sketchPreviewUrl: sketch.previewUrl,
      fabricAssignments,
      selectedAccessories,
      accessoryPlacements,
    });
  }, [
    gender,
    garmentTypeId,
    customFabrics,
    selectedFabricIds,
    fabricAssignments,
    selectedAccessories,
    accessoryPlacements,
    sketch,
  ]);
}