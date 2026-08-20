import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { XmbMenu } from "@/components/ui/xmb-menu";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={rubik.variable}>
      <body className="font-sans antialiased bg-black text-white">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* Rendered once here (not per-page) so it never remounts on navigation —
            same background, same running wave animation, on every route. */}
        <XmbMenu />
        {children}
      </body>
    </html>
  );
}
