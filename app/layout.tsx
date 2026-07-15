import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const thmanyah = localFont({
  src: [
    { path: "./fonts/ThmanyahSerifDisplay-Light.woff2", weight: "300" },
    { path: "./fonts/ThmanyahSerifDisplay-Regular.woff2", weight: "400" },
    { path: "./fonts/ThmanyahSerifDisplay-Medium.woff2", weight: "500" },
    { path: "./fonts/ThmanyahSerifDisplay-Bold.woff2", weight: "700" },
    { path: "./fonts/ThmanyahSerifDisplay-Black.woff2", weight: "900" },
  ],
  variable: "--font-thmanyah",
  display: "swap",
});

export const metadata: Metadata = {
  title: "غِراس — قصصٌ تُروى، وقيمٌ تُغرس",
  description: "أداة بسيطة تولّد قصة أطفال مخصصة مع صورة لأهم مشهد فيها.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={thmanyah.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
