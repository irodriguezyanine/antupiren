import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AnalyticsScripts } from "@/components/analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Centro de Eventos Antupirén | Peñalolén",
  description:
    "Matrimonios, eventos corporativos y celebraciones en Peñalolén. Agenda tu visita por WhatsApp.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://eventosantupiren.cl",
  ),
  icons: {
    icon: "/logo-antupiren.png",
    shortcut: "/logo-antupiren.png",
    apple: "/logo-antupiren.png",
  },
  openGraph: {
    title: "Centro de Eventos Antupirén | Peñalolén",
    description:
      "Matrimonios, eventos corporativos y celebraciones en Peñalolén. Agenda tu visita por WhatsApp.",
    images: ["/logo-antupiren.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-zinc-900">
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
