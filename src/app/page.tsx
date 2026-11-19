"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ----------------------------------------------------------------
   Content — edit these arrays to update the site
----------------------------------------------------------------- */

const SKILLS = [
  {
    title: "A written plan",
    body: "Turning their idea into a clear plan an AI can build from.",
  },
  {
    title: "Building with Claude Code",
    body: "An AI assistant that writes code while your student directs it and makes the decisions.",
  },
  {
    title: "Putting it online",
    body: "Publishing the app on Vercel so it has a real link anyone can open.",
  },
  {
    title: "An AI feature",
    body: "Adding something smart inside their app, like a chat helper or a feature that writes or sorts for the user.",
  },
  {
    title: "Automations",
    body: "Having AI handle a repetitive task for them, like a weekly summary or sorting messages.",
  },
  {
    title: "Skills",
    body: "Saving instructions the AI can reuse, so it does a task the same way every time.",
  },
  {
    title: "MCP servers",
    body: "Letting the AI connect to tools like Gmail, Calendar and databases so it can act on real information.",
  },
  {
    title: "Personal feedback",
    body: "Every session I look at what they built and tell them what to do better next.",
  },
];

type Project = {
  title: string;
  blurb: string;
  tags: string[];
  year: string;
  hue: string; // ambient glow pair for the browser frame
  hue2: string;
  href: string; // live app URL
  url: string; // domain shown in the browser-frame chrome
  image: string; // screenshot in /public/work
};

const PROJECTS: Project[] = [
  {
    title: "Vantage Recruiting",
    blurb:
      "An AI recruiting app for high school lacrosse players, live on the App Store and the web with paying users. It writes personalized emails to college coaches, tracks who opened them, and keeps the whole recruiting timeline in one place.",
    tags: ["iOS app", "Web app", "Claude AI"],
    year: "2026",
    hue: "#c7f25b",
    hue2: "#2dd4bf",
    href: "https://vantage-recruiting.com",
    url: "vantage-recruiting.com",
    image: "/work/vantage.png",
  },
  {
    title: "Hoos Planner",
    blurb:
      "An AI schedule advisor for UVA undergrads. Describe your semester and it builds a conflict-free week from real class data, tracks every requirement for your school and major, and plugs straight into Claude and ChatGPT.",
    tags: ["Next.js", "AI", "Supabase"],
    year: "2026",
    hue: "#3b6cf6",
    hue2: "#e57200",
    href: "https://hoosplanner.zrk.ventures",
    url: "hoosplanner.zrk.ventures",
    image: "/work/hoos-planner.png",
  },
  {
    title: "Scent Smart",
    blurb:
      "Matches premium colognes to affordable dupes that smell nearly identical, and breaks down what each fragrance note does. A fast, focused fragrance finder.",
    tags: ["Web app", "Fragrance", "UX"],
    year: "2025",
    hue: "#7c5cff",
    hue2: "#2dd4bf",
    href: "https://scent-smart.vercel.app",
    url: "scent-smart.vercel.app",
    image: "/work/scent-smart.png",
  },
  {
    title: "Joelle Klein Essay Coaching",
    blurb:
      "A marketing site for a college essay coach who takes high school seniors from first idea to final draft. Clear packages, an honest walkthrough of the process, and a free intro call, built to make a nervous decision feel simple.",
    tags: ["Next.js", "Tailwind", "Coaching"],
    year: "2026",
    hue: "#e07a5f",
    hue2: "#c0405f",
    href: "https://joelleklein.com",
    url: "joelleklein.com",
    image: "/work/joelle.png",
  },
  {
    title: "Dr. Rob Chiropractic",
    blurb:
      "A polished marketing site for a chiropractic and sports-medicine practice. Credentials, services, treatment tech, and booking, built to turn visitors into patients.",
    tags: ["React", "Vite", "Local business"],
    year: "2026",
    hue: "#ffb44d",
    hue2: "#7c5cff",
    href: "https://dr-rob.vercel.app",
    url: "dr-rob.vercel.app",
    image: "/work/dr-rob.png",
  },
];

const PROCESS = [
  {
    no: "01",
    title: "Idea and plan",
    body: "They pick an idea they care about, and we turn it into a written plan.",
  },
  {
    no: "02",
    title: "Build",
    body: "They build the core of the app with Claude Code, one working piece at a time.",
  },
  {
    no: "03",
    title: "AI feature and tools",
    body: "They add an AI feature and set up an automation, a skill or an MCP connection.",
  },
  {
    no: "04",
    title: "Launch and demo",
    body: "The app goes live with a real link, or onto their iPhone through TestFlight. The session ends with your student showing it to you.",
  },
];

