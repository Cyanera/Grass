import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const thmanyahDisplay = localFont({
  src: [
    { path: "./fonts/ThmanyahSerifDisplay-Light.woff2", weight: "300" },
    { path: "./fonts/ThmanyahSerifDisplay-Regular.woff2", weight: "400" },
    { path: "./fonts/ThmanyahSerifDisplay-Medium.woff2", weight: "500" },
    { path: "./fonts/ThmanyahSerifDisplay-Bold.woff2", weight: "700" },
    { path: "./fonts/ThmanyahSerifDisplay-Black.woff2", weight: "900" },
  ],
  variable: "--font-thmanyah-display",
  display: "swap",
});

const thmanyahText = localFont({
  src: [
    { path: "./fonts/ThmanyahSerifText-Light.woff2", weight: "300" },
    { path: "./fonts/ThmanyahSerifText-Regular.woff2", weight: "400" },
    { path: "./fonts/ThmanyahSerifText-Medium.woff2", weight: "500" },
    { path: "./fonts/ThmanyahSerifText-Bold.woff2", weight: "700" },
    { path: "./fonts/ThmanyahSerifText-Black.woff2", weight: "900" },
  ],
  variable: "--font-thmanyah-text",
  display: "swap",
});

const thmanyahSans = localFont({
  src: [
    { path: "./fonts/ThmanyahSans-Light.woff2", weight: "300" },
    { path: "./fonts/ThmanyahSans-Regular.woff2", weight: "400" },
    { path: "./fonts/ThmanyahSans-Medium.woff2", weight: "500" },
    { path: "./fonts/ThmanyahSans-Bold.woff2", weight: "700" },
    { path: "./fonts/ThmanyahSans-Black.woff2", weight: "900" },
  ],
  variable: "--font-thmanyah-sans",
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
    <html
      lang="ar"
      dir="rtl"
      className={`${thmanyahDisplay.variable} ${thmanyahText.variable} ${thmanyahSans.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
