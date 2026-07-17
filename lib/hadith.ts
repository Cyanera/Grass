import hadithData from "./hadith-data.json";
import { normalizeArabic } from "./quran";

/**
 * التحقق من الأحاديث آليًا مقابل نصوص صحيح البخاري وصحيح مسلم كاملةً
 * (14,736 حديثًا). كل ما في هذين الكتابين صحيح بإجماع أهل العلم، فوجود
 * الحديث فيهما يمنحه درجة «صحيح» ومرجعًا دقيقًا تلقائيًا.
 *
 * المطابقة تعتمد على تطبيع النص والبحث عن المتن كمقطع داخل نص الحديث
 * الكامل (بإسناده)، فيكفي أن ينقل النموذج المتن بحروفه كما ورد.
 */

type Row = [string, number, string]; // [source, idInBook, normalizedText]
const ROWS = hadithData as Row[];

export type HadithMatch = {
  source: string; // «صحيح البخاري» أو «صحيح مسلم»
  number: number; // رقم الحديث في الكتاب
  reference: string; // مثال: «رواه البخاري (رقم 1)»
};

/**
 * يتحقق أن نصًّا (متن حديث) موجود في البخاري أو مسلم.
 * يعيد مرجع الحديث ودرجته إن وُجد، وإلا null.
 */
export function verifyHadith(text: string): HadithMatch | null {
  const needle = normalizeArabic(text);
  // متون الأحاديث أطول من مقاطع الآيات؛ نطلب حدًا أدنى لتفادي المطابقات العابرة
  if (needle.length < 10) return null;

  for (let i = 0; i < ROWS.length; i++) {
    if (ROWS[i][2].includes(needle)) {
      const [source, number] = ROWS[i];
      const short = source.includes("البخاري") ? "البخاري" : "مسلم";
      return {
        source,
        number,
        reference: `رواه ${short} (رقم ${number})`,
      };
    }
  }
  return null;
}
