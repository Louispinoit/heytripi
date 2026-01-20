import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeyTripy - Ton compagnon de voyage IA",
  description:
    "Planifie ton prochain voyage en discutant avec Tripy, ton assistant IA. Vols, hôtels, activités - tout en une conversation.",
  keywords: ["voyage", "IA", "planification", "assistant", "vols", "hôtels"],
  openGraph: {
    title: "HeyTripy - Ton compagnon de voyage IA",
    description:
      "Planifie ton prochain voyage en discutant avec Tripy, ton assistant IA.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${plusJakarta.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
