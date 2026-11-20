"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PROCESS } from "@/app/content";
import { TabList, usePrefersReducedMotion } from "./shell";
import { StepArt } from "./step-art";

/* ---------------- How the five sessions go ---------------- */

export function Sessions() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  // The wireframes wait until the section has been on screen once
  const [seen, setSeen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Only auto-advance while the section is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="process"
      data-section-theme="cool"
      className="scroll-mt-[72px] pb-24 pt-24 sm:pb-28 sm:pt-28"
    >
      <div className="m-wrap grid gap-10 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col">
          <h2 className="m-h3 max-w-[440px] text-balance" style={{ fontSize: "clamp(24px, 2.3vw, 33px)" }}>
            From idea to a real business in five steps.
          </h2>
          <p className="m-body m-th mt-4 max-w-[440px]" style={{ color: "var(--muted)" }}>
            A bundle of five gives each step its own one-on-one session. The
            last one ends with your student showcasing a live business.
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
                    <span className="m-th mr-3 font-[400] tabular-nums text-[var(--muted)]">
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

        {/* Path visual: one stop per step on a single line, the active one lit */}
        <div className="sa-panel relative h-[420px] w-full overflow-hidden rounded-xl bg-[#383b4b] text-[#ededf3] md:h-auto md:min-h-[580px]">
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
            // The first and last cards lean inward so they stay inside the panel
            const lift = i === 0 ? -28 : i === PROCESS.length - 1 ? -72 : -50;
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
                    className={`w-full max-w-[200px] rounded-xl bg-[#171721]/90 px-3 py-3 sm:px-4 ${
                      right ? "" : "text-right"
                    }`}
                    style={{
                      opacity: on ? 1 : 0,
                      transform: `translateY(${lift}%) translateX(${on || reduced ? 0 : right ? -8 : 8}px)`,
                      // The outgoing card clears fast and the incoming one waits for it,
                      // so a card never shows through the next step's wireframe.
                      transition: on
                        ? "opacity 500ms cubic-bezier(0,0,0.2,1) 150ms, transform 500ms cubic-bezier(0,0,0.2,1) 150ms"
                        : "opacity 150ms cubic-bezier(0,0,0.2,1), transform 500ms cubic-bezier(0,0,0.2,1)",
                    }}
                  >
                    <div className="text-[12px] text-[#c3c3cc]">After step {i + 1}</div>
                    <div className="mt-0.5 break-words text-[14px] leading-[1.3] min-[400px]:text-[15px]">{s.outcome}</div>
                  </div>
                </div>
                {/* The step's wireframe, across the line from its card, level with its dot */}
                <div
                  aria-hidden
                  className="sa-slot"
                  data-side={right ? "left" : "right"}
                  data-on={on && seen}
                  style={{ "--sa-top": `${top}%` } as CSSProperties}
                >
                  <StepArt step={i} play={on && seen} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
