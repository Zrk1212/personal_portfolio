import Image from "next/image";
import Link from "next/link";
import { PRICING } from "@/app/content";
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
          With a bundle of 5, students will build an entire online business
          they can put on their Common Application.
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
                I&apos;m a student at UVA from Chappaqua, NY. I&apos;ve built and
                shipped multiple online businesses with AI. My proudest venture
                is Vantage Recruiting, an AI lacrosse recruiting tool that&apos;s
                live on the App Store with 100+ paying users. I&apos;m always
                looking for pain points to solve with AI.
              </p>
              <p>
                I&apos;ll teach the exact tools I use every week, one-on-one, at
                your student&apos;s pace. They&apos;ll get real, hands-on
                experience building a business they can use on their college
                application.
              </p>
            </div>
            {/* TODO: add a parent or student testimonial here once you have one. */}
          </div>
        </div>
      </div>
    </section>
  );
}
