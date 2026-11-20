import Link from "next/link";

/* ---------------- Closing CTA ---------------- */

export function Closing() {
  return (
    <section id="contact" data-section-theme="dark" className="pb-16 pt-20 sm:pt-28">
      <div className="m-wrap text-center">
        <h2 className="m-h2 mx-auto max-w-[560px] text-balance">
          Have a student with an idea? Let&apos;s make it real.
        </h2>
        <p className="m-body m-th mx-auto mt-5 max-w-[460px]" style={{ color: "var(--muted)" }}>
          Tell me a little about your student and I&apos;ll get back to you
          within a day.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link href="/contact" className="m-btn m-btn-primary">
            Book a session
          </Link>
          <a href="#pricing" className="m-btn m-btn-secondary">
            See pricing
          </a>
        </div>
      </div>
    </section>
  );
}
