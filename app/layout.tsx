import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/* خط Baloo Bhaijaan 2 — عربي مدوّر مرح، ملف متغيّر يغطي الأوزان 400–800 */
const baloo = localFont({
  src: [{ path: "./fonts/BalooBhaijaan2-arabic.woff2", weight: "400 800" }],
  variable: "--font-baloo",
  display: "swap",
});

/* خط رمز الريال السعودي الرسمي (الرمز عند U+E900) */
const riyal = localFont({
  src: [{ path: "./fonts/SaudiRiyal.woff2", weight: "400" }],
  variable: "--font-riyal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ghiras.kids"),
  title: "غِراس — قصصٌ تُروى، وقيمٌ تُغرس",
  description: "أداة بسيطة تولّد قصة أطفال عربية مخصصة بأسلوب إسلامي، مع صورة لأهم مشهد فيها.",
  openGraph: {
    title: "غِراس — قصصٌ تُروى، وقيمٌ تُغرس",
    description: "قصة أطفال عربية مخصصة بأسلوب إسلامي، مع صورة لأهم مشهد فيها.",
    url: "https://ghiras.kids",
    siteName: "غِراس",
    locale: "ar",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${baloo.variable} ${riyal.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
