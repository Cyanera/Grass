import { NextResponse } from "next/server";
import { generateImage } from "@/lib/generate";
import { imageRequestSchema } from "@/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const parsed = imageRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "وصف الصورة غير صالح" }, { status: 400 });
  }

  try {
    const image = await generateImage(parsed.data.image_prompt);
    return NextResponse.json({ image });
  } catch (err) {
    if (err instanceof Error && err.message === "MISSING_API_KEY") {
      return NextResponse.json(
        { error: "الخدمة غير مهيأة بعد. تأكد من ضبط مفتاح OpenAI في الخادم." },
        { status: 500 }
      );
    }
    console.error("image generation failed:", err);
    return NextResponse.json(
      { error: "تعذّر رسم الصورة الآن. جربي زر إعادة التوليد." },
      { status: 502 }
    );
  }
}
