import { GARMENT_MEASUREMENT_CATEGORY } from "../definitions/design-options";
import { ACCESSORIES } from "../definitions/design-options";
import type { EnhancedPromptPayload, SolidFabric } from "../types/design";


export function buildEnhancedPrompt(payload: EnhancedPromptPayload): string {
  const solidFabrics = payload.selectedFabrics as SolidFabric[];

  const solidPrompt = solidFabrics
    .map((fabric) => `${fabric.material} (${fabric.hex})`)
    .join(", ");

  const assignmentLines = payload.selectedFabrics
    .map((fabric) => {
      const part = payload.fabricAssignments?.[fabric.id]?.trim();
      if (!part) return null;
      return `- Use ${fabric.material} fabric in solid color ${fabric.hex} ONLY for [${part}].`;
    })
    .filter(Boolean);

  const measurementLines: string[] = [];
  if (payload.measurements) {
    const m = payload.measurements;
    if (m.height_cm) measurementLines.push(`Total garment length: ${m.height_cm} cm`);
    if (m.chest_cm) measurementLines.push(`Chest circumference: ${m.chest_cm} cm`);
    if (m.waist_cm) measurementLines.push(`Waist circumference: ${m.waist_cm} cm`);
    if (m.hips_cm) measurementLines.push(`Hips circumference: ${m.hips_cm} cm`);
  }

  const accessoryLines: string[] = [];
  if (payload.selectedAccessories && payload.selectedAccessories.length > 0) {
    payload.selectedAccessories.forEach((accId) => {
      const acc = ACCESSORIES.find((a) => a.id === accId);
      if (!acc) return;
      const placement = payload.accessoryPlacements?.[accId]?.trim();
      if (placement) {
        accessoryLines.push(`- ${acc.label} on [${placement}].`);
      } else {
        accessoryLines.push(`- ${acc.label}.`);
      }
    });
  }

  // ==================== MANNEQUIN CATEGORY ====================
  const garmentKey = payload.garmentType?.id || payload.garmentType?.label?.toLowerCase() || "";
  const category = GARMENT_MEASUREMENT_CATEGORY[garmentKey] || "upper_body";

  let mannequinType: string;
  let mannequinView: string;

  switch (category) {
    case "full_body":
      mannequinType = "full-body";
      mannequinView = "standing naturally";
      break;
    case "lower_body":
      mannequinType = "lower-body (from waist down)";
      mannequinView = "standing naturally";
      break;
    case "head":
      mannequinType = "head-only mannequin";
      mannequinView = "front facing";
      break;
    case "upper_body":
    default:
      mannequinType = "upper-body (bust to hips)";
      mannequinView = "standard product pose";
      break;
  }

  const mannequinDescription = `Consistent ${mannequinType} mannequin with smooth satin-finish ivory skin, completely featureless face (no eyes, nose, mouth), no hair, elegant and neutral posture (${mannequinView}), arms positioned naturally according to garment.`;

  // ==================== BASE PROMPT ====================
  const basePrompt = [
    "You are a professional fashion product photography AI specialized in ultra-photorealistic garment visualization on consistent mannequins.",

    `Target Audience: ${payload.genderLabel}`,
    `Garment Type: ${payload.garmentType.label}`,
    `User Description: "${payload.description}"`,
    solidPrompt ? `Fabrics: ${solidPrompt}` : "",

    "",

    payload.sketchPreviewUrl ? `SKETCH RULES:
The provided sketch is a strict structural reference. Follow it EXACTLY for silhouette, proportions, construction, seams, neckline, sleeves, hem, panels, pleats, gathers, and all design elements. Do not invent or remove anything.` : "",

    "",

    // Mannequin Lock - قوی و ثابت
    `MANNEQUIN LOCK:
Always display the garment on the **exact same consistent ${mannequinType} mannequin** in every image.
${mannequinDescription}
The mannequin appearance, color, finish, and pose style must be identical across all generations.`,

    "",

    `STYLE LOCK:
Ultra-photorealistic luxury fashion product photography.
Professional studio lighting with soft diffused key light.
Clean white seamless background.
Realistic fabric drape, natural wrinkles, accurate stitching, true-to-life textures and colors.
8K commercial catalog quality.`,

    "",

    `NEVER GENERATE:
Illustration, sketch, drawing, painting, anime, cartoon, CGI look, stylized art, visible face details, hands, logos, text, watermarks, or unrequested accessories.`,

    "",

    `STRICT RULES:
- Only show the garment on the defined consistent mannequin.
- Plain white seamless background only.
- Keep exact proportions and construction from the sketch.
- Do not add extra details not present in the sketch.`,

    "",

    "FINAL OUTPUT: One single, perfectly centered, front-view commercial product photograph.",
  ]
    .filter(Boolean)
    .join("\n");

  const measurementBlock = measurementLines.length > 0
    ? `\nMEASUREMENT & FIT:\n${measurementLines.join("\n")}`
    : "";

  const assignmentBlock = assignmentLines.length > 0
    ? `\nFABRIC PLACEMENT:\n${assignmentLines.join("\n")}`
    : "";

  const accessoryBlock = accessoryLines.length > 0
    ? `\nACCESSORIES & DECORATIVE ELEMENTS:\n${accessoryLines.join("\n")}`
    : "";

  return [basePrompt, measurementBlock, assignmentBlock, accessoryBlock]
    .filter(Boolean)
    .join("\n");
}

export function buildBackViewPrompt(originalPrompt: string): string {
  return [
    originalPrompt,

    "\n--- BACK VIEW ---",

    "Generate the **back view** of the EXACT same garment on the **same consistent mannequin**.",
    "Maintain identical mannequin appearance, lighting, fabric behavior, and quality.",
    "Perfect visual match with the front view in all details.",
    "Commercial catalog style, white seamless background.",
    "Back view only.",
  ].join("\n");
}