type Price = {
  track: string;
  label: string;
  price: string;
  note?: string;
  featured?: boolean;
};

const PRICING: Price[] = [
  {
    track: "Web app",
    label: "4-session package",
    price: "$500",
    note: "$125 per session",
    featured: true,
  },
  { track: "Web app", label: "Single session (1 hr)", price: "$150" },
  {
    track: "iOS app",
    label: "4-session package",
    price: "$1,000",
    note: "$250 per session",
  },
  { track: "iOS app", label: "Single session (1 hr)", price: "$300" },
];

const FAQ = [
  {
    q: "Does my kid need coding experience?",
    a: "No. We start from their idea, and I teach what they need as we go.",
  },
  {
    q: "What do they need?",
    a: "A laptop. For an iOS app it has to be a Mac, because Apple's tools only run on Macs.",
  },
  {
    q: "Do they need AI accounts?",
    a: "Most AI tools have age limits. Claude requires users to be 18 or older, and ChatGPT allows ages 13 to 17 only with a parent's permission. So the accounts are set up in a parent's name, and we do that together in the first session.",
  },
  {
    q: "Is this cheating?",
    a: "No. Your student makes the plan, makes the decisions and can explain every part of what they built. It's also a real project they can talk about.",
  },
  {
    q: "In person or Zoom?",
    a: "Both. In person in Chappaqua and around Westchester when I'm home, and over Zoom year-round.",
  },
];

