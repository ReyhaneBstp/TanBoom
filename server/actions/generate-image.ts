"use server";

import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.avalai.ir/v1",
  apiKey: process.env.AVALAI_API_KEY,
});

export async function generateImageAction(
  prompt: string,
  imageBase64?: string
) {
  if (!prompt) {
    throw new Error("پرامپت الزامی است");
  }

  const content: any[] = [
    {
      type: "text",
      text: prompt,
    },
  ];

  if (imageBase64) {
    content.push({
      type: "image_url",
      image_url: {
        url: imageBase64,
      },
    });
  }

  const response = await client.chat.completions.create({
    model: "gemini-3.1-flash-lite-image",

    messages: [
      {
        role: "user",
        content,
      },
    ],

    modalities: ["image", "text"],

    extra_body: {
      generationConfig: {
        imageConfig: {
          imageSize: "1K",
          aspectRatio: "1:1",
        },
      },
    },
  } as any);

  const image =
    (response as any).choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!image) {
    throw new Error("تصویری دریافت نشد");
  }

  return image;
}