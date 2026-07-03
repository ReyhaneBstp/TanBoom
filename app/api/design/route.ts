import { NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai/uploads";

const client = new OpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.GAPGPT_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt as string;
    const imageBase64 = body.imageBase64 as string | undefined;

    if (!prompt) {
      return NextResponse.json(
        { error: "پرامپت الزامی است" },
        { status: 400 }
      );
    }

    let imageSrc: string | null = null;

    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      const imageFile = await toFile(imageBuffer, "sketch.png", {
        type: "image/png",
      });

      const response = await client.images.edit({
        model: "gpt-image-2",
        image: imageFile,
        prompt: prompt,
        size: "1024x1024",
        response_format: "b64_json",
      });

      const imageData = (response as any).data?.[0];
      if (imageData?.b64_json) {
        imageSrc = `data:image/png;base64,${imageData.b64_json}`;
      } else if (imageData?.url) {
        imageSrc = imageData.url;
      }
    } else {
      const response = await client.images.generate({
        model: "gpt-image-2",
        prompt: prompt,
        size: "1024x1024",
        response_format: "b64_json",
      });

      const imageData = (response as any).data?.[0];
      if (imageData?.b64_json) {
        imageSrc = `data:image/png;base64,${imageData.b64_json}`;
      } else if (imageData?.url) {
        imageSrc = imageData.url;
      }
    }

    if (!imageSrc) {
      console.error("تصویری در پاسخ یافت نشد");
      return NextResponse.json(
        { error: "تصویری دریافت نشد" },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: imageSrc });
  } catch (error: any) {
    console.error("خطا در API طراحی:", error?.message || error);
    return NextResponse.json(
      { error: "خطا در ارتباط با API تولید تصویر" },
      { status: 500 }
    );
  }
}