/* ----------------------------------------------------------------
   Motion helpers
----------------------------------------------------------------- */

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/* ----------------------------------------------------------------
   Page
----------------------------------------------------------------- */

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative z-[2] w-full">
      <Nav />

      {/* ---------------- Hero ---------------- */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-32 pb-24 sm:px-10"
      >
        {/* Aurora field */}
        <motion.div
          style={{ y: auroraY }}
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
        >
          <div className="animate-drift absolute -top-40 -left-20 h-[42rem] w-[42rem] rounded-full bg-[var(--color-violet)] opacity-[0.22] blur-[120px]" />
          <div className="animate-drift-slow absolute top-10 right-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[var(--color-lime)] opacity-[0.16] blur-[130px]" />
          <div className="animate-drift absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-[var(--color-teal)] opacity-[0.14] blur-[140px]" />
        </motion.div>
        <ReactiveGrid />

        <motion.div
          style={{ opacity: heroFade }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        >
          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={0}
            className="mx-auto whitespace-normal sm:whitespace-nowrap font-[family-name:var(--font-display)] text-[clamp(1.6rem,6.6vw,5.5rem)] font-semibold leading-[1.05] tracking-tight text-[var(--color-bone)]"
          >
            Your <span className="text-gradient italic">idea</span> is the limit.
          </motion.h1>

          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={1}
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[var(--color-mist)] sm:text-xl"
          >
            One-on-one sessions where your student builds and launches a real
            web or iOS app, and learns AI skills like automations and MCP
            servers along the way.
          </motion.p>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-10 flex justify-center"
          >
            <a
              id="hero-cta"
              href="/contact"
              className="shine inline-flex h-[3.25rem] items-center justify-center rounded-full bg-[var(--color-lime)] px-8 text-base font-semibold text-[#0a0a0a] transition-transform duration-300 hover:scale-[1.03]"
            >
              Book a session
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-[var(--color-faint)]"
        >
          Scroll
        </motion.div>
      </section>

      {/* ---------------- Skills marquee ---------------- */}
      <section className="relative border-y border-[var(--color-hair)] py-6">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {[...SKILLS, ...SKILLS].map((s, i) => (
              <span
                key={i}
                className="flex items-center gap-10 whitespace-nowrap text-lg font-medium text-[var(--color-faint)]"
              >
                {s.title}
                <span className="text-[var(--color-lime)]">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- What they'll learn ---------------- */}
      <section id="learn" className="relative px-6 py-28 sm:px-10 sm:py-36">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            kicker="What they'll learn"
            title="Skills they keep after the app ships."
            sub="Your student brings the idea and leaves with a live app. Along the way they learn how to work with AI in ways that carry over to anything they build next."
          />
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map((s, i) => (
              <motion.div
                key={s.title}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                custom={i % 4}
                className="glass rounded-[var(--radius-glass)] p-7"
              >
                <span className="text-[var(--color-lime)]">&bull;</span>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-medium text-[var(--color-bone)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--color-mist)]">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Process ---------------- */}
      <section id="process" className="relative px-6 py-28 sm:px-10 sm:py-36">
        <div className="dotgrid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            kicker="Four sessions"
            title="From idea to a live app in four hours."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.no}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                custom={i}
                className="glass rounded-[var(--radius-glass)] p-7"
              >
                <div className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-lime)]">
                  {step.no}
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--color-bone)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--color-mist)]">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Proof: what I've built ---------------- */}
      <section id="work" className="relative px-6 py-28 sm:px-10 sm:py-36">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            kicker="What I've built"
            title="I build with these tools every day."
            sub="Everything here was built with the same tools your student will use."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:mx-auto sm:[&>*:last-child:nth-child(odd)]:w-[calc(50%-0.75rem)]">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Pricing ---------------- */}
      <section id="pricing" className="relative px-6 py-28 sm:px-10 sm:py-36">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            kicker="Pricing"
            title="Simple pricing, one hour at a time."
            sub="One session alone rarely gets to a live app, so most students start with the four-session package."
          />
          <div className="mt-16 grid gap-5 sm:grid-cols-2">
            {PRICING.map((p, i) => (
              <PriceCard key={`${p.track}-${p.label}`} price={p} index={i} />
            ))}
          </div>
          <motion.p
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-8 max-w-2xl text-[15px] leading-7 text-[var(--color-mist)]"
          >
            iOS costs more because it adds Xcode, Apple&apos;s developer setup
            and the App Store / TestFlight process.
          </motion.p>
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <section id="about" className="relative px-6 py-28 sm:px-10 sm:py-36">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <AboutPhoto />

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
          >
            <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.2em] text-[var(--color-lime)]">
              About
            </p>
            <h2 className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.05] tracking-tight text-[var(--color-bone)]">
              Hey, I&apos;m Zac.
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-[var(--color-mist)]">
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
            <div className="mt-9 flex flex-wrap gap-3">
              {["UVA", "From Chappaqua", "Claude Code", "iOS + web"].map((t) => (
                <span
                  key={t}
                  className="glass rounded-full px-4 py-2 text-sm text-[var(--color-bone)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="relative px-6 py-28 sm:px-10 sm:py-36">
        <div className="mx-auto max-w-3xl">
          <SectionHeading kicker="FAQ" title="Questions parents ask." />
          <div className="mt-14 space-y-4">
            {FAQ.map((f, i) => (
              <motion.details
                key={f.q}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i % 3}
                className="glass group rounded-[var(--radius-glass)] px-6 py-5 sm:px-7"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-[family-name:var(--font-display)] text-xl font-medium text-[var(--color-bone)] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="shrink-0 text-2xl leading-none text-[var(--color-lime)] transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-[15px] leading-7 text-[var(--color-mist)]">
                  {f.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact" className="relative px-6 py-28 sm:px-10 sm:py-36">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="glass-strong relative mx-auto max-w-5xl overflow-hidden rounded-[32px] px-7 py-20 text-center sm:px-16"
        >
          <div className="animate-drift-slow pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--color-violet)] opacity-30 blur-[120px]" />
          <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.2em] text-[var(--color-lime)]">
            Let&apos;s build
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[1] tracking-tight text-[var(--color-bone)]">
            Have a student with an idea? Let&apos;s make it real.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[var(--color-mist)]">
            Tell me a little about your student and I&apos;ll get back to you
            within a day.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="shine inline-flex h-[3.25rem] items-center justify-center rounded-full bg-[var(--color-lime)] px-8 text-base font-semibold text-[#0a0a0a] transition-transform duration-300 hover:scale-[1.03]"
            >
              Book a session
            </a>
            <a
              href="#pricing"
              className="glass inline-flex h-[3.25rem] items-center justify-center rounded-full px-8 text-base font-medium text-[var(--color-bone)] transition-colors hover:border-[var(--color-hair-strong)]"
            >
              See pricing
            </a>
          </div>
        </motion.div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="relative border-t border-[var(--color-hair)] px-6 py-12 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-bone)]">
            Zac Klein
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/apify"
              className="text-sm text-[var(--color-mist)] transition-colors hover:text-[var(--color-bone)]"
            >
              Data tools on Apify
            </a>
            <p className="text-sm text-[var(--color-faint)]">
              Designed and built by Zac Klein.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ----------------------------------------------------------------
   Components
----------------------------------------------------------------- */

/* Magnetic dot grid that molds around the cursor */
function ReactiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxMaybe = canvasEl.getContext("2d");
    if (!ctxMaybe) return;
    // Non-null aliases so the nested draw/resize closures type-check cleanly
    // (TS doesn't carry the guard narrowing into hoisted function declarations).
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const GAP = 34; // grid spacing
    const RADIUS = 150; // cursor influence radius
    const PUSH = 26; // max displacement away from cursor
    const DOT = 1.4; // base dot radius

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let offsetY = 0;

    // Pointer target (in CSS px, relative to canvas). Off-screen at rest.
    const pointer = { x: -9999, y: -9999 };
    // Eased pointer for smooth settle
    const eased = { x: -9999, y: -9999 };

    // Exclusion zone (the CTA button), in canvas-local CSS px. Dots here stay at rest.
    const PAD = 18;
    let safe: { x1: number; y1: number; x2: number; y2: number } | null = null;

    function measureSafeZone() {
      const cta = document.getElementById("hero-cta");
      if (!cta) {
        safe = null;
        return;
      }
      const cr = canvas.getBoundingClientRect();
      const br = cta.getBoundingClientRect();
      safe = {
        x1: br.left - cr.left - PAD,
        y1: br.top - cr.top - PAD,
        x2: br.right - cr.left + PAD,
        y2: br.bottom - cr.top + PAD,
      };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(rect.width / GAP) + 1;
      rows = Math.ceil(rect.height / GAP) + 1;
      // Center the grid within the canvas
      offsetX = (rect.width - (cols - 1) * GAP) / 2;
      offsetY = (rect.height - (rows - 1) * GAP) / 2;
      measureSafeZone();
    }

    function draw() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Ease the pointer toward its target for a soft settle
      if (pointer.x < -9000) {
        // Mouse left: drift influence point away so dots relax
        eased.x += (pointer.x - eased.x) * 0.12;
        eased.y += (pointer.y - eased.y) * 0.12;
      } else {
        eased.x += (pointer.x - eased.x) * 0.18;
        eased.y += (pointer.y - eased.y) * 0.18;
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const gx = offsetX + i * GAP;
          const gy = offsetY + j * GAP;

          let x = gx;
          let y = gy;
          let glow = 0;

          // Leave the CTA button untouched: dots inside its padded rect stay at rest.
          const inSafe =
            safe !== null &&
            gx >= safe.x1 &&
            gx <= safe.x2 &&
            gy >= safe.y1 &&
            gy <= safe.y2;

          const dx = gx - eased.x;
          const dy = gy - eased.y;
          const dist = Math.hypot(dx, dy);

          if (!inSafe && dist < RADIUS) {
            const f = 1 - dist / RADIUS; // 1 at center, 0 at edge
            const falloff = f * f;
            const ang = Math.atan2(dy, dx);
            // Push outward from the cursor to "mold" a bubble
            x += Math.cos(ang) * PUSH * falloff;
            y += Math.sin(ang) * PUSH * falloff;
            glow = falloff;
          }

          const r = DOT + glow * 1.7;
          if (glow > 0.01) {
            // lime tint near the cursor
            ctx.fillStyle = `rgba(199, 242, 91, ${0.18 + glow * 0.7})`;
          } else {
            ctx.fillStyle = "rgba(244, 243, 238, 0.10)";
          }
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    let raf = 0;
    let frame = 0;
    function loop() {
      // Re-measure the button zone periodically so it tracks the entrance
      // animation settling and any layout shifts, without thrashing every frame.
      if (frame % 20 === 0) measureSafeZone();
      frame++;
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }
    function onLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    resize();

    if (reduced) {
      draw(); // single static frame
      window.addEventListener("resize", () => {
        resize();
        draw();
      });
      return () => window.removeEventListener("resize", resize);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", resize);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
    />
  );
}

function Nav() {
  const links = [
    ["Learn", "#learn"],
    ["Sessions", "#process"],
    ["Pricing", "#pricing"],
    ["FAQ", "#faq"],
  ];
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6"
    >
      <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5">
        <a
          href="#"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-bone)]"
        >
          Zac Klein
        </a>
        <div className="hidden items-center gap-8 sm:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[var(--color-mist)] transition-colors hover:text-[var(--color-bone)]"
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="/contact"
          className="rounded-full bg-[var(--color-bone)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-transform duration-300 hover:scale-[1.04]"
        >
          Book a session
        </a>
      </nav>
    </motion.header>
  );
}

function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.2em] text-[var(--color-lime)]">
        {kicker}
      </p>
      <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.6rem)] font-medium leading-[1.04] tracking-tight text-[var(--color-bone)]">
        {title}
      </h2>
      {sub && (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-mist)]">
          {sub}
        </p>
      )}
    </motion.div>
  );
}

