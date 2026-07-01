"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

/* ----------------------------------------------------------------
   Web3Forms — set your access key here (or in NEXT_PUBLIC_WEB3FORMS_KEY).
   Get a free key at https://web3forms.com using zacklein555@gmail.com.
   Submissions are emailed straight to you. No backend required.
----------------------------------------------------------------- */
const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "YOUR_WEB3FORMS_ACCESS_KEY";

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot — silently succeed if a bot fills the hidden field
    if (data.botcheck) {
      setStatus("success");
      form.reset();
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New project inquiry from ${data.name || "your site"}`,
          from_name: "Zac Klein Portfolio",
          name: data.name,
          email: data.email,
          company: data.company,
          message: data.message,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setError(json.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="relative z-[2] w-full">
      {/* ---------------- Nav ---------------- */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6"
      >
        <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-bone)]"
          >
            Zac Klein
          </Link>
          <div className="hidden items-center gap-8 sm:flex">
            <Link
              href="/#work"
              className="text-sm text-[var(--color-mist)] transition-colors hover:text-[var(--color-bone)]"
            >
              Work
            </Link>
            <Link
              href="/#process"
              className="text-sm text-[var(--color-mist)] transition-colors hover:text-[var(--color-bone)]"
            >
              Process
            </Link>
            <Link
              href="/#about"
              className="text-sm text-[var(--color-mist)] transition-colors hover:text-[var(--color-bone)]"
            >
              About
            </Link>
          </div>
          <Link
            href="/"
            className="rounded-full bg-[var(--color-bone)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-transform duration-300 hover:scale-[1.04]"
          >
            Back home
          </Link>
        </nav>
      </motion.header>

      {/* ---------------- Contact ---------------- */}
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
        <div className="dotgrid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

        <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          {/* Left: pitch */}
          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={0}
          >
            <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.2em] text-[var(--color-lime)]">
              Get in touch
            </p>
            <h1 className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-tight text-[var(--color-bone)]">
              Tell me about your <span className="text-gradient italic">project</span>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[var(--color-mist)]">
              Share a few details and I&apos;ll get back to you within a day with
              thoughts on how to approach it. No pressure, no sales fluff.
            </p>
            <div className="mt-9 space-y-4">
              <a
                href="mailto:zacklein555@gmail.com"
                className="group flex items-center gap-3 text-[var(--color-bone)]"
              >
                <span className="glass flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-lime)]">
                  &#9993;
                </span>
                <span className="text-[15px] text-[var(--color-mist)] transition-colors group-hover:text-[var(--color-bone)]">
                  zacklein555@gmail.com
                </span>
              </a>
              <a
                href="https://github.com/Zrk1212"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-[var(--color-bone)]"
              >
                <span className="glass flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-lime)] font-[family-name:var(--font-mono)]">
                  &lt;/&gt;
                </span>
                <span className="text-[15px] text-[var(--color-mist)] transition-colors group-hover:text-[var(--color-bone)]">
                  github.com/Zrk1212
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right: form card */}
          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={1}
            className="glass-strong relative overflow-hidden rounded-[var(--radius-glass)] p-7 sm:p-10"
          >
            <div className="animate-drift-slow pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--color-lime)] opacity-20 blur-[100px]" />

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex min-h-[22rem] flex-col items-center justify-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-lime)] text-2xl text-[#0a0a0a]">
                  &#10003;
                </div>
                <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-bone)]">
                  Message sent.
                </h2>
                <p className="mt-3 max-w-sm text-[15px] leading-7 text-[var(--color-mist)]">
                  Thanks for reaching out. I&apos;ll get back to you within a day,
                  usually sooner.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="glass mt-8 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-[var(--color-bone)] transition-colors hover:border-[var(--color-hair-strong)]"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="relative space-y-5">
                {/* Honeypot */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <Field label="Name">
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClass}
                  />
                </Field>

                <Field label="Email">
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </Field>

                <Field label="Company / Project" optional>
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Optional"
                    className={inputClass}
                  />
                </Field>

                <Field label="What do you have in mind?">
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="A few sentences about your goals, timeline, and budget if you have one."
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                {status === "error" && (
                  <p className="text-sm text-[var(--color-amber)]">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="shine inline-flex h-[3.25rem] w-full items-center justify-center rounded-full bg-[var(--color-lime)] px-8 text-base font-semibold text-[#0a0a0a] transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>

                <p className="text-center text-xs text-[var(--color-faint)]">
                  Goes straight to my inbox. I never share your details.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="relative border-t border-[var(--color-hair)] px-6 py-12 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-bone)]"
          >
            Zac Klein
          </Link>
          <p className="text-sm text-[var(--color-faint)]">
            Designed and built by Zac Klein.
          </p>
        </div>
      </footer>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-[var(--color-hair)] bg-white/[0.03] px-4 py-3 text-[15px] text-[var(--color-bone)] placeholder:text-[var(--color-faint)] transition-colors outline-none focus:border-[var(--color-lime)] focus:bg-white/[0.05]";

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-mist)]">
        {label}
        {optional && (
          <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-faint)]">
            optional
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
