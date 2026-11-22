import type { CSSProperties } from "react";
import Link from "next/link";
import { LogoMark } from "./logo";

/* ---------------- Closing CTA ---------------- */

export function Closing() {
  return (
    <section id="contact" data-section-theme="dark" className="cl-closing scroll-mt-[72px] pb-16 pt-20 sm:pt-28">
      <div className="m-wrap grid items-center gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)]">
        <div className="relative z-10">
          <h2 className="text-[30px] font-[480] leading-[1.12] tracking-[-0.03em] sm:text-[38px]">
            <span className="block text-balance">Have a student with an idea?</span>
            <span className="cl-fade block">Let&apos;s make it real.</span>
          </h2>
          <p className="m-body m-th mt-5 max-w-[460px]" style={{ color: "var(--muted)" }}>
            Tell me a little about the student and I&apos;ll get back to you within a day.
          </p>
          <Link href="/contact" className="m-btn m-btn-primary cl-cta m-focus mt-9">
            <LogoMark className="h-[18px] w-auto shrink-0" />
            Book a session
          </Link>
        </div>

        {/* decorative floating keycaps */}
        <div aria-hidden className="relative mx-auto h-[200px] w-full max-w-[340px] sm:h-[280px] md:max-w-none">
          <div className="cl-glow" />
          <div
            className="cl-keycap cl-keycap-hero left-[24%] top-[24%] h-32 w-32 sm:h-36 sm:w-36"
            style={{ "--cl-r": "-14deg", "--cl-d": "0s" } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/app-store.svg" alt="" width={144} height={144} loading="lazy" decoding="async" className="cl-keycap-img" />
          </div>
          <div
            className="cl-keycap cl-keycap-app right-[2%] top-0 h-24 w-24 sm:h-28 sm:w-28"
            style={{ "--cl-r": "12deg", "--cl-d": "-2.2s" } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/vantage-app.webp" alt="" width={112} height={112} loading="lazy" decoding="async" className="cl-keycap-img" />
          </div>
        </div>
      </div>
    </section>
  );
}