function PriceCard({ price, index }: { price: Price; index: number }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index % 2}
      className={`relative flex flex-col overflow-hidden rounded-[var(--radius-glass)] p-7 sm:p-8 ${
        price.featured ? "glass-strong" : "glass"
      }`}
      // .glass-strong sets its own border, so the lime edge goes inline
      style={price.featured ? { borderColor: "rgba(199, 242, 91, 0.55)" } : undefined}
    >
      {price.featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(70% 60% at 12% 0%, #c7f25b22, transparent 60%), radial-gradient(70% 60% at 92% 100%, #2dd4bf22, transparent 55%)",
          }}
        />
      )}
      <div className="relative flex flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.2em] text-[var(--color-lime)]">
            {price.track}
          </p>
          {price.featured && (
            <span className="rounded-full bg-[var(--color-lime)] px-3 py-1 text-xs font-semibold text-[#0a0a0a]">
              Most students start here
            </span>
          )}
        </div>
        <h3 className="mt-5 text-lg font-medium text-[var(--color-bone)]">
          {price.label}
        </h3>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-[var(--color-bone)]">
            {price.price}
          </span>
          {price.note && (
            <span className="text-sm text-[var(--color-faint)]">{price.note}</span>
          )}
        </div>
        <a
          href="/contact"
          className={`mt-8 inline-flex h-11 items-center justify-center self-start rounded-full px-6 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] ${
            price.featured
              ? "shine bg-[var(--color-lime)] text-[#0a0a0a]"
              : "glass text-[var(--color-bone)]"
          }`}
        >
          Book
        </a>
      </div>
    </motion.div>
  );
}

