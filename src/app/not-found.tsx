import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/shell";

export const metadata: Metadata = {
  title: "Page not found · Founder",
  description: "That page doesn't exist. Head back to the homepage or book a free consultation.",
  robots: { index: false },
};

// Where most visitors were headed. Section ids live on the homepage.
const PLACES = [
  { href: "/#process", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#about", label: "About Zac" },
  { href: "/#faq", label: "FAQ" },
];

/* Shown for any URL that doesn't match a page */
export default function NotFound() {
  return (
    <SiteShell>
      <main id="main">
        <section
          data-section-theme="dark"
          className="flex min-h-[calc(100svh-120px)] items-center pb-16 pt-[136px]"
        >
          <div className="m-wrap text-center">
            <p className="text-[14px] font-[440] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
              404
            </p>
            <h1 className="m-h1 mx-auto mt-4 max-w-[640px] text-balance">
              This page doesn&apos;t exist
            </h1>
            <p className="m-body mx-auto mt-5 max-w-[440px]" style={{ color: "var(--muted)" }}>
              The link may be old or mistyped. Everything about the sessions
              is on the homepage, or you can book a free 30-minute
              consultation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Link href="/" className="m-btn m-btn-primary">
                Back to the homepage
              </Link>
              <Link href="/contact" className="m-btn m-btn-secondary">
                Book a consultation
              </Link>
            </div>
            <nav aria-label="Popular pages" className="mt-12">
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px]">
                {PLACES.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="m-focus rounded underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current"
                      style={{ color: "var(--muted)" }}
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
