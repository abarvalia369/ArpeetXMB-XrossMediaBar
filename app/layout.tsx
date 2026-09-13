import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/content";

const rodin = localFont({
  src: "../fonts/sce-ps3-rodin.ttf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.seo.url),
  title: {
    default: SITE.name,
    template: SITE.seo.titleTemplate,
  },
  description: SITE.description,
  icons: {
    icon: SITE.seo.favicon,
  },
  openGraph: {
    type: "website",
    title: SITE.name,
    description: SITE.tagline,
    images: [SITE.seo.ogImage],
    url: `${SITE.seo.url}/`,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.tagline,
    images: [SITE.seo.ogImage],
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rodin.variable}>
      <body className="font-sans antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
