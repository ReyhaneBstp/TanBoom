import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.GAPGPT_API_KEY,
});

const ANGLES = [
  { id: "front", title: "نمای روبه‌رو", promptSuffix: "Generate EXACTLY a Front View." },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const basePrompt = body.basePrompt || body.prompt; 
    
    console.log("Received Prompt:", basePrompt);

    const generatedImages = [];

    for (const angle of ANGLES) {
      const finalPrompt = `${basePrompt}\n\n${angle.promptSuffix}`;
      console.log("Final Prompt:", finalPrompt);

      const response = await client.images.generate({
        model: "gpt-image-2",
        prompt: finalPrompt,
        size: "1024x1024",
      });

      console.log("STRUCTURE:", JSON.stringify(response, (key, value) => {
        if (typeof value === 'string' && value.length > 100) {
          return value.substring(0, 30) + '... [طولانی بود حذف شد]';
        }
        return value;
      }, 2));
      
      const res: any = response;

      if (res.data && res.data.length > 0 && res.data[0].b64_json) {
        const base64Data = res.data[0].b64_json;

        const imageSrc = base64Data.startsWith('data:image') 
          ? base64Data 
          : `data:image/png;base64,${base64Data}`;
        
        generatedImages.push({
          id: angle.id,
          title: angle.title,
          angle: angle.id,
          src: imageSrc
        });
        console.log("Image successfully generated from data[0].b64_json!");
      }

      else if (res.choices && res.choices.length > 0 && res.choices[0].message?.content) {
        const base64Data = res.choices[0].message.content;
        const imageSrc = base64Data.startsWith('data:image') 
          ? base64Data 
          : `data:image/png;base64,${base64Data}`;
        
        generatedImages.push({
          id: angle.id,
          title: angle.title,
          angle: angle.id,
          src: imageSrc
        });
        console.log("Image successfully generated from choices[0].message.content!");
      } 

      else if (res.data && res.data.length > 0 && res.data[0].url) {
        generatedImages.push({
          id: angle.id,
          title: angle.title,
          angle: angle.id,
          src: res.data[0].url
        });
        console.log("Image successfully generated from URL!");
      } 
      else {
        console.log("Could not find image data in response");
      }
    }

    return NextResponse.json({ images: generatedImages });

  } catch (error) {
    console.error("Error in generating image with GapGPT:", error);
    return NextResponse.json(
      { error: "خطا در برقراری ارتباط با GapGPT و تولید تصویر" },
      { status: 500 }
    );
  }
}
