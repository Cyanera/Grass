import OpenAI from "openai";
import { storySchema, type Story, type StoryRequest } from "./schema";

const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL ?? "gpt-4o-mini";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
// medium = توازن جيد بين السرعة والجودة؛ يمكن رفعها إلى high من متغيرات البيئة
const IMAGE_QUALITY = process.env.OPENAI_IMAGE_QUALITY ?? "medium";

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("MISSING_API_KEY");
  }
  return new OpenAI();
}

const AGE_GUIDANCE: Record<StoryRequest["ageGroup"], string> = {
  "3-4":
    "العمر 3–4 سنوات: قصة من 100–150 كلمة، جُمل قصيرة إيقاعية، مفردات يومية محسوسة، تكرار لفظي لطيف يحب الصغار ترديده.",
  "5-6":
    "العمر 5–6 سنوات: قصة من 180–280 كلمة، حوار طبيعي قصير، مشاعر واضحة، وموقف واحد يتصاعد ثم يُحل.",
  "7-8":
    "العمر 7–8 سنوات: قصة من 300–450 كلمة، شخصية تواجه خيارًا حقيقيًا، تفاصيل حسية أغنى، ولمسة دعابة أو دهشة.",
};

export async function generateStory(req: StoryRequest): Promise<Story> {
  const client = getClient();

  const systemPrompt = `أنت كاتب قصص أطفال محترف بروحٍ إسلامية دافئة، بأسلوب أرقى دور نشر أدب الطفل المسلم.

قواعد الكتابة:
- افتح القصة بمشهد حي (صوت، حركة، مفاجأة صغيرة) — لا تبدأ أبدًا بعبارات مثل "في يوم من الأيام" أو "كان يا ما كان".
- عربية فصحى سهلة وموسيقية، بتفاصيل حسية: الألوان، الأصوات، الروائح، ملمس الأشياء.
- حوار قصير طبيعي يشبه كلام الأطفال الحقيقيين.
- البطل يواجه موقفًا حقيقيًا فيه خيار، ويصل إلى الحل بنفسه — الكبار يساندون ولا يُلقّنون.
- القيمة تُغرس غرسًا من خلال الحدث، بلا خطب ولا ختام وعظي ثقيل.
- غير مخيفة، غير عنيفة، ونهايتها دافئة تترك ابتسامة.
- العنوان جذاب وغير مباشر: لا تضع اسم القيمة في العنوان.

الأسلوب الإسلامي في غرس القيمة:
- اجعل الإيمان جزءًا طبيعيًا من حياة الشخصيات: بسم الله قبل الأكل، الحمد لله عند الفرح، إن شاء الله عند الوعد — بلا إثقال.
- استدل بآية قرآنية قصيرة أو حديث نبوي واحد (على الأكثر اثنين)، يأتي في موضعه الطبيعي على لسان الأم أو الأب أو الجد أو المعلمة، ويُشرح للطفل بكلمة محببة.
- قاعدة صارمة للأمانة العلمية: لا تضع بين علامتي تنصيص إلا آية أو حديثًا صحيحًا مشهورًا أنت متأكد من نصه الحرفي تمامًا (مثل: «إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ»، «الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ»، «مَنْ لَا يَرْحَمْ لَا يُرْحَمْ»). إن لم تتأكد من الحرف، فاذكر المعنى دون تنصيص. لا تخترع نصوصًا أبدًا.
- عند ذكر حديث قل: قال رسول الله ﷺ. وعند ذكر آية يمكن قول: قال الله تعالى في كتابه.
- حبّب الطفلَ بالقدوات: أشر في سياق القصة إشارة موجزة مناسبة للعمر إلى نبي أو صحابي أو عَلَم مسلم تتجلى فيه القيمة (مثل: النبي ﷺ الصادق الأمين، أبو بكر في الرفق، عمر في العدل، عثمان في الحياء، علي في الشجاعة، أم موسى في التوكل، الخنساء في الصبر) — إشارة قصيرة يرويها أحد الكبار بحب، لا درس تاريخ.

أعد الإجابة بصيغة JSON فقط بهذه المفاتيح بالضبط:
{
  "title": "عنوان جذاب قصير بالعربية",
  "story": "نص القصة كاملًا بالعربية، بفقرات مفصولة بسطر فارغ",
  "moral": "سطر واحد رقيق يربط القيمة بمرجعها الإيماني بلطف، غير وعظي",
  "key_scene": "وصف موجز بالعربية لأهم مشهد في القصة",
  "image_prompt": "A richly detailed English illustration brief for the single most emotional moment of the story, set in a warm Muslim Arab family environment with modest clothing (mother in a graceful hijab where she appears). Describe: the child's appearance (age, hair, clothing colors), their exact expression and pose, the other characters, the setting with 3-4 specific background details, the light, and the mood. One moment only, no text in the image."
}`;

  const userPrompt = `اكتب قصة أطفال بهذه المواصفات:
- اسم البطل: ${req.heroName}
- ${AGE_GUIDANCE[req.ageGroup]}
- القيمة المراد تعزيزها: ${req.value}
${req.details ? `- تفاصيل إضافية من الأهل: ${req.details}` : ""}`;

  // نماذج gpt-5 و o-series لا تقبل درجة حرارة مخصصة
  const supportsTemperature = !/^(gpt-5|o\d)/.test(TEXT_MODEL);

  const completion = await client.chat.completions.create({
    model: TEXT_MODEL,
    ...(supportsTemperature ? { temperature: 0.9 } : {}),
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
  "Award-winning children's picture-book illustration. Soft watercolor and gouache textures, " +
  "warm gentle lighting, rich yet calm pastel palette, expressive charming characters with big kind eyes, " +
  "layered storybook composition with a clear focal point and lovely background depth. " +
  "Absolutely no text, no words, no letters, no captions anywhere in the image.";

export async function generateImage(imagePrompt: string): Promise<string> {
  const client = getClient();
  const isDalle = IMAGE_MODEL.startsWith("dall-e");

  const result = await client.images.generate({
    model: IMAGE_MODEL,
    prompt: `${imagePrompt}\n\nStyle: ${IMAGE_STYLE}`,
    size: isDalle ? "1792x1024" : "1536x1024",
    n: 1,
    // نماذج dall-e تحتاج طلب b64 صراحةً، بينما gpt-image-1 يعيده افتراضيًا
    ...(isDalle
      ? { response_format: "b64_json" as const }
      : { quality: IMAGE_QUALITY as "low" | "medium" | "high" }),
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
