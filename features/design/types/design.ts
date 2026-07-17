export type Gender = "men" | "women";

export interface GarmentType {
  id: string;
  gender: Gender;
  label: string;
  icon: "shirt" | "pants" | "skirt" | "hat" | "coat" | "dress" | "shomiz" | "manto" | "mensShirt";
}

export interface Accessory {
  id: string;
  label: string;
}

export interface SolidFabric {
  id: string;
  kind: "solid";
  label: string;
  hex: string;
  material: string;
}

export type FabricOption = SolidFabric;

export interface SketchInput {
  file: File | null;
  previewUrl: string | null;
  description: string;
}

export interface GeneratedDesignImage {
  id: string;
  angle: string;
  title: string;
  src: string;
}

export interface BodyMeasurements {
  height_cm?: number;
  shoulder_cm?: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  sleeve_length_cm?: number;
  upper_arm_cm?: number;
  armhole_cm?: number;
  wrist_cm?: number;
  rise_cm?: number;
  thigh_cm?: number;
  knee_cm?: number;
  calf_cm?: number;
  head_circumference_cm?: number;
}

export interface EnhancedPromptPayload {
  gender: Gender;
  genderLabel: string;
  garmentType: GarmentType;
  selectedFabrics: SolidFabric[];
  description: string;
  sketchPreviewUrl: string | null;
  fabricAssignments: Record<string, string>;
  selectedAccessories: string[];
  accessoryPlacements: Record<string, string>;
  measurements?: BodyMeasurements;
}

export type MeasurementCategory = "upper_body" | "lower_body" | "head" | "full_body";