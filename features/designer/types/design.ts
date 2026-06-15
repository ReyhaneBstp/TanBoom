export type Gender = "men" | "women";

export type FabricKind = "solid" | "patterned";

export interface GarmentType {
  id: string;
  gender: Gender;
  label: string;
  icon: "shirt" | "pants" | "skirt" | "hat" | "coat" | "dress";
}

export interface SolidFabric {
  id: string;
  kind: "solid";
  label: string;
  hex: string;
}

export interface PatternedFabric {
  id: string;
  kind: "patterned";
  label: string;
  imageData: string;
}

export type FabricOption = SolidFabric | PatternedFabric;

export interface SketchInput {
  file: File | null;
  previewUrl: string | null;
  description: string;
}

export interface DesignFormState {
  gender: Gender | null;
  garmentTypeId: string | null;
  selectedFabricIds: string[];
  sketch: SketchInput;
}

export interface GeneratedDesignImage {
  id: string;
  angle: string;
  title: string;
  src: string;
}

export interface EnhancedPromptPayload {
  gender: Gender;
  genderLabel: string;
  garmentType: GarmentType;
  selectedFabrics: FabricOption[];
  description: string;
  sketchPreviewUrl: string | null;
  fabricAssignments: Record<string, string>; // جدید
}