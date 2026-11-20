import type { CSSProperties } from "react";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";

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

/* The studio theme's fonts, loaded only for /apify. The wrapper takes up no
   space (display: contents); it just hands the font variables to the page. */
export default function ApifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} contents`}
      style={
        {
          "--font-display": "var(--font-fraunces)",
          "--font-sans": "var(--font-geist-sans)",
          "--font-mono": "var(--font-geist-mono)",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
