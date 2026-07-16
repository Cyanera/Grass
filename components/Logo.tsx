export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true">
      {/* الخلفية */}
      <circle cx="56" cy="56" r="52" className="fill-sun-soft" />
      <circle
        cx="56"
        cy="56"
        r="52"
        fill="none"
        className="stroke-sun"
        strokeWidth="3.5"
      />
      {/* الشمس */}
      <circle cx="78" cy="32" r="7" className="fill-sun" />
      {/* الكتاب المفتوح */}
      <path
        d="M24 68 C35 62 48 62 56 67 C64 62 77 62 88 68 L88 78 C77 72 64 72 56 77 C48 72 35 72 24 78 Z"
        className="fill-leaf-deep"
      />
      <path
        d="M28 66 C38 61.5 48 61.5 56 66 C64 61.5 74 61.5 84 66 L84 69 C74 64.5 64 64.5 56 69 C48 64.5 38 64.5 28 69 Z"
        fill="#ffffff"
        opacity="0.9"
      />
      {/* النبتة تنمو من الكتاب */}
      <path
        d="M56 64 C56 55 56 48 56 41"
        className="stroke-leaf-deep"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 50 C46 48.5 39.5 41 38.5 30.5 C49 32.5 55.5 40 56 50 Z"
        className="fill-leaf"
      />
      <path
        d="M56 44 C66 42.5 72.5 35 73.5 24.5 C63 26.5 56.5 34 56 44 Z"
        className="fill-leaf-deep"
      />
      {/* ورقة صغيرة ثالثة */}
      <circle cx="56" cy="37" r="3" className="fill-coral" />
    </svg>
  );
}
