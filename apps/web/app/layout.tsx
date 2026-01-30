import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14B8A6",
};

export const metadata: Metadata = {
  title: "HeyTripy - Ton compagnon de voyage IA",
  description:
    "Planifie ton prochain voyage en discutant avec Tripy, ton assistant IA. Vols, hôtels, activités - tout en une conversation.",
  keywords: ["voyage", "IA", "planification", "assistant", "vols", "hôtels"],
  authors: [{ name: "HeyTripy" }],
  robots: "index, follow",
  openGraph: {
    title: "HeyTripy - Ton compagnon de voyage IA",
    description:
      "Planifie ton prochain voyage en discutant avec Tripy, ton assistant IA.",
    type: "website",
    locale: "fr_FR",
    siteName: "HeyTripy",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeyTripy - Ton compagnon de voyage IA",
    description:
      "Planifie ton prochain voyage en discutant avec Tripy, ton assistant IA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <body
        className={`${plusJakarta.variable} ${inter.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
