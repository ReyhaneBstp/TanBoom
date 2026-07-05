import { EnhancedPromptPayload, SolidFabric } from "../types/design";

export function buildEnhancedPrompt(payload: EnhancedPromptPayload): string {
  const solidFabrics = payload.selectedFabrics as SolidFabric[];

  const solidPrompt = solidFabrics
    .map((fabric) => `${fabric.material} (${fabric.hex})`)
    .join(", ");

  const assignmentLines = payload.selectedFabrics
    .map((fabric) => {
      const part = payload.fabricAssignments?.[fabric.id]?.trim();
      if (!part) return null;
      const solid = fabric as SolidFabric;
      return `- Use ${solid.material} fabric in solid color ${solid.hex} SPECIFICALLY for the [${part}].`;
    })
    .filter(Boolean);

  const measurementLines: string[] = [];
  if (payload.measurements) {
    const m = payload.measurements;
    if (m.height_cm) measurementLines.push(`Garment length: ${m.height_cm} cm`);
    if (m.chest_cm) measurementLines.push(`Chest circumference: ${m.chest_cm} cm`);
    if (m.waist_cm) measurementLines.push(`Waist circumference: ${m.waist_cm} cm`);
    if (m.hips_cm) measurementLines.push(`Hips circumference: ${m.hips_cm} cm`);
    if (m.head_circumference_cm) measurementLines.push(`Head circumference: ${m.head_circumference_cm} cm`);
  }

  const basePrompt = [
    "You are an expert technical fashion illustrator specializing in precise translation of hand-drawn sketches to photorealistic garments.",
    
    `1. Target Audience: ${payload.genderLabel}`,
    `2. Garment Type: ${payload.garmentType.label}`,
    `3. Core Description from User: "${payload.description}"`,
    
    solidPrompt ? `4. Fabric & Color Palette: ${solidPrompt}` : "",
    
    payload.sketchPreviewUrl 
      ? `5. CRITICAL REFERENCE: You are given a hand-drawn sketch. STRICTLY follow the provided sketch as the EXACT silhouette, proportions, seam lines, design details, placement of elements, neckline shape, sleeve style, hem length, and all structural features. Do not alter, simplify, or add any design elements not present in the sketch. Translate the sketch lines faithfully into realistic fabric and stitching.` 
      : "",
  
    "6. Style: Highly detailed photorealistic rendering of the garment, professional atelier technical design, visible fabric texture and drape, precise stitching and seams, natural folds and wrinkles according to the sketch.",
    
    "7. STRICT RULES:",
    "- Follow the sketch 100% for shape and details. Do not invent new patterns, decorations, buttons, pockets, or design features.",
    "- Do not make it more 'fashionable' or add artistic interpretations unless explicitly in the sketch.",
    "- Plain solid white background, no mannequin face, no head, no text, no logos, no shadows on background.",
    "- Focus ONLY on the clothing item itself.",
    
    "8. Rendering: Photorealistic, high resolution, accurate fabric behavior based on the assigned materials."
  ]
  .filter(Boolean)
  .join("\n");

  const measurementBlock =
    measurementLines.length > 0
      ? ["\nMEASUREMENT & FIT REQUIREMENTS:", ...measurementLines].join("\n")
      : "";

  const assignmentBlock =
    assignmentLines.length > 0
      ? ["\nFABRIC PLACEMENT INSTRUCTIONS:", ...assignmentLines].join("\n")
      : "";

  return [basePrompt, measurementBlock, assignmentBlock].filter(Boolean).join("\n");
}

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