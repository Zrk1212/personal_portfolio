"use client";

import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/site/shell";

/* ----------------------------------------------------------------
   Web3Forms — set your access key here (or in NEXT_PUBLIC_WEB3FORMS_KEY).
   Get a free key at https://web3forms.com using zacklein555@gmail.com.
   Submissions are emailed straight to you. No backend required.
----------------------------------------------------------------- */
const ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "YOUR_WEB3FORMS_ACCESS_KEY";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const emailRef = useRef<HTMLInputElement>(null);

  // Carry over the email typed into the homepage hero, if any
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("zk-email");
      if (saved && emailRef.current && !emailRef.current.value) {
        emailRef.current.value = saved;
      }
    } catch {
      // Storage unavailable: start empty.
    }
  }, []);

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

    // Give up after 15 seconds so the button never spins forever
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    const fallback =
      "That didn't go through. Please try again, or email me at zacklein555@gmail.com.";

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New tutoring inquiry from ${data.name || "your site"}`,
          from_name: "Zac Klein Tutoring",
          name: data.name,
          email: data.email,
          grade: data.grade,
          message: data.message,
        }),
      });
      // The form service can answer with a non-JSON error page
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setStatus("success");
        form.reset();
        try {
          sessionStorage.removeItem("zk-email");
        } catch {
          // Storage unavailable: nothing to clear.
        }
      } else {
        setStatus("error");
        setError(json?.message ? `${json.message}. ${fallback}` : fallback);
      }
    } catch {
      setStatus("error");
      setError(
        "Network error. Check your connection and try again, or email me at zacklein555@gmail.com."
      );
    } finally {
      window.clearTimeout(timer);
    }
  }

  return (
    <SiteShell>
      <main id="main">
        <section data-section-theme="dark" className="pb-12 pt-[136px] sm:pt-[168px]">
          <div className="m-wrap grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
            {/* Left: pitch */}
            <div>
              <h1 className="m-h1 max-w-[440px] text-balance">Book a free consultation</h1>
              <p className="m-body mt-5 max-w-[420px]" style={{ color: "var(--muted)" }}>
                Share a few details and I&apos;ll get back to you within a day
                to set up a free 30-minute consultation over Zoom. No pressure,
                and no app idea needed yet.
              </p>
              <div className="mt-10 max-w-[420px]">
                {[
                  ["Email", "zacklein555@gmail.com", "mailto:zacklein555@gmail.com"],
                  ["GitHub", "github.com/Zrk1212", "https://github.com/Zrk1212"],
                  ["First call", "Free, 30 minutes, over Zoom", ""],
                ].map(([label, value, href]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-6 border-t py-4 text-[16px]"
                    style={{ borderColor: "var(--rule)" }}
                  >
                    <span style={{ color: "var(--muted)" }}>{label}</span>
                    {href ? (
                      <a
                        href={href}
                        {...(href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="m-focus rounded font-[440] underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-right font-[440]">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card */}
            <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "var(--tile)" }}>
              {status === "success" ? (
                <div
                  role="status"
                  className="flex min-h-[22rem] flex-col items-center justify-center text-center"
                >
                  <div
                    aria-hidden
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--m-indigo)] text-[22px] text-white"
                  >
                    &#10003;
                  </div>
                  <h2 className="m-h3 mt-6">Message sent.</h2>
                  <p className="m-body mt-3 max-w-[340px]" style={{ color: "var(--muted)" }}>
                    Thanks for reaching out. I&apos;ll get back to you within a
                    day, usually sooner.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="m-btn m-btn-secondary mt-8"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
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
                      className="m-input"
                    />
                  </Field>

                  <Field label="Email">
                    <input
                      ref={emailRef}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@email.com"
                      className="m-input"
                    />
                  </Field>

                  <Field label="Student's grade">
                    <Select
                      name="grade"
                      options={[
                        ["9", "9th"],
                        ["10", "10th"],
                        ["11", "11th"],
                        ["12", "12th"],
                      ]}
                    />
                  </Field>

                  <Field label="Tell me a little about your student">
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="A few sentences is plenty. What are they interested in?"
                      className="m-input resize-none"
                    />
                  </Field>

                  <p role="alert" className="text-[14px] leading-[1.4] text-[#f5b27a] empty:hidden">
                    {status === "error" ? error : ""}
                  </p>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="m-btn m-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "sending" ? "Sending…" : "Request a consultation"}
                  </button>

                  <p className="text-center text-[13px]" style={{ color: "var(--muted)" }}>
                    Goes straight to my inbox. I never share your details.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

function Select({
  name,
  options,
}: {
  name: string;
  options: [value: string, label: string][];
}) {
  return (
    <div className="relative">
      <select
        name={name}
        required
        defaultValue=""
        className="m-input appearance-none pr-9 [&:invalid]:text-[rgba(195,195,204,0.6)]"
      >
        <option value="" disabled>
          Choose
        </option>
        {options.map(([value, label]) => (
          <option key={value} value={value} className="bg-[#272735] text-[#ededf3]">
            {label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-3.5 top-1/2 h-3 w-3 -translate-y-1/2"
        style={{ color: "var(--muted)" }}
      >
        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex h-full flex-col">
      <span className="mb-2 block text-[14px] font-[440]" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span className="mt-auto block">{children}</span>
    </label>
  );
}
