import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/site/shell";
import { Hero } from "@/components/site/hero";
import { Skills } from "@/components/site/skills";
import { Sessions } from "@/components/site/sessions";
import { About, Pricing } from "@/components/site/sections";
import { Faq } from "@/components/site/faq";
import { Closing } from "@/components/site/closing";
import { FAQ, PRICING } from "./content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const BASE = "https://founder.zrk.ventures";

// Structured data, so search engines and AI assistants read the business, its
// prices and the FAQ exactly as the page shows them. Built from content.ts.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE}/#org`,
      name: "Founder",
      url: BASE,
      logo: `${BASE}/icons/icon-512.png`,
      email: "zacklein555@gmail.com",
      founder: { "@type": "Person", name: "Zac Klein" },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#site`,
      name: "Founder",
      url: BASE,
      publisher: { "@id": `${BASE}/#org` },
    },
    {
      "@type": "Service",
      name: "One-on-one AI app-building sessions for high school students",
      description:
        "Students build and launch a real web or iOS app with AI, one-on-one over Zoom, starting from their own idea.",
      provider: { "@id": `${BASE}/#org` },
      audience: { "@type": "EducationalAudience", educationalRole: "student" },
      availableChannel: { "@type": "ServiceChannel", serviceUrl: `${BASE}/contact` },
      offers: PRICING.flatMap((t) =>
        t.rows.flatMap((r) => [
          { name: `${t.track}, ${r.length} session`, price: r.single },
          { name: `${t.track}, bundle of 5 ${r.length} sessions`, price: r.bundle },
        ])
      ).map((o) => ({
        "@type": "Offer",
        name: o.name,
        price: o.price.replace(/[$,]/g, ""),
        priceCurrency: "USD",
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#171721",
};

/* Homepage. Copy lives in ./content.ts; each section is a component in
   src/components/site. The hero's scroll sequence ends on "What I've built". */
export default function Home() {
  return (
    <SiteShell home>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
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
