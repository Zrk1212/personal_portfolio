import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/site/shell";
import { Hero } from "@/components/site/hero";
import { Skills } from "@/components/site/skills";
import { About, Closing, Faq, Pricing, Sessions } from "@/components/site/sections";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#171721",
};

/* Homepage. Copy lives in ./content.ts; each section is a component in
   src/components/site. The hero's scroll sequence ends on "What I've built". */
export default function Home() {
  return (
    <SiteShell home>
      <main id="main">
        <Hero />
        <Skills />
        <Sessions />
        <Pricing />
        <About />
        <Faq />
        <Closing />
      </main>
    </SiteShell>
  );
}
