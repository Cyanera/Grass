import quranData from "./quran-data.json";

/**
 * التحقق من الآيات القرآنية آليًا مقابل نص المصحف الكامل (6236 آية).
 *
 * الفكرة: بدل الوثوق بذاكرة النموذج، نتحقق أن كل نص يدّعي النموذج أنه آية
 * موجودٌ حرفيًا في المصحف (بعد تطبيع الرسم والتشكيل)، ونستخرج اسم السورة
 * ورقم الآية تلقائيًا. إن لم يوجد النص، تُرفض الآية ولا تظهر للمستخدم.
 */

type Row = [number, string, number, string]; // [surahNum, surahName, ayahNum, text]
const ROWS = quranData as Row[];

/** تطبيع النص العربي: إزالة التشكيل والتطويل وتوحيد الهمزات والألف. */
export function normalizeArabic(input: string): string {
  return input
    .normalize("NFC")
    // إزالة الحركات والتنوين والشدة والسكون والعلامات القرآنية الصغيرة
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿ]/g, "")
    .replace(/ـ/g, "") // التطويل (ـ)
    // توحيد الحروف المتغيّرة الرسم
    .replace(/ى/g, "ي") // ألف مقصورة → ياء
    .replace(/ة/g, "ه") // تاء مربوطة → هاء
    // إسقاط جميع صور الهمزة ومقاعدها (ء ؤ ئ) لتوحيد اختلاف الرسم (مسؤول/مسئول)
    .replace(/[ءؤئ]/g, "")
    // إسقاط جميع الألفات (ومنها الألف الخنجرية العثمانية وألفات الهمزة) لتوحيد الرسمين
    .replace(/[آأإٱا]/g, "")
    // إزالة كل ما ليس حرفًا عربيًا أو مسافة
    .replace(/[^ء-ي\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// فهرس مُطبَّع لكل آية، يُبنى مرة واحدة.
const NORMALIZED: string[] = ROWS.map((r) => normalizeArabic(r[3]));

export type VerseMatch = {
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  reference: string; // مثال: «سورة البقرة: 153»
};

/**
 * يتحقق أن نصًّا (آيةً كاملة أو مقطعًا منها) موجود في المصحف.
 * يعيد مرجع الآية إن وُجد، وإلا null.
 */
export function verifyVerse(text: string): VerseMatch | null {
  const needle = normalizeArabic(text);
  // تجاهل المقاطع القصيرة جدًا لتفادي المطابقات العابرة
  if (needle.length < 6) return null;

  for (let i = 0; i < NORMALIZED.length; i++) {
    if (NORMALIZED[i].includes(needle)) {
      const [surahNumber, surahName, ayahNumber] = ROWS[i];
      return {
        surahName,
        surahNumber,
        ayahNumber,
        reference: `سورة ${surahName}: ${ayahNumber}`,
      };
    }
  }
  return null;
}
