import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.avalai.ir/v1",
  apiKey: process.env.AVALAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, imageBase64 } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "پرامپت الزامی است" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "تصویری دریافت نشد" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: "خطا در تولید تصویر",
      },
      {
        status: 500,
      }
    );
  }
}