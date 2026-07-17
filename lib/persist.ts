import type { ValueReference } from "./references";

/**
 * حفظ دائم للقيم المخصّصة الجديدة في مكتبة التطبيق عبر GitHub.
 *
 * حين تُكتشف قيمة جديدة موثّقة، نضيفها إلى ملف lib/learned-references.json في
 * المستودع عبر واجهة GitHub (commit تلقائي)، فيعيد Vercel النشر وتصير القيمة
 * جزءًا دائمًا من المكتبة. يتطلّب ضبط متغيّرات البيئة:
 *   GITHUB_TOKEN  : مفتاح GitHub بصلاحية الكتابة على المحتوى (contents: write)
 *   GITHUB_REPO   : اسم المستودع، مثال: "Cyanera/Ghiras"
 *   GITHUB_BRANCH : الفرع (اختياري، الافتراضي main)
 * وإن لم تُضبط، يُتخطّى الحفظ بهدوء دون التأثير على توليد القصة.
 */

const PATH = "lib/learned-references.json";
// حماية من التكرار داخل نسخة الخادم الواحدة قبل إعادة النشر.
const handledThisInstance = new Set<string>();

export async function saveLearnedValue(
  value: string,
  ref: ValueReference
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) return; // الحفظ غير مُهيَّأ

  const key = value.trim();
  if (!key || handledThisInstance.has(key)) return;
  if (ref.verses.length === 0 && ref.hadiths.length === 0) return;
  handledThisInstance.add(key);

  const api = `https://api.github.com/repos/${repo}/contents/${PATH}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "ghiras-app",
  };

  try {
    let data: Record<string, ValueReference> = {};
    let sha: string | undefined;

    const getRes = await fetch(`${api}?ref=${branch}`, { headers });
    if (getRes.ok) {
      const j = (await getRes.json()) as { sha: string; content: string };
      sha = j.sha;
      data = JSON.parse(
        Buffer.from(j.content, "base64").toString("utf8")
      ) as Record<string, ValueReference>;
    }

    if (data[key]) return; // مُضافة سابقًا

    data[key] = ref;
    const content = Buffer.from(
      JSON.stringify(data, null, 2),
      "utf8"
    ).toString("base64");

    await fetch(api, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `إضافة قيمة «${key}» إلى المكتبة تلقائيًا`,
        content,
        sha,
        branch,
      }),
    });
  } catch {
    // نسمح بإعادة المحاولة في طلب لاحق إن فشل الاتصال
    handledThisInstance.delete(key);
  }
}
