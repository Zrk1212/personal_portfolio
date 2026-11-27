import Image from "next/image";
import Link from "next/link";
import { BUNDLE_EXTRAS, PRICING } from "@/app/content";
import zacPhoto from "../../../public/about/zac.jpg";

/* ---------------- Pricing ---------------- */

// Row padding-top that matches the "Best value" chip (20px) + its gap (8px),
// so the length and single price line up with the bundle price below the chip.
const PR_BEST_PT = "pt-[48px]";

export function Pricing() {
  return (
    <section id="pricing" data-section-theme="dark" className="scroll-mt-[72px] pb-14 pt-24 sm:pb-16 sm:pt-28">
      <div className="m-wrap">
        <h2 className="m-h2 mx-auto max-w-[620px] text-balance text-center">
          Simple pricing, by the session.
        </h2>
        <p className="m-body m-th mx-auto mt-5 max-w-[520px] text-center" style={{ color: "var(--muted)" }}>
          With a bundle of 5, students turn a passion into a real online
          business.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {PRICING.map((t) => (
            <div
              key={t.track}
              className="m-th flex flex-col rounded-xl p-6 sm:p-8"
              style={{ backgroundColor: "var(--tile)" }}
            >
              <h3 className="m-h3">{t.track}</h3>
              <p className="m-body m-th mt-2 max-w-[420px]" style={{ color: "var(--muted)" }}>
                {t.blurb}
              </p>

              <table className="mt-auto w-full border-collapse text-left [&_thead_th]:pt-7">
                <caption className="sr-only">{t.track} prices</caption>
                <thead>
                  <tr className="m-th text-[13px] font-[440]" style={{ color: "var(--muted)" }}>
                    <th scope="col" className="pb-3 font-[440]">
                      <span className="sr-only">Session length</span>
                    </th>
                    <th scope="col" className="pb-3 text-right font-[440]">
                      Single<span className="max-[359px]:hidden"> session</span>
                    </th>
                    <th scope="col" className="pb-3 text-right font-[440]">
                      Bundle of 5
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r) => (
                    <tr key={r.length} className="m-th border-t" style={{ borderColor: "var(--rule)" }}>
                      <th
                        scope="row"
                        className={`whitespace-nowrap pb-5 pr-2 align-top text-[16px] font-[480] max-[359px]:text-[14px] ${r.best ? PR_BEST_PT : "pt-5"}`}
                      >
                        {r.length}
                      </th>
                      <td
                        className={`pb-5 text-right align-top text-[26px] font-[480] leading-none tracking-[-0.01em] max-[359px]:text-[21px] sm:text-[30px] ${r.best ? PR_BEST_PT : "pt-5"}`}
                      >
                        {r.single}
                      </td>
                      <td className="py-5 pl-3 text-right align-top">
                        {r.best && (
                          <span
                            className="mb-2 ml-auto flex h-5 w-fit items-center rounded-full bg-[var(--m-indigo)] px-2 text-[11px] font-[500] leading-none tracking-[0.01em] text-white"
                          >
                            Best value
                          </span>
                        )}
                        <span
                          className={`block text-[26px] font-[480] leading-none tracking-[-0.01em] max-[359px]:text-[21px] sm:text-[30px] ${r.best ? "pr-best m-th" : ""}`}
                        >
                          {r.bundle}
                        </span>
                        <span className="m-th mt-1.5 block text-[13px]" style={{ color: "var(--muted)" }}>
                          {r.each}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link
                href="/contact"
                className={`m-btn mt-1 self-start ${t.featured ? "m-btn-primary" : "m-btn-secondary"}`}
              >
                Book a session
              </Link>
            </div>
          ))}
        </div>

        <div className="m-th mt-8 rounded-xl p-6 sm:p-8" style={{ backgroundColor: "var(--tile)" }}>
          <h3 className="m-h3">Every bundle of 5 includes</h3>
          <ul className="mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
            {BUNDLE_EXTRAS.map((x) => (
              <li key={x.title} className="m-th border-t pt-5" style={{ borderColor: "var(--rule)" }}>
                <div className="flex items-center gap-2.5 text-[16px] font-[480]">
                  <svg viewBox="0 0 16 16" className="pr-best m-th h-4 w-4 shrink-0" aria-hidden>
                    <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4.8 8.2l2.1 2.1 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {x.title}
                </div>
                <p className="m-th mt-2 max-w-[400px] text-[15px] leading-[1.45]" style={{ color: "var(--muted)" }}>
                  {x.body}
                </p>
                {x.href && (
                  <Link
                    href={x.href}
                    prefetch={false}
                    className="m-focus mt-2 inline-block rounded text-[15px] font-[440] text-[var(--fg)] underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current"
                  >
                    {x.link}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <p className="m-body m-th mx-auto mt-10 max-w-[640px] text-center" style={{ color: "var(--muted)" }}>
          Not sure yet? Start with a free 30-minute consultation.{" "}
          <Link
            href="/contact"
            className="m-focus whitespace-nowrap rounded font-[440] text-[var(--fg)] underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current"
          >
            Book a call
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */

export function About() {
  return (
    <section id="about" data-section-theme="dark" className="scroll-mt-[72px] py-20 sm:py-24">
      <div className="m-wrap">
        <div
          className="m-th grid gap-10 border-t pt-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:items-center md:gap-16"
          style={{ borderColor: "var(--rule)" }}
        >
          <div className="relative aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-xl bg-[var(--tile)]">
            <Image
              src={zacPhoto}
              alt="Zac Klein"
              placeholder="blur"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="m-h3" style={{ fontSize: "clamp(24px, 2.3vw, 33px)" }}>
              Hey, I&apos;m Zac.
            </h2>
            <div className="m-body m-th mt-5 max-w-[480px] space-y-4" style={{ color: "var(--muted)" }}>
              <p>
                I&apos;m a founder and AI product builder. I look for real
                problems people have, build a practical fix and get it into
                their hands. I&apos;ve taken multiple apps and online
                businesses from a first idea to launch, including Vantage
                Recruiting, and my work has reached more than 5,000 users on
                the App Store and the web.
              </p>
              <p>
                Students work with me one-on-one over Zoom to turn their own
                idea into a live app in just a few weeks. They find a real
                problem, build an AI-powered solution and launch it to real
                users. By the end, they&apos;ve gone from idea to execution,
                with the skills and confidence to build whatever comes next.
              </p>
            </div>
            {/* TODO: add a parent or student testimonial here once you have one. */}
          </div>
        </div>
      </div>
    </section>
  );
}
