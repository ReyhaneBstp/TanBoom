export class DesignService {
  static async generateImage(prompt: string, imageBase64?: string) {
    const response = await fetch("/api/design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        imageBase64,
      }),
    });

    if (!response.ok) {
      throw new Error("Image generation failed");
    }

    const data = await response.json();
    return data.image as string;
  }
}
