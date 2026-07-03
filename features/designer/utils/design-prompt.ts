import type {
  EnhancedPromptPayload,
  SolidFabric,
  PatternedFabric,
} from "@/features/designer/types/design";

export function buildEnhancedPrompt(payload: EnhancedPromptPayload): string {
  const solidFabrics = payload.selectedFabrics.filter(
    (f) => f.kind === "solid"
  ) as SolidFabric[];
  const patternedFabrics = payload.selectedFabrics.filter(
    (f) => f.kind === "patterned"
  ) as PatternedFabric[];

  const solidPrompt = solidFabrics
    .map((fabric) => `${fabric.label} (${fabric.hex})`)
    .join(", ");

  const assignmentLines = payload.selectedFabrics
    .map((fabric) => {
      const part = payload.fabricAssignments?.[fabric.id]?.trim();
      if (!part) return null;
      if (fabric.kind === "solid") {
        const solid = fabric as SolidFabric;
        return `- Use solid color ${solid.hex} SPECIFICALLY for the [${part}].`;
      } else {
        return `- Use the provided patterned texture/image SPECIFICALLY for the [${part}].`;
      }
    })
    .filter(Boolean);

  const basePrompt = [
    "You are an expert technical fashion designer. Create a highly detailed, photorealistic image of a custom clothing design.",
    `1. Target Audience: ${payload.genderLabel}`,
    `2. Garment Type: ${payload.garmentType.label}`,
    `3. Core Description from User: "${payload.description}"`,
    solidPrompt ? `4. Solid Color Palette: ${solidPrompt}` : "",
    payload.sketchPreviewUrl
      ? "5. IMPORTANT: Use the provided hand-drawn sketch strictly as the foundational silhouette and structural reference."
      : "",
    "6. Style: Professional atelier technical design, photorealistic, plain solid white background, highly detailed stitching, seams, and fabric textures.",
    "7. DO NOT include mannequins with faces, texts, logos, or distractive backgrounds. Focus entirely on the clothing.",
  ]
    .filter(Boolean)
    .join("\n");

  if (assignmentLines.length > 0) {
    return [
      basePrompt,
      "\nFABRIC PLACEMENT INSTRUCTIONS:",
      ...assignmentLines,
    ].join("\n");
  }

  return basePrompt;
}

/**
 * Build a prompt for generating the back view of the garment,
 * given the original description and the front view image.
 */
export function buildBackViewPrompt(originalPrompt: string): string {
  return [
    originalPrompt,
    "\n--- NEW INSTRUCTION ---",
    "Now generate the BACK VIEW of the same garment.",
    "The back view must be 100% consistent in style, colors, fabric textures, and design details with the front view.",
    "Show the garment from behind on a plain white background.",
    "Do NOT show any mannequin face or front details. Only the back of the garment.",
    "Maintain the same realistic rendering quality and lighting.",
  ].join("\n");
}