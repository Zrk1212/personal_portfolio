"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { FAQ, PRICING, PROCESS } from "@/app/content";
import zacPhoto from "../../../public/about/zac.jpg";
import { TabList, usePrefersReducedMotion } from "./shell";

/* ---------------- How the 4 sessions go ---------------- */

// What the student walks away with after each session
const OUTCOMES = ["plan.md", "A working first version", "An AI feature and one automation", "your-app.vercel.app"];

export function Sessions() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Only auto-advance while the section is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="process"
      data-section-theme="cool"
      className="scroll-mt-[72px] pb-28 pt-24 sm:pb-36 sm:pt-32"
    >
      <div className="m-wrap grid gap-10 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col">
          <h2 className="m-h3 max-w-[440px] text-balance" style={{ fontSize: "clamp(24px, 2.3vw, 33px)" }}>
            From idea to a live app in four sessions.
          </h2>
          <p className="m-body m-th mt-4 max-w-[440px]" style={{ color: "var(--muted)" }}>
            Each session is one hour, one-on-one. The last one ends with your
            student showing you the finished app.
          </p>
          <div className="mt-10 md:mt-auto md:pt-16">
            <TabList
              active={active}
              onSelect={setActive}
              auto={inView && !reduced}
              duration={6}
              items={PROCESS.map((s) => ({
                key: s.no,
                title: (
                  <>
                    <span className="m-th mr-3 font-[family-name:var(--font-geist-mono)] text-[13px] font-[400] text-[var(--muted)]">
                      {s.no}
                    </span>
                    {s.title}
                  </>
                ),
                body: s.body,
              }))}
            />
          </div>
        </div>

        {/* Path visual: four stops on one line, the active one lit */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#383b4b] text-[#ededf3] md:aspect-auto md:min-h-[580px]">
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[46%]"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 100%, rgba(190,214,224,0.75) 0%, rgba(150,178,196,0.35) 38%, rgba(56,59,75,0) 72%)",
            }}
          />
          <div className="absolute bottom-[14%] left-1/2 top-[14%] w-px -translate-x-1/2 bg-white/20">
            <div
              className="absolute inset-x-0 top-0 bg-white/80 transition-[height] duration-700 ease-[cubic-bezier(0.65,0.05,0.36,1)]"
              style={{ height: `${(active / (PROCESS.length - 1)) * 100}%` }}
            />
          </div>
          {PROCESS.map((s, i) => {
            const on = i === active;
            const top = 14 + (i / (PROCESS.length - 1)) * 72;
            const right = i % 2 === 0; // cards alternate sides of the line
            return (
              <div key={s.no}>
                <div
                  className="absolute left-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${top}%` }}
                >
                  {on && <span className="m-ping absolute inset-0 rounded-full bg-white" />}
                  <span
                    className="absolute inset-0 rounded-full transition-colors duration-500"
                    style={{ backgroundColor: i <= active ? "#ffffff" : "rgba(255,255,255,0.35)" }}
                  />
                </div>
                <div
                  className={`absolute flex ${right ? "justify-start" : "justify-end"}`}
                  style={{
                    top: `${top}%`,
                    left: right ? "calc(50% + 20px)" : "12px",
                    right: right ? "12px" : "calc(50% + 20px)",
                  }}
                  aria-hidden={!on}
                >
                  <div
                    className={`w-full max-w-[200px] rounded-xl bg-[#171721]/85 px-4 py-3 backdrop-blur-sm transition-[opacity,transform] duration-500 ease-[cubic-bezier(0,0,0.2,1)] ${
                      right ? "" : "text-right"
                    }`}
                    style={{
                      opacity: on ? 1 : 0,
                      transform: `translateY(-50%) translateX(${on ? 0 : right ? -8 : 8}px)`,
                    }}
                  >
                    <div className="text-[12px] text-[#c3c3cc]">After session {i + 1}</div>
                    <div className="mt-0.5 break-words text-[15px] leading-[1.3]">{OUTCOMES[i]}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */

export function Pricing() {
  const tracks = ["Web app", "iOS app"];
  const blurbs: Record<string, string> = {
    "Web app": "A web app with a real link your student can share with anyone.",
    "iOS app":
      "An iPhone app. iOS costs more because it adds Xcode, Apple's developer setup and the App Store / TestFlight process.",
  };

  return (
    <section id="pricing" data-section-theme="dark" className="scroll-mt-[72px] pb-20 pt-24 sm:pb-24 sm:pt-32">
      <div className="m-wrap">
        <h2 className="m-h2 mx-auto max-w-[620px] text-balance text-center">
          Simple pricing, one hour at a time.
        </h2>
        <p className="m-body m-th mx-auto mt-5 max-w-[520px] text-center" style={{ color: "var(--muted)" }}>
          One session alone rarely gets to a live app, so most students start
          with the four-session package.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {tracks.map((track) => {
            const rows = PRICING.filter((p) => p.track === track);
            const featured = rows.some((r) => r.featured);
            return (
              <div
                key={track}
                className="m-th flex flex-col rounded-xl p-7 sm:p-8"
                style={{ backgroundColor: "var(--tile)" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="m-h3">{track}</h3>
                  {featured && (
                    <span className="rounded-full bg-[var(--m-indigo)] px-3 py-1.5 text-[13px] font-[480] text-white">
                      Most students start here
                    </span>
                  )}
                </div>
                <p className="m-body m-th mt-2 max-w-[420px]" style={{ color: "var(--muted)" }}>
                  {blurbs[track]}
                </p>

                <dl className="mt-8">
                  {rows.map((r) => (
                    <div
                      key={r.label}
                      className="m-th flex items-baseline justify-between gap-4 border-t py-4"
                      style={{ borderColor: "var(--rule)" }}
                    >
                      <dt className="text-[16px] font-[440]">
                        {r.label}
                        {r.note && (
                          <span className="m-th block text-[14px] font-[380]" style={{ color: "var(--muted)" }}>
                            {r.note}
                          </span>
                        )}
                      </dt>
                      <dd className="text-[32px] font-[480] leading-none tracking-[-0.01em]">{r.price}</dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href="/contact"
                  className={`m-btn mt-6 self-start ${featured ? "m-btn-primary" : "m-btn-secondary"}`}
                >
                  Book a session
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */

export function About() {
  return (
    <section id="about" data-section-theme="dark" className="scroll-mt-[72px] py-24 sm:py-32">
      <div className="m-wrap">
        <div
          className="m-th grid gap-10 border-t pt-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-16"
          style={{ borderColor: "var(--rule)" }}
        >
          <div className="relative aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-xl bg-[var(--tile)]">
            <Image
              src={zacPhoto}
              alt="Zac Klein"
              placeholder="blur"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
          <div className="md:pt-2">
            <h2 className="m-h3" style={{ fontSize: "clamp(24px, 2.3vw, 33px)" }}>
              Hey, I&apos;m Zac.
            </h2>
            <div className="m-body m-th mt-5 max-w-[480px] space-y-4" style={{ color: "var(--muted)" }}>
              <p>
                I&apos;m a student at UVA from Chappaqua, and I build and ship
                apps with AI. Vantage Recruiting is live on the App Store with
                paying users, and Hoos Planner helps UVA students plan their
                schedules.
              </p>
              <p>
                I teach the exact tools I use every week, one-on-one, at your
                student&apos;s pace.
              </p>
            </div>
            {/* TODO: add a parent or student testimonial here once you have one. */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["UVA", "From Chappaqua", "Claude Code", "iOS + web"].map((t) => (
                <span
                  key={t}
                  className="m-th rounded-full px-4 py-2 text-[14px] font-[440]"
                  style={{ backgroundColor: "var(--pill)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="faq" data-section-theme="dark" className="scroll-mt-[72px] py-24 sm:py-32">
      <div className="m-wrap grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-16">
        <h2 className="m-h3" style={{ fontSize: "clamp(24px, 2.3vw, 33px)" }}>
          Questions parents ask.
        </h2>
        <div>
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className="m-th border-t" style={{ borderColor: "var(--rule)" }}>
                <h3>
                  <button
                    id={`${id}-q-${i}`}
                    type="button"
                    aria-expanded={on}
                    aria-controls={`${id}-a-${i}`}
                    onClick={() => setOpen(on ? null : i)}
                    className="m-focus group flex w-full items-center justify-between gap-6 rounded py-5 text-left"
                  >
                    <span className="m-body !font-[480]">{f.q}</span>
                    <span
                      aria-hidden
                      className={`relative h-3.5 w-3.5 shrink-0 opacity-70 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0,0,0.2,1)] group-hover:opacity-100 ${
                        on ? "rotate-45" : ""
                      }`}
                    >
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-a-${i}`}
                  role="region"
                  aria-labelledby={`${id}-q-${i}`}
                  inert={!on}
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0,0,0.2,1)]"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <p className="m-body m-th max-w-[520px] pb-6" style={{ color: "var(--muted)" }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="m-th border-t" style={{ borderColor: "var(--rule)" }} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Closing CTA ---------------- */

export function Closing() {
  return (
    <section id="contact" data-section-theme="dark" className="pb-16 pt-24 sm:pt-36">
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
