"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Theme = "dark" | "warm" | "cool";

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
    <div ref={ref} className="m-site relative w-full" data-theme={theme}>
      <Nav home={home} clear={home && atTop} />
      {children}
      <Footer home={home} />
    </div>
  );
}

function Nav({ home, clear }: { home: boolean; clear: boolean }) {
  const [open, setOpen] = useState(false);
  const prefix = home ? "" : "/";

  return (
    <header
      className="m-th fixed inset-x-0 top-0 z-50 border-b"
      style={{
        backgroundColor: clear && !open ? "transparent" : "var(--bg)",
        borderColor: clear && !open ? "transparent" : "var(--rule)",
        color: clear ? "#ededf3" : "var(--fg)",
      }}
    >
      <nav className="flex h-[72px] items-center justify-between gap-6 px-4 sm:px-8">
        <Link
          href={home ? "#top" : "/"}
          className="m-focus rounded text-[15px] font-[520] tracking-[0.2em]"
        >
          ZAC KLEIN
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
          <a
            href={`${prefix}#pricing`}
            className={`m-btn m-btn-secondary !hidden !h-8 !px-4 !text-[14px] transition-opacity duration-300 md:!inline-flex ${
              clear ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            tabIndex={clear ? -1 : 0}
          >
            See pricing
          </a>
          <Link
            href="/contact"
            className="m-btn m-btn-primary !h-8 !px-4 !text-[14px]"
          >
            Book a session
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="m-focus -mr-1 flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-full md:hidden"
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
        <div className="border-t px-4 pb-6 pt-2 md:hidden" style={{ borderColor: "var(--rule)" }}>
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

function Footer({ home }: { home: boolean }) {
  const prefix = home ? "" : "/";
  const cols: { title: string; links: [string, string][] }[] = [
    {
      title: "Tutoring",
      links: [
        ["What they'll learn", `${prefix}#learn`],
        ["How sessions go", `${prefix}#process`],
        ["Pricing", `${prefix}#pricing`],
        ["FAQ", `${prefix}#faq`],
      ],
    },
    {
      title: "Zac",
      links: [
        ["What I've built", `${prefix}#work`],
        ["About", `${prefix}#about`],
        ["GitHub", "https://github.com/Zrk1212"],
        ["Data tools on Apify", "/apify"],
      ],
    },
    {
      title: "Contact",
      links: [
        ["Book a session", "/contact"],
        ["zacklein555@gmail.com", "mailto:zacklein555@gmail.com"],
      ],
    },
  ];

  return (
    <footer data-section-theme="dark" className="pb-12 pt-20">
      <div className="m-wrap">
        <div
          className="m-th grid gap-12 border-t pt-12 sm:grid-cols-[1.2fr_1fr_1fr_1fr]"
          style={{ borderColor: "var(--rule)" }}
        >
          <div>
            <div className="text-[15px] font-[520] tracking-[0.2em]">ZAC KLEIN</div>
            <p className="m-th mt-4 max-w-[240px] text-[14px] leading-[1.45]" style={{ color: "var(--muted)" }}>
              One-on-one sessions where high schoolers build and launch a real
              app with AI.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="m-th text-[14px] font-[440]" style={{ color: "var(--muted)" }}>
                {c.title}
              </div>
              <ul className="mt-4 space-y-3">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="m-focus rounded text-[16px] font-[420] underline-offset-4 hover:underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="m-th mt-16 text-[13px]" style={{ color: "var(--muted)" }}>
          Designed and built by Zac Klein.
        </p>
      </div>
    </footer>
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
  return (
    <div role="tablist" aria-orientation="vertical" className="group/tabs">
      {items.map((item, i) => {
        const on = i === active;
        return (
          <div key={item.key} className="relative">
            <div
              className="m-th absolute inset-x-0 top-0 h-px"
              style={{ backgroundColor: "var(--rule)" }}
            />
            {on && (
              <div
                key={`${item.key}-${auto}`}
                className="absolute inset-x-0 top-0 h-px origin-left group-hover/tabs:[animation-play-state:paused]"
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
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onSelect(i)}
              className="m-focus relative block w-full rounded pb-1 pt-[14px] text-left"
            >
              <span
                className={`absolute -left-5 top-[22px] hidden h-[7px] w-[7px] rounded-full bg-current transition-opacity duration-300 xl:block ${
                  on ? "opacity-100" : "opacity-0"
                }`}
              />
              <span
                className="m-ui m-th block transition-colors duration-300"
                style={{ color: on ? "var(--fg)" : "var(--muted)" }}
              >
                {item.title}
              </span>
            </button>
            <div
              role="tabpanel"
              className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0,0,0.2,1)]"
              style={{
                gridTemplateRows: on ? "1fr" : "0fr",
                opacity: on ? 1 : 0,
              }}
              aria-hidden={!on}
            >
              <div className="overflow-hidden">
                <div
                  className="m-th max-w-[440px] pb-3 text-[16px] leading-[1.4]"
                  style={{ color: "var(--muted)" }}
                >
                  {item.body}
                </div>
              </div>
            </div>
            <div className="h-[10px]" />
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
