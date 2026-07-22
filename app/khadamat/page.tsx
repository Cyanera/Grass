import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  PACKAGES,
  WHATSAPP_NUMBER,
  ORDER_EMAIL,
  FREELANCE_DOC_NUMBER,
  type Package,
} from "@/lib/services";

export const metadata: Metadata = {
  title: "خدمات غِراس — قصصٌ وكتبٌ مخصّصة لأطفالكم",
  description:
    "باقات غِراس المدفوعة: قصص مطوّلة مخصّصة، وكتب قيم مصوّرة، ونسخ مطبوعة تُهدى. اطلبيها باسم طفلك.",
  openGraph: {
    title: "خدمات غِراس — قصصٌ وكتبٌ مخصّصة لأطفالكم",
    description:
      "باقات غِراس المدفوعة: قصص مطوّلة مخصّصة، وكتب قيم مصوّرة، ونسخ مطبوعة تُهدى.",
    url: "https://ghiras.kids/khadamat",
    siteName: "غِراس",
    locale: "ar",
    type: "website",
  },
};

const ACCENTS = {
  gold: {
    ring: "border-gold",
    chip: "bg-gold-soft text-ink",
    check: "text-gold",
    btn: "bg-gold text-ink hover:brightness-105",
  },
  blue: {
    ring: "border-blue",
    chip: "bg-blue-soft text-blue-deep",
    check: "text-blue-deep",
    btn: "bg-blue-deep text-white hover:brightness-110",
  },
  rose: {
    ring: "border-rose",
    chip: "bg-rose-soft text-rose-deep",
    check: "text-rose-deep",
    btn: "bg-rose-deep text-white hover:brightness-110",
  },
} as const;

function orderMessage(pkg: Package): string {
  return `السلام عليكم، أرغب في طلب باقة «${pkg.name}» من غِراس (${pkg.price} ر.س).\n\nاسم الطفل:\nعمره:\nالقيمة/الفكرة المطلوبة:\nتفاصيل إضافية:`;
}

function mailtoLink(pkg: Package): string {
  const subject = `طلب باقة: ${pkg.name} — غِراس`;
  return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(orderMessage(pkg))}`;
}

function whatsappLink(pkg: Package): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    orderMessage(pkg)
  )}`;
}

const STEPS = [
  {
    n: "١",
    title: "اختاري الباقة",
    body: "حدّدي ما يناسب طفلك: قصة مطوّلة، أو كتاب قيم مصوّر، أو نسخة مطبوعة تُهدى.",
  },
  {
    n: "٢",
    title: "أرسلي التفاصيل",
    body: "اسم الطفل وعمره والقيمة التي تودّين غرسها، مع أي فكرة أو تفصيل يميّز القصة.",
  },
  {
    n: "٣",
    title: "نصنعها ونسلّمها",
    body: "نكتب ونرسم ونراجع معك حتى الرضا، ثم نسلّمك الملف — أو نطبعه ونشحنه لبابك.",
  },
];

