"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Footer } from "./footer";
import { Logo } from "./logo";

type Theme = "dark" | "warm" | "cool";

// Page canvas per theme, so overscroll and the scrollbar track match the section
const CANVAS: Record<Theme, string> = {
  dark: "#171721",
  warm: "#f6f5f2",
  cool: "#fbfcfd",
};

const LINKS = [
  ["Work", "#work"],
  ["Learn", "#learn"],
  ["Sessions", "#process"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
] as const;

/* Page wrapper: owns the section theme (dark / warm / cool) and the nav.
   Sections opt in with data-section-theme; the one crossing the middle of
   the viewport sets the theme for the whole page, nav included. */
export function SiteShell({
  children,
  home = false,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [atTop, setAtTop] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = CANVAS[theme];
  }, [theme]);
  useEffect(() => {
    // Theme changes animate only after the first paint has settled
    const t = window.setTimeout(() => setReady(true), 120);
    return () => {
      window.clearTimeout(t);
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setAtTop(window.scrollY < 8);
      const probe = window.innerHeight * 0.5;
      let next: Theme = "dark";
      const sections = el.querySelectorAll<HTMLElement>("[data-section-theme]");
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          next = s.dataset.sectionTheme as Theme;
          break;
        }
      }
      setTheme(next);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="m-site relative w-full"
      data-theme={theme}
      data-ready={ready ? "" : undefined}
    >
      <a
        href="#main"
        className="m-btn m-btn-primary fixed left-4 top-4 z-[60] -translate-y-24 opacity-0 focus:translate-y-0 focus:opacity-100"
      >
        Skip to content
      </a>
      <Nav home={home} clear={home && atTop} />
      {children}
      <Footer home={home} />
    </div>
  );
}

function Nav({ home, clear }: { home: boolean; clear: boolean }) {
  const [open, setOpen] = useState(false);
  const prefix = home ? "" : "/";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className="m-th fixed inset-x-0 top-0 z-50 border-b"
      style={{
        backgroundColor: clear && !open ? "transparent" : "var(--bg)",
        borderColor: clear && !open ? "transparent" : "var(--rule)",
        color: clear ? "#ededf3" : "var(--fg)",
        // The open menu needs a solid backdrop right away, not a half-second fade
        transition: open ? "none" : undefined,
      }}
    >
      <nav className="flex h-[72px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-8">
        <Link
          href={home ? "#top" : "/"}
          aria-label="Founder, home"
          className="m-focus shrink-0 rounded"
        >
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={`${prefix}${href}`}
              className="m-focus rounded-full px-4 py-2 text-[14px] font-[440] tracking-[0.005em] opacity-90 transition-opacity duration-300 hover:opacity-100"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="m-btn m-btn-primary !h-9 !px-4 !text-[14px] max-[359px]:!px-3 max-[359px]:!text-[13px] md:!h-8"
          >
            Book a session
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="m-focus -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-full md:hidden"
          >
            <span
              className={`h-[1.5px] w-5 bg-current transition-transform duration-300 ${
                open ? "translate-y-[3.75px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-5 bg-current transition-transform duration-300 ${
                open ? "-translate-y-[3.75px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="max-h-[calc(100svh-72px)] overflow-y-auto border-t px-4 pb-6 pt-2 md:hidden"
          style={{ borderColor: "var(--rule)" }}
        >
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={`${prefix}${href}`}
              onClick={() => setOpen(false)}
              className="block border-b py-4 text-[18px] font-[440]"
              style={{ borderColor: "var(--rule)" }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* Hairline rule + heading that opens a section */
export function SectionHead({
  title,
  sub,
  className = "",
}: {
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={`m-th border-t pt-10 ${className}`}
      style={{ borderColor: "var(--rule)" }}
    >
      <h2 className="m-h3 max-w-[600px] text-balance" style={{ fontSize: "clamp(24px, 2.3vw, 33px)" }}>
        {title}
      </h2>
      {sub && (
        <p className="m-body m-th mt-4 max-w-[560px]" style={{ color: "var(--muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* Vertical tab list: the active row opens to show its body and carries a
   progress rule that advances to the next row when `auto` is on. */
export function TabList({
  items,
  active,
  onSelect,
  auto = false,
  duration = 6,
}: {
  items: { key: string; title: React.ReactNode; body: React.ReactNode }[];
  active: number;
  onSelect: (i: number) => void;
  auto?: boolean;
  duration?: number;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  // Give every row's body the height of the tallest one, so switching rows
  // (by hand or on the timer) never moves anything around it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let lastWidth = -1;
    function fit(force = false) {
      if (!el) return;
      const w = el.clientWidth;
      if (!force && w === lastWidth) return;
      lastWidth = w;
      const bodies = el.querySelectorAll<HTMLElement>("[data-tab-inner]");
      let max = 0;
      bodies.forEach((b) => (b.style.minHeight = ""));
      bodies.forEach((b) => (max = Math.max(max, b.offsetHeight)));
      bodies.forEach((b) => (b.style.minHeight = max ? `${max}px` : ""));
    }
    fit(true);
    const ro = new ResizeObserver(() => fit());
    ro.observe(el);
    const onResize = () => fit(true);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => fit(true)).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [items.length]);

  return (
    <div ref={rootRef} className="m-tabs group/tabs">
      {items.map((item, i) => {
        const on = i === active;
        const panelId = `${id}-panel-${i}`;
        const btnId = `${id}-btn-${i}`;
        return (
          <div key={item.key} className="m-tab relative">
            <div
              className="m-tab-rule m-th absolute inset-x-0 top-0 h-px"
              style={{ backgroundColor: "var(--rule)" }}
            />
            {on && (
              <div
                key={`${item.key}-${auto}`}
                className="absolute inset-x-0 top-0 h-px origin-left group-hover/tabs:[animation-play-state:paused] group-focus-within/tabs:[animation-play-state:paused]"
                style={{
                  backgroundColor: "var(--rule-strong)",
                  animation: auto
                    ? `m-progress ${duration}s linear forwards`
                    : undefined,
                }}
                onAnimationEnd={() => onSelect((i + 1) % items.length)}
              />
            )}
            <button
              id={btnId}
              type="button"
              aria-expanded={on}
              aria-controls={panelId}
              onClick={() => onSelect(i)}
              className="m-tab-btn m-focus group/tab relative block w-full rounded pb-1 pt-[14px] text-left"
            >
              <span
                className={`m-tab-dot absolute -left-5 top-[22px] hidden h-[7px] w-[7px] rounded-full bg-current transition-opacity duration-300 xl:block ${
                  on ? "opacity-100" : "opacity-0"
                }`}
              />
              <span
                className={`m-ui block transition-colors duration-300 ${
                  on
                    ? "text-[var(--fg)]"
                    : "text-[var(--muted)] group-hover/tab:text-[var(--fg)]"
                }`}
              >
                {item.title}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!on}
              className="m-tab-body grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0,0,0.2,1)]"
              style={{
                gridTemplateRows: on ? "1fr" : "0fr",
                opacity: on ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div
                  data-tab-inner
                  className="m-th max-w-[440px] pb-3 text-[16px] leading-[1.4]"
                  style={{ color: "var(--muted)" }}
                >
                  {item.body}
                </div>
              </div>
            </div>
            <div className="m-tab-gap h-[10px]" />
          </div>
        );
      })}
    </div>
  );
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}
