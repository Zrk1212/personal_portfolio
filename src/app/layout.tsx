import type { Metadata } from "next";
import { Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
// Styles for single components. Loaded here, after the globals, so every page
// shares one stylesheet and none is fetched ahead for a page that won't use it.
import "../components/site/painter.css";
import "../components/site/step-art.css";
import "../components/site/closing.css";

// Body and headline face for the tutoring pages (homepage and /contact)
const figtree = Figtree({
  variable: "--font-site",
  subsets: ["latin"],
});

// Small monospace details (file names, the terminal tile). Below the fold,
// so it isn't worth a preload on the first paint.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

// The studio fonts for /apify (Geist, Fraunces) load in src/app/apify/layout.tsx,
// so the tutoring pages don't download fonts they never show.

// Preview card shown when the site is shared in a text, email or social post
const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Founder. Your ambition is the limit. One-on-one sessions where your high schooler builds and launches a real online business.",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://founder.zrk.ventures"),
  title: "Founder · Teaching high schoolers to build real apps with AI",
  description:
    "One-on-one sessions where high school students build and launch a real web or iOS app with AI. One-on-one over Zoom.",
  applicationName: "Founder",
  authors: [{ name: "Zac Klein", url: "https://founder.zrk.ventures" }],
  openGraph: {
    title: "Founder · Teaching high schoolers to build real apps with AI",
    description:
      "One-on-one sessions where high school students build and launch a real web or iOS app with AI, and learn skills that carry over to whatever they build next.",
    type: "website",
    url: "/",
    siteName: "Founder",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Founder · Teaching high schoolers to build real apps with AI",
    description:
      "One-on-one sessions where high school students build and launch a real web or iOS app with AI.",
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">{children}</body>
    </html>
  );
}
