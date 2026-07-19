"use server";

import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.avalai.ir/v1",
  apiKey: process.env.AVALAI_API_KEY,
});

export type GenerateImageResult =
  | { success: true; imageUrl: string }
  | { success: false; error: string };

function toUserMessage(error: unknown): string {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: unknown }).status
      : undefined;

  if (status === 429) {
    return "تعداد درخواست‌ها زیاد شده است. لطفاً یک دقیقه صبر کنید و دوباره تلاش کنید.";
  }
  if (status === 401 || status === 403 || status === 402) {
    return "سرویس تولید تصویر موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید؛ اگر مشکل ادامه داشت به پشتیبانی اطلاع دهید.";
  }
  if (typeof status === "number" && status >= 500) {
    return "سرویس تولید تصویر با مشکل مواجه شده است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.";
  }
  if (error instanceof Error && /fetch|network|ECONN|timeout/i.test(error.message)) {
    return "ارتباط با سرویس تولید تصویر برقرار نشد. اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.";
  }
  return "در تولید تصویر مشکلی پیش آمد. لطفاً دوباره تلاش کنید؛ اگر مشکل تکرار شد کمی توضیحات طرح را تغییر دهید.";
}

export async function generateImageAction(
  prompt: string,
  imageBase64?: string
): Promise<GenerateImageResult> {
  if (!prompt) {
    return {
      success: false,
      error:
        "اطلاعات طرح کامل نیست. لطفاً مراحل طراحی (نوع لباس، پارچه و توضیحات) را کامل کنید.",
    };
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

  try {
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
      return {
        success: false,
        error:
          "هوش مصنوعی نتوانست برای این طرح تصویری بسازد. توضیحات طرح را کمی دقیق‌تر یا ساده‌تر کنید و دوباره تلاش کنید.",
      };
    }

    return { success: true, imageUrl: image };
  } catch (error) {
    console.error("generateImageAction failed:", error);
    return { success: false, error: toUserMessage(error) };
  }
}
