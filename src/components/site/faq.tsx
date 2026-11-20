"use client";

import { useId, useState } from "react";
import { FAQ } from "@/app/content";

/* ---------------- FAQ ---------------- */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="faq" data-section-theme="dark" className="scroll-mt-[72px] py-20 sm:py-24">
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
