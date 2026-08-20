import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const rodin = localFont({
  src: "../fonts/sce-ps3-rodin.ttf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arpeetbarvalia.com"),
  title: {
    default: "Arpeet Barvalia",
    template: "%s — Arpeet Barvalia",
  },
  description:
    "Portfolio of Arpeet Barvalia — CS & Data Science student at Rutgers, data engineer, and short-film maker.",
  icons: {
    icon: "/images/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "Arpeet Barvalia",
    description:
      "CS & Data Science student at Rutgers, data engineer, and short-film maker.",
    images: ["/images/og-image.svg"],
    url: "https://arpeetbarvalia.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arpeet Barvalia",
    description: "CS & Data Science student at Rutgers, data engineer, and short-film maker.",
    images: ["/images/og-image.svg"],
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rodin.variable}>
      <body className="font-sans antialiased bg-black text-white">{children}</body>
    </html>
  );
}