function AboutPhoto() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="glass-strong relative mx-auto w-full max-w-sm overflow-hidden rounded-[var(--radius-glass)] p-3 lg:mx-0"
    >
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--color-lime)] opacity-20 blur-3xl" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-[var(--color-panel)]">
        {!loaded && !failed && <div className="skeleton absolute inset-0" />}
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
            <span className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-faint)]">
              ZK
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-faint)]">
              Photo coming soon
            </span>
          </div>
        ) : (
          <Image
            src="/about/zac.jpg"
            alt="Zac Klein"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`object-cover transition-all duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index % 2}
      className="group glass relative flex flex-col overflow-hidden rounded-[var(--radius-glass)] transition-colors duration-300 hover:border-[var(--color-hair-strong)]"
    >
      {/* Browser-window preview */}
      <div className="relative p-3">
        {/* ambient glow from the project hues */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(70% 60% at 12% 0%, ${project.hue}22, transparent 60%), radial-gradient(70% 60% at 92% 100%, ${project.hue2}22, transparent 55%)`,
          }}
        />
        <div className="relative overflow-hidden rounded-xl border border-[var(--color-hair)] bg-[var(--color-ink-soft)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.75)]">
          {/* top chrome */}
          <div className="flex items-center gap-3 border-b border-[var(--color-hair)] bg-white/[0.03] px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            </div>
            <div className="mx-auto flex max-w-[72%] items-center gap-1.5 truncate rounded-md bg-black/30 px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-faint)]">
              <span className="text-[var(--color-lime)]">&#9650;</span>
              {project.url}
            </div>
          </div>
          {/* screenshot */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-panel)]">
            {!loaded && <div className="skeleton absolute inset-0" />}
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              className={`object-cover object-top transition-all duration-700 group-hover:scale-[1.04] ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-mist)] backdrop-blur">
              {project.year}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-7 pb-7 pt-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--color-bone)]">
            {project.title}
          </h3>
          <span className="mt-1 text-lg text-[var(--color-faint)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-lime)]">
            &#8599;
          </span>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-[var(--color-mist)]">
          {project.blurb}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--color-hair)] px-3 py-1 text-xs text-[var(--color-faint)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
