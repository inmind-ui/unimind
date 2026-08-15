import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const previewUrl = new URL("/og.png", baseUrl).toString();

  return {
    metadataBase: baseUrl,
    title: "UniMind | ذكاء يعرف كليتك ويفهم منهجك",
    description:
      "منصة جامعية ذكية تعرف كليتك وفرقتك ومحاضراتك، وتمنحك مساعد AI يفهم سياق دراستك.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "UniMind | ذكاء يعرف كليتك ويفهم منهجك",
      description: "كل محاضراتك جاهزة، ومساعدك الذكي يعرف كليتك وفرقتك وسياق دراستك.",
      type: "website",
      locale: "ar_EG",
      images: [{ url: previewUrl, width: 1536, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "UniMind",
      description: "ذكاء يعرف كليتك ويفهم منهجك.",
      images: [previewUrl],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f7ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
