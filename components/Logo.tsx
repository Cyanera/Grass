const HEART =
  "M0 4.4 C-1.2 2.6 -5 0.4 -5 -2.2 C-5 -4.4 -3.2 -5.6 -1.7 -5.6 C-0.8 -5.6 -0.2 -5.2 0 -4.6 C0.2 -5.2 0.8 -5.6 1.7 -5.6 C3.2 -5.6 5 -4.4 5 -2.2 C5 0.4 1.2 2.6 0 4.4 Z";

const STAR =
  "M0 -6 L1.5 -2.1 L5.7 -1.9 L2.4 0.8 L3.5 4.9 L0 2.6 L-3.5 4.9 L-2.4 0.8 L-5.7 -1.9 L-1.5 -2.1 Z";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* الأرض */}
      <ellipse cx="60" cy="110" rx="30" ry="4" className="fill-line" />
      {/* الجذع والأغصان */}
      <g className="stroke-[#a97e58]" fill="none" strokeLinecap="round">
        <path d="M60 108 C60 92 60 80 60 62" strokeWidth="7" />
        <path d="M60 74 C52 68 44 62 38 52" strokeWidth="4.5" />
        <path d="M60 74 C68 68 76 62 84 52" strokeWidth="4.5" />
        <path d="M60 62 C55 52 51 46 48 38" strokeWidth="4" />
        <path d="M60 62 C65 52 69 46 73 38" strokeWidth="4" />
        <path d="M60 62 C60 50 60 42 60 32" strokeWidth="4" />
        <path d="M38 52 C33 48 29 44 27 39" strokeWidth="3.5" />
        <path d="M84 52 C89 48 93 44 95 39" strokeWidth="3.5" />
      </g>
      {/* أوراق الشجرة: قلوب ونجوم ودوائر بألوان الهوية الثلاثة */}
      <g transform="translate(60,24) scale(1.25)">
        <path d={HEART} className="fill-rose" />
      </g>
      <g transform="translate(27,32) scale(1.1)">
        <path d={STAR} className="fill-gold" />
      </g>
      <g transform="translate(95,32) scale(1.1)">
        <path d={STAR} className="fill-blue" />
      </g>
      <g transform="translate(45,30) scale(0.95)">
        <path d={HEART} className="fill-blue" />
      </g>
      <g transform="translate(76,29) scale(0.95)">
        <path d={HEART} className="fill-gold" />
      </g>
      <circle cx="36" cy="45" r="5.5" className="fill-rose" />
      <circle cx="86" cy="45" r="5.5" className="fill-gold" />
      <circle cx="60" cy="42" r="4" className="fill-blue" />
      <circle cx="49" cy="44" r="3" className="fill-gold" />
      <circle cx="71" cy="44" r="3" className="fill-rose" />
      {/* أوراق متساقطة صغيرة */}
      <circle cx="90" cy="72" r="3" className="fill-rose" opacity="0.7" />
      <circle cx="32" cy="78" r="2.5" className="fill-blue" opacity="0.7" />
    </svg>
  );
}
