import OpenAI from "openai";
import { storySchema, type Story, type StoryRequest } from "./schema";

const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL ?? "gpt-4o-mini";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("MISSING_API_KEY");
  }
  return new OpenAI();
}

const AGE_GUIDANCE: Record<StoryRequest["ageGroup"], string> = {
  "3-4":
    "العمر 3–4 سنوات: قصة قصيرة جدًا (80–120 كلمة)، جُمل قصيرة بسيطة، مفردات يومية، تكرار لطيف.",
  "5-6":
    "العمر 5–6 سنوات: قصة قصيرة (150–220 كلمة)، جُمل واضحة، حوار بسيط، موقف واحد واضح.",
  "7-8":
    "العمر 7–8 سنوات: قصة أغنى قليلًا (220–320 كلمة) لكنها ما تزال بسيطة، مع مشاعر البطل وتفاصيل صغيرة.",
};

export async function generateStory(req: StoryRequest): Promise<Story> {
  const client = getClient();

  const systemPrompt = `أنت كاتب قصص أطفال عربية دافئة وبسيطة.
اكتب قصة بالعربية الفصحى السهلة جدًا، مناسبة للأطفال، غير مخيفة وغير عنيفة، وليست وعظية بشكل ثقيل.
القصة فيها موقف واحد واضح، تنتهي بشكل لطيف، والقيمة تظهر من خلال الحدث نفسه لا من خلال الخُطب.

أعد الإجابة بصيغة JSON فقط بهذه المفاتيح بالضبط:
{
  "title": "عنوان قصير وجميل للقصة بالعربية",
  "story": "نص القصة كاملًا بالعربية، بفقرات مفصولة بسطر فارغ",
  "moral": "سطر واحد لطيف يوضح القيمة المستفادة بالعربية، دون أسلوب وعظي",
  "key_scene": "وصف موجز بالعربية لأهم مشهد في القصة",
  "image_prompt": "A detailed English prompt describing the key scene for a children's book illustration: characters, setting, mood, action. No text in the image."
}`;

  const userPrompt = `اكتب قصة أطفال بهذه المواصفات:
- اسم البطل: ${req.heroName}
- ${AGE_GUIDANCE[req.ageGroup]}
- القيمة المراد تعزيزها: ${req.value}
${req.details ? `- تفاصيل إضافية من الأهل: ${req.details}` : ""}`;

  const completion = await client.chat.completions.create({
    model: TEXT_MODEL,
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("EMPTY_COMPLETION");
  }

  return storySchema.parse(JSON.parse(raw));
}

const IMAGE_STYLE =
  "Soft, warm children's picture-book illustration in a gentle cartoon style. " +
  "Calm pastel colors, cozy and friendly atmosphere, rounded shapes, suitable for young children. " +
  "Absolutely no text, no words, no letters, no captions anywhere in the image.";

export async function generateImage(imagePrompt: string): Promise<string> {
  const client = getClient();

  const result = await client.images.generate({
    model: IMAGE_MODEL,
    prompt: `${imagePrompt}\n\nStyle: ${IMAGE_STYLE}`,
    size: "1024x1024",
    n: 1,
    // نماذج dall-e تحتاج طلب b64 صراحةً، بينما gpt-image-1 يعيده افتراضيًا
    ...(IMAGE_MODEL.startsWith("dall-e") ? { response_format: "b64_json" as const } : {}),
  });

  const item = result.data?.[0];
  if (item?.b64_json) {
    return `data:image/png;base64,${item.b64_json}`;
  }
  if (item?.url) {
    return item.url;
  }
  throw new Error("EMPTY_IMAGE");
}
