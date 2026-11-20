"use client";

import { useId, useState } from "react";
import { FAQ } from "@/app/content";

/* ---------------- FAQ ---------------- */

export function Faq() {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());
  const id = useId();

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section id="faq" data-section-theme="dark" className="scroll-mt-[72px] py-20 sm:py-24">
      <div className="m-wrap">
        <h2 className="text-[30px] font-[480] leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
          Frequently asked questions
        </h2>
        <div className="mt-10">
          {FAQ.map((f, i) => {
            const on = open.has(i);
            return (
              <div
                key={f.q}
                className={`m-th ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "var(--rule)" }}
              >
                <h3>
                  <button
                    id={`${id}-q-${i}`}
                    type="button"
                    aria-expanded={on}
                    aria-controls={`${id}-a-${i}`}
                    onClick={() => toggle(i)}
                    className="m-focus group flex w-full items-center justify-between gap-6 rounded py-6 text-left sm:py-7"
                  >
                    <span className="text-[18.4px] font-[480] leading-[1.2] tracking-[-0.02em] transition-colors duration-150 group-hover:text-[#8f9cf5] motion-reduce:transition-none sm:text-[25.6px]">
                      {f.q}
                    </span>
                    <svg
                      aria-hidden
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`m-th h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                        on ? "rotate-180" : ""
                      }`}
                      style={{ color: "var(--muted)" }}
                    >
                      <path d="M5 7.5l5 5 5-5" />
                    </svg>
                  </button>
                </h3>
                <div
                  id={`${id}-a-${i}`}
                  role="region"
                  aria-labelledby={`${id}-q-${i}`}
                  inert={!on}
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0,0,0.2,1)] motion-reduce:transition-none"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="m-th max-w-[768px] pb-7 pr-10 text-[15px] leading-[1.6] sm:text-[17px]"
                      style={{ color: "var(--muted)" }}
                    >
                      {f.a}
                    </p>
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
