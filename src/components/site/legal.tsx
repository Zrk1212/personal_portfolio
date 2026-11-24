import type { Metadata } from "next";
import { SiteShell } from "./shell";

export const LEGAL_UPDATED = "November 24, 2026";
export const LEGAL_EMAIL = "zacklein555@gmail.com";

/* Metadata for a secondary legal page, same pattern as /contact */
export function legalMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      siteName: "Founder",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Founder" }],
    },
    twitter: { card: "summary_large_image", title, images: ["/og.jpg"] },
  };
}

export type LegalSection = { heading: string; body: React.ReactNode; id?: string };

export function EmailLink() {
  return (
    <a
      href={`mailto:${LEGAL_EMAIL}`}
      className="m-focus rounded underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current"
    >
      {LEGAL_EMAIL}
    </a>
  );
}

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <SiteShell>
      <main id="main">
        <section data-section-theme="dark" className="pb-20 pt-[136px] sm:pt-[168px]">
          <div className="m-wrap">
            <div className="max-w-[680px]">
              <h1 className="m-h1 text-balance">{title}</h1>
              <p className="mt-4 text-[14px]" style={{ color: "var(--muted)" }}>
                Last updated: {LEGAL_UPDATED}
              </p>
              <p className="m-body mt-8">{intro}</p>
              {sections.map((s) => (
                <section key={s.heading} id={s.id} className="mt-12 scroll-mt-[96px]">
                  <h2 className="m-h3">{s.heading}</h2>
                  <div
                    className="mt-4 space-y-4 text-[16px] leading-[1.6]"
                    style={{ color: "var(--muted)" }}
                  >
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
