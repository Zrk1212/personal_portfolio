import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Figtree } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial serif for display headlines — gives the dark UI a human, crafted feel
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Body and headline face for the tutoring pages (homepage and /contact)
const figtree = Figtree({
  variable: "--font-site",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zrk.ventures"),
  title: "Zac Klein · Teaching high schoolers to build real apps with AI",
  description:
    "One-on-one sessions where high school students build and launch a real web or iOS app with AI. In person in Westchester or over Zoom.",
  openGraph: {
    title: "Zac Klein · Teaching high schoolers to build real apps with AI",
    description:
      "One-on-one sessions where high school students build and launch a real web or iOS app with AI, and learn skills that carry over to whatever they build next.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">{children}</body>
    </html>
  );
}
