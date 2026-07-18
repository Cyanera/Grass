/** رمز الريال السعودي الجديد (يُعرض عبر الخط الرسمي عند المحرف U+E900). */
export default function Riyal({ className }: { className?: string }) {
  return (
    <span
      className={`riyal-symbol ${className ?? ""}`}
      role="img"
      aria-label="ريال سعودي"
    >
      {"\uE900"}
    </span>
  );
}
