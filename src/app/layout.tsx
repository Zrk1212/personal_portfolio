import type { Metadata } from "next";
import { Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";

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
  alt: "A desk and laptop on a hilltop overlooking a river valley, with the headline: Your idea is the limit.",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://zrk.ventures"),
  title: "Zac Klein · Teaching high schoolers to build real apps with AI",
  description:
    "One-on-one sessions where high school students build and launch a real web or iOS app with AI. In person in Westchester or over Zoom.",
  applicationName: "Zac Klein",
  authors: [{ name: "Zac Klein", url: "https://zrk.ventures" }],
  openGraph: {
    title: "Zac Klein · Teaching high schoolers to build real apps with AI",
    description:
      "One-on-one sessions where high school students build and launch a real web or iOS app with AI, and learn skills that carry over to whatever they build next.",
    type: "website",
    url: "/",
    siteName: "Zac Klein",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zac Klein · Teaching high schoolers to build real apps with AI",
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
