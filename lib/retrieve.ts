import type OpenAI from "openai";
import { verifyVerse } from "./quran";
import { verifyHadith } from "./hadith";
import type { ValueReference } from "./references";

/**
 * استرجاع لحظي لمراجع القيم المخصّصة الجديدة (غير الموجودة في المكتبة).
 *
 * الفكرة: نطلب من النموذج اقتراح آيات وأحاديث تخصّ القيمة، ثم نتحقق من كل
 * نص آليًا مقابل المصحف والصحيحين، فلا نُبقي إلا الموثّق بمرجعه الدقيق.
 * تُحفظ النتيجة بعد ذلك في المكتبة الدائمة (عبر GitHub) لتصير فورية لاحقًا.
 */

// نموذج خفيف وسريع للاسترجاع (مجرّد اقتراح مرشّحات يُتحقق منها لاحقًا)، حتى لا
// يستهلك زمن المهلة قبل توليد القصة.
const RETRIEVE_MODEL = process.env.OPENAI_RETRIEVE_MODEL ?? "gpt-4o-mini";

type Candidates = { verses?: unknown[]; hadiths?: unknown[] };

function asText(item: unknown): string | null {
  if (typeof item === "string") return item.trim() || null;
  if (item && typeof item === "object" && "text" in item) {
    const t = (item as { text?: unknown }).text;
    if (typeof t === "string") return t.trim() || null;
  }
  return null;
}

export async function retrieveReferencesForValue(
  client: OpenAI,
  value: string
): Promise<ValueReference> {
  const system = `أنت عالم متمكّن بالقرآن الكريم والسنة النبوية. سأعطيك قيمة تربوية للأطفال، فاذكر النصوص الشرعية الصحيحة المتعلقة بها مباشرة:
- آيات قرآنية قصيرة جدًا (حتى ست آيات)، منقولة بلفظها الصحيح تمامًا دون خطأ. اختر الأقصر والأنسب للأطفال.
- أحاديث من صحيح البخاري أو صحيح مسلم فقط (حتى خمسة)، يُذكر متنها بحروفه بلا إسناد وبلا «قال رسول الله ﷺ».
لا تخترع نصًّا، ولا تستشهد بحديث من غير الصحيحين، ولا تنقل بالمعنى. اختر ما يخصّ القيمة مباشرة لا ما هو عام.
أعد الإجابة بصيغة JSON فقط: {"verses": ["..."], "hadiths": ["..."]}`;

  let parsed: Candidates = {};
  try {
    const res = await client.chat.completions.create({
      model: RETRIEVE_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: `القيمة: ${value}` },
      ],
    });
    parsed = JSON.parse(res.choices[0]?.message?.content ?? "{}");
  } catch {
    parsed = {};
  }

  const verses: string[] = [];
  const hadiths: string[] = [];

  for (const item of (parsed.verses ?? []).slice(0, 8)) {
    const text = asText(item);
    if (!text) continue;
    const match = verifyVerse(text);
    if (match) verses.push(`«${text}» (${match.reference})`);
  }
  for (const item of (parsed.hadiths ?? []).slice(0, 8)) {
    const text = asText(item);
    if (!text) continue;
    const match = verifyHadith(text);
    if (match) {
      const grade = match.reference.includes("البخاري")
        ? "رواه البخاري"
        : "رواه مسلم";
      hadiths.push(`«${text}» (${grade})`);
    }
  }

  return { verses, hadiths };
}
