import type { EnhancedPromptPayload, FabricOption, GeneratedDesignImage, PatternedFabric, SolidFabric } from "@/types/design";

const angleMap = [
  { id: "front", title: "نمای روبه‌رو", angle: "front view" },
  { id: "back", title: "نمای پشت", angle: "back view" },
  { id: "side", title: "نمای کنار", angle: "side view" }
] as const;

const createResultSvg = (title: string, accent: string, garmentLabel: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".52" stop-color="#fbf4fb"/>
          <stop offset="1" stop-color="#f0e2f0"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="28" stdDeviation="26" flood-color="#b47ab4" flood-opacity=".18"/>
        </filter>
      </defs>
      <rect width="720" height="900" rx="54" fill="url(#bg)"/>
      <circle cx="128" cy="126" r="112" fill="#C8A2C8" opacity=".18"/>
      <circle cx="590" cy="760" r="148" fill="#E9D5FF" opacity=".46"/>
      <g filter="url(#shadow)">
        <path d="M278 160h164l52 88-58 62-26-36v386c0 38-28 66-66 66h-52c-38 0-66-28-66-66V274l-26 36-58-62 52-88Z" fill="${accent}"/>
        <path d="M292 170c10 44 42 70 68 70s58-26 68-70" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".82"/>
        <path d="M252 388h216M252 482h216M252 576h216" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".28"/>
      </g>
      <text x="360" y="790" text-anchor="middle" font-family="Vazirmatn, Arial" font-size="34" font-weight="700" fill="#3D3A40">${title}</text>
      <text x="360" y="834" text-anchor="middle" font-family="Vazirmatn, Arial" font-size="24" fill="#6E6670">${garmentLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const isSolidFabric = (fabric: FabricOption): fabric is SolidFabric => fabric.kind === "solid";

const isPatternedFabric = (fabric: FabricOption): fabric is PatternedFabric => fabric.kind === "patterned";

export function buildEnhancedPrompt(payload: EnhancedPromptPayload) {
  const solidFabrics = payload.selectedFabrics.filter(isSolidFabric);
  const patternedFabrics = payload.selectedFabrics.filter(isPatternedFabric);
  const solidPrompt = solidFabrics
    .map((fabric) => `${fabric.label} با کد رنگ ${fabric.hex}`)
    .join("، ");
  const patternedPrompt = patternedFabrics
    .map((fabric) => `${fabric.label}: ${fabric.imageData}`)
    .join(" | ");

  return [
    "Image Generation API prompt:",
    `Create a minimal, elegant custom clothing design for ${payload.genderLabel}.`,
    `Garment type: ${payload.garmentType.label}.`,
    `User design details: ${payload.description}.`,
    solidPrompt ? `Use solid fabric colors exactly as hex values: ${solidPrompt}.` : "",
    patternedPrompt ? `Use these patterned fabric image data references: ${patternedPrompt}.` : "",
    payload.sketchPreviewUrl ? "Use the uploaded hand-drawn sketch as the base silhouette and construction reference." : "",
    "Generate multiple angles for a tailor: front, back, and side views.",
    "Style: clean atelier technical fashion board, soft rose glassmorphism mood, white background, high-detail seams, collar, cuffs, fabric placement, and construction clarity.",
    "Avoid mannequins, faces, logos, busy backgrounds, and unrelated accessories."
  ]
    .filter(Boolean)
    .join("\n");
}

export function createMockResultImages(payload: EnhancedPromptPayload): GeneratedDesignImage[] {
  const firstSolid = payload.selectedFabrics.find(isSolidFabric);
  const accent = firstSolid?.hex ?? "#C8A2C8";

  return angleMap.map((item) => ({
    id: item.id,
    angle: item.angle,
    title: item.title,
    src: createResultSvg(item.title, accent, payload.garmentType.label)
  }));
}
