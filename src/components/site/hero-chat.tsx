"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LogoMark } from "./logo";
import { usePrefersReducedMotion } from "./shell";

const PROMPTS = [
  "Get me into Harvard, no mistakes",
  "Get me into Yale, no mistakes",
  "Get me into Princeton, no mistakes",
  "Get me into UVA, no mistakes",
];
const LONGEST = PROMPTS.reduce((a, b) => (b.length > a.length ? b : a));

/* The glass prompt bar under the headline. It types each line, deletes it and
   moves to the next, forever. The typing is for show: the whole bar is one link
   to the booking form. */
export function HeroChat() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const text = textRef.current;
    if (!root || !text) return;
    if (reduced) {
      text.textContent = PROMPTS[0];
      return;
    }

    let line = 0;
    let shown = 0;
    let deleting = false;
    let timer = 0;
    let onScreen = true;
    text.textContent = "";

    function step() {
      timer = 0;
      if (!text) return;
      if (document.hidden || !onScreen) return; // picks up again in wake()
      const full = PROMPTS[line];
      let wait: number;
      if (!deleting) {
        shown += 1;
        text.textContent = full.slice(0, shown);
        if (shown === full.length) {
          deleting = true;
          wait = 1700; // let the finished line sit
        } else {
          // People pause a little after punctuation and spaces
          const ch = full[shown - 1];
          wait = ch === "," ? 260 : ch === " " ? 95 : 62 + ((shown * 7) % 5) * 9;
        }
      } else {
        shown -= 1;
        text.textContent = full.slice(0, shown);
        if (shown === 0) {
          deleting = false;
          line = (line + 1) % PROMPTS.length;
          wait = 380;
        } else {
          wait = 24;
        }
      }
      timer = window.setTimeout(step, wait);
    }
    function wake() {
      if (!timer) timer = window.setTimeout(step, 200);
    }

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) wake();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", wake);
    timer = window.setTimeout(step, 700);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
    };
  }, [reduced]);

  return (
    <Link ref={rootRef} href="/contact" className="m-chat m-focus">
      <span className="sr-only">Book a session</span>
      <LogoMark className="m-chat-spark" />
      <span className="m-chat-line" aria-hidden>
        {/* Holds the bar at the width of the longest line so nothing shifts */}
        <span className="m-chat-sizer">{LONGEST}</span>
        <span className="m-chat-typed">
          <span ref={textRef}>{PROMPTS[0]}</span>
          <span className="m-chat-caret" />
        </span>
      </span>
      <span className="m-chat-send" aria-hidden>
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" />
        </svg>
      </span>
    </Link>
  );
}