export default function KhadamatPage() {
  const hasWhatsapp = WHATSAPP_NUMBER.trim().length > 0;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-10 sm:py-14">
      {/* رأس الصفحة */}
      <header className="flex flex-col items-center gap-2 text-center">
        <Link href="/" aria-label="العودة إلى غِراس">
          <Logo className="h-20 w-20 sm:h-24 sm:w-24" />
        </Link>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">
          خدمات غِراس
        </h1>
        <p className="mt-1 max-w-xl text-lg font-medium text-ink-soft sm:text-xl">
          قصصٌ وكتبٌ مخصّصة، تُصنع باسم طفلك وتغرس فيه أجمل القيم.
        </p>

        {FREELANCE_DOC_NUMBER.trim().length > 0 && (
          <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm text-ink-soft">
            <span className="text-grass">✔</span>
            عملٌ موثّق بوثيقة العمل الحر — رقم {FREELANCE_DOC_NUMBER}
          </span>
        )}
      </header>

      {/* تنويه: الأداة المجانية تبقى متاحة */}
      <div className="mx-auto mt-8 flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-line bg-blue-soft px-5 py-4 text-center sm:text-start">
        <p className="text-sm leading-relaxed text-ink sm:text-base">
          تبين تجربة سريعة ومجانية أولًا؟ مولّد القصة القصيرة في غِراس متاح دائمًا.
        </p>
        <Link
          href="/"
          className="shrink-0 rounded-full border-2 border-blue px-4 py-2 text-sm font-bold text-blue-deep transition hover:bg-blue hover:text-white"
        >
          جرّبي مجانًا
        </Link>
      </div>

      {/* الباقات */}
      <section className="mt-12">
        <div className="grid gap-6 md:grid-cols-3">
          {PACKAGES.map((pkg) => {
            const a = ACCENTS[pkg.accent];
            return (
              <article
                key={pkg.id}
                className={`relative flex flex-col gap-5 rounded-3xl border-2 bg-white p-6 shadow-[0_14px_44px_-18px_rgba(42,37,48,0.22)] ${
                  pkg.featured ? `${a.ring} md:-translate-y-3` : "border-line"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-blue-deep px-4 py-1 text-sm font-bold text-white shadow">
                    الأكثر طلبًا
                  </span>
                )}

                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-black text-ink">{pkg.name}</h2>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {pkg.tagline}
                  </p>
                </div>

                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-ink">
                    {pkg.price}
                  </span>
                  <span className="pb-1 font-bold text-ink-soft">ر.س</span>
                  {pkg.unit && (
                    <span className={`mb-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${a.chip}`}>
                      {pkg.unit}
                    </span>
                  )}
                </div>

                <ul className="flex flex-col gap-2.5">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                      <span className={`mt-0.5 shrink-0 font-black ${a.check}`}>✔</span>
                      <span className="text-ink">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-2 pt-2">
                  {hasWhatsapp ? (
                    <>
                      <a
                        href={whatsappLink(pkg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-full px-5 py-3 text-center font-bold transition ${a.btn}`}
                      >
                        اطلبي عبر واتساب
                      </a>
                      <a
                        href={mailtoLink(pkg)}
                        className="rounded-full border border-line px-5 py-2.5 text-center font-medium text-ink-soft transition hover:border-blue hover:text-blue-deep"
                      >
                        أو عبر البريد
                      </a>
                    </>
                  ) : (
                    <a
                      href={mailtoLink(pkg)}
                      className={`rounded-full px-5 py-3 text-center font-bold transition ${a.btn}`}
                    >
                      اطلبي هذه الباقة
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* كيف تطلبين */}
      <section className="mt-16">
        <h2 className="text-center text-2xl font-black text-ink sm:text-3xl">
          كيف تطلبين؟
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col items-center gap-3 rounded-3xl border border-line bg-white p-6 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft text-2xl font-black text-ink">
                {s.n}
              </span>
              <h3 className="text-lg font-bold text-ink">{s.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* باقات المدارس والحضانات */}
      <section className="mt-16">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-gold-soft p-8 text-center sm:p-10">
          <h2 className="text-2xl font-black text-ink sm:text-3xl">
            للمدارس والحضانات ومبادرات الأطفال
          </h2>
          <p className="max-w-2xl text-ink-soft">
            سلاسل قصص مخصّصة لبرامجكم التربوية، بكميات وأسعار خاصة، مع إمكانية توحيد
            القيم والشخصيات عبر الكتب. نصمّم لكم ما يناسب رؤيتكم.
          </p>
          <a
            href={`mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(
              "طلب باقة للمدارس/الحضانات — غِراس"
            )}`}
            className="btn-gradient rounded-full px-7 py-3 font-bold text-white"
          >
            تواصلي لعرض خاص
          </a>
        </div>
      </section>

      {/* تذييل */}
      <footer className="mt-16 flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-ink-soft/80">
          غِراس <span className="text-rose">♥︎</span> قصص تُكتب بحب لأطفالكم
        </p>
        <div className="flex items-center gap-3">
          {hasWhatsapp && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="راسلنا عبر واتساب"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-grass hover:text-grass"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.33 4.95L2.05 22l5.28-1.38a9.86 9.86 0 0 0 4.71 1.2h.004c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.003a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.47-.02s-.43.06-.65.31c-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
              </svg>
            </a>
          )}
          <a
            href={`mailto:${ORDER_EMAIL}`}
            aria-label="راسلنا عبر البريد"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-blue hover:text-blue"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-blue-deep underline-offset-4 hover:underline"
        >
          ← العودة إلى غِراس
        </Link>
      </footer>
    </main>
  );
}
