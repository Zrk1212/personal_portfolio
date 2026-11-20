"use client";

import { useState } from "react";
import { SKILLS } from "@/app/content";
import { SectionHead } from "./shell";

/* ----------------------------------------------------------------
   What they'll learn: two 2x2 grids of tiles, each with a small
   looping illustration drawn in markup (no images).
----------------------------------------------------------------- */

const card =
  "m-th rounded-xl bg-[var(--card)] text-[var(--card-fg)] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)]";
const muted = "m-th text-[var(--card-muted)]";
const delay = (s: number) => ({ animationDelay: `${s}s` });

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[var(--m-indigo)]" aria-hidden>
      <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.8 8.2l2.1 2.1 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlanArt() {
  const rows = ["What the app does", "Who it's for", "The three main screens", "What we build first"];
  return (
    <div className={`${card} w-[64%] p-5`}>
      <div className={`${muted} font-[family-name:var(--font-geist-mono)] text-[12px]`}>plan.md</div>
      <div className="mt-3 space-y-2.5">
        {rows.map((r, i) => (
          <div key={r} className="m-step flex items-center gap-2.5 text-[14px]" style={delay(0.5 + i * 0.9)}>
            <Check />
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeArt() {
  return (
    <div className="w-[72%] rounded-xl bg-[#1e1e2a] p-5 font-[family-name:var(--font-geist-mono)] text-[13px] leading-[1.7] text-[#ededf3] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.5)]">
      <div className="flex gap-2">
        <span className="text-[#8f9cf5]">&gt;</span>
        <span className="m-type">add a screen to save favorites</span>
      </div>
      <div className="m-step text-[#c3c3cc]" style={delay(3)}>
        Edited 3 files
      </div>
      <div className="m-step text-[#c3c3cc]" style={delay(3.9)}>
        Running the app
      </div>
      <div className="m-step flex items-center gap-2" style={delay(4.8)}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#7ee0a3]" />
        It works. What next?
      </div>
    </div>
  );
}

function OnlineArt() {
  return (
    <div className={`${card} flex w-[84%] max-w-[360px] items-center justify-between gap-3 rounded-full py-3.5 pl-5 pr-4`}>
      <span className="truncate text-[15px]">your-app.vercel.app</span>
      <span className="relative h-7 w-[78px] shrink-0 text-[13px]">
        <span className={`${muted} m-swap-out absolute inset-0 flex items-center justify-end gap-2`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#e2b65a]" />
          Building
        </span>
        <span className="m-swap-in absolute inset-0 flex items-center justify-end gap-2 opacity-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="m-ping absolute inset-0 rounded-full bg-[#3fbf77]" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#3fbf77]" />
          </span>
          Live
        </span>
      </span>
    </div>
  );
}

function FeatureArt() {
  return (
    <div className="flex w-[66%] flex-col gap-2.5">
      <div
        className="m-step self-end rounded-2xl rounded-br-md bg-[var(--m-indigo)] px-4 py-2.5 text-[14px] text-white"
        style={delay(0.4)}
      >
        Quiz me on chapter 4
      </div>
      <div className={`${card} m-step self-start rounded-2xl rounded-bl-md px-4 py-2.5 text-[14px]`} style={delay(1.8)}>
        Here are five questions to start.
      </div>
      <div className={`${card} m-step self-start rounded-2xl rounded-bl-md px-4 py-2.5 text-[14px]`} style={delay(2.8)}>
        1. What caused the change?
      </div>
    </div>
  );
}

function AutomationArt() {
  const steps = [
    ["Every Friday at 4 pm", "Trigger"],
    ["Summarize my week", "AI step"],
    ["Email it to me", "Action"],
  ];
  return (
    <div className="flex w-[62%] flex-col">
      {steps.map(([title, label], i) => (
        <div key={title}>
          {i > 0 && (
            <div
              className="m-step ml-6 h-4 w-px bg-[var(--card-muted)] opacity-50"
              style={delay(0.2 + i * 1.1)}
            />
          )}
          <div className={`${card} m-step flex items-center justify-between px-4 py-3`} style={delay(0.4 + i * 1.1)}>
            <span className="text-[14px]">{title}</span>
            <span className={`${muted} text-[12px]`}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillArt() {
  return (
    <div className={`${card} w-[62%] p-5`}>
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-[480]">Write like me</span>
        <span
          className="m-step rounded-full bg-[rgba(82,102,235,0.14)] px-2.5 py-1 text-[12px] text-[var(--m-indigo)]"
          style={delay(3.2)}
        >
          Saved
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {["Short sentences", "No filler words", "End with a question"].map((r, i) => (
          <div key={r} className={`${muted} m-step text-[14px]`} style={delay(0.5 + i * 0.8)}>
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function McpArt() {
  const tools = ["Gmail", "Calendar", "Database"];
  return (
    <div className="flex w-[74%] items-center">
      <div className={`${card} shrink-0 rounded-full px-4 py-2.5 text-[14px] font-[480]`}>Their AI</div>
      <div className="relative flex flex-1 flex-col gap-3">
        <div className="absolute bottom-[19px] left-0 top-[19px] w-px bg-[var(--card-muted)] opacity-60" />
        {tools.map((t, i) => (
          <div key={t} className="flex items-center">
            <div
              className="m-draw h-px flex-1 bg-[var(--card-muted)] opacity-60"
              style={delay(0.4 + i * 0.9)}
            />
            <div className={`${card} m-step w-[104px] shrink-0 rounded-full px-4 py-2 text-center text-[14px]`} style={delay(0.9 + i * 0.9)}>
              {t}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackArt() {
  return (
    <div className="relative mr-[14%] w-[52%]">
      <div className={`${card} p-5`}>
        <div className="h-2.5 w-24 rounded-full bg-[var(--card-muted)] opacity-30" />
        <div className="mt-3 h-2 w-full rounded-full bg-[var(--card-muted)] opacity-15" />
        <div className="mt-2 h-2 w-4/5 rounded-full bg-[var(--card-muted)] opacity-15" />
        <div className="relative mt-5 inline-flex">
          <span className="m-ping absolute inset-0 rounded-full bg-[var(--m-indigo)]" />
          <span className="relative rounded-full bg-[var(--m-indigo)] px-4 py-1.5 text-[13px] text-white">Save</span>
        </div>
      </div>
      <div
        className={`${card} m-step absolute -right-[30%] bottom-[-22px] w-[190px] rounded-2xl rounded-tl-md px-4 py-2.5 text-[13px] leading-[1.35]`}
        style={delay(1.4)}
      >
        Make this button easier to find.
      </div>
    </div>
  );
}

const ART: Record<string, () => React.ReactNode> = {
  "A written plan": PlanArt,
  "Building with Claude Code": CodeArt,
  "Putting it online": OnlineArt,
  "An AI feature": FeatureArt,
  Automations: AutomationArt,
  Skills: SkillArt,
  "MCP servers": McpArt,
  "Personal feedback": FeedbackArt,
};

function Tile({ skill, alt }: { skill: (typeof SKILLS)[number]; alt: boolean }) {
  const [paused, setPaused] = useState(false);
  const Art = ART[skill.title];
  return (
    <div>
      <div
        data-paused={paused}
        className="m-th relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl"
        style={{ backgroundColor: alt ? "var(--tile-2)" : "var(--tile)" }}
      >
        {Art && <Art />}
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? `Play the ${skill.title} animation` : `Pause the ${skill.title} animation`}
          className="m-focus m-th absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--bg)] text-[var(--fg)] motion-reduce:hidden"
        >
          {paused ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
              <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
              <rect x="2.5" y="1.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
              <rect x="7" y="1.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
      <h3 className="m-body mt-5 !font-[480]">{skill.title}</h3>
      <p className="m-body m-th max-w-[460px]" style={{ color: "var(--muted)" }}>
        {skill.body}
      </p>
    </div>
  );
}

export function Skills() {
  const first = SKILLS.slice(0, 4);
  const second = SKILLS.slice(4);
  return (
    <section id="learn" data-section-theme="warm" className="scroll-mt-[72px] pb-28 pt-24 sm:pb-36 sm:pt-32">
      <div className="m-wrap">
        <SectionHead
          title="Skills they keep after the app ships."
          sub="Your student brings the idea and leaves with a live app. Along the way they learn how to work with AI in ways that carry over to anything they build next."
        />
        <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {first.map((s, i) => (
            <Tile key={s.title} skill={s} alt={i === 1 || i === 2} />
          ))}
        </div>

        <SectionHead className="mt-24 sm:mt-32" title="Then they put AI to work for them." />
        <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {second.map((s, i) => (
            <Tile key={s.title} skill={s} alt={i === 0 || i === 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
