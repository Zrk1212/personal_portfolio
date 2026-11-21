"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "./shell";

/* ----------------------------------------------------------------
   The painter panel. A white canvas, and the Claude Code agent, which
   paints the real app screenshots onto it with a loaded brush.

   The painting is a mask: each frame the brush lays down a few dozen
   bristle lines on a scratch canvas, the screenshot is drawn through
   them, and the result is added to the visible canvas. The mark is
   an inline SVG moved with a transform: it travels, turns a few
   degrees into each sweep, and is otherwise left alone (no face, no
   limbs, no squash). Frames only run while a painting is in progress
   and the panel is on screen; at rest its slow bob is CSS.

   Once a site is painted, a short muted loop of that site's hero
   fades in over the still. Only the project on the canvas ever has
   a clip loaded.
----------------------------------------------------------------- */

type PaintedProject = { title: string; image: string };

const CORAL = "#D97757"; // Claude's own colour

/* Which screenshots have a moving capture: /work/<slug>.png has
   /work/clips/<slug>.mp4 (960x600) and <slug>-sm.mp4 (640x400, phones). */
const CLIP_SLUGS = new Set(["vantage", "hoos-planner", "scent-smart", "bubble", "dr-rob"]);
function clipFor(image: string) {
  const slug = image.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "");
  return slug && CLIP_SLUGS.has(slug) ? `/work/clips/${slug}` : null;
}
const BRISTLE = [240, 222, 190]; // an unloaded brush

/* Timing, in seconds */
const STROKES = 6;
const SWEEP = 0.45; // one pass across the panel
const TURN = 0.095; // the lift between passes
const PAINT = STROKES * SWEEP + (STROKES - 1) * TURN; // about 3.2s
const POP = 0.42; // first appearance
const EXIT = 0.5; // hop to the corner
const SETTLE = 0.6; // let the landing and the wet sheen die down
const WET_TAU = 0.38;

/* Tint samples: a tiny copy of the screenshot */
const GW = 24;
const GH = 15;

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
/* A sweep slows into its ends without ever stopping dead */
const sweepEase = (t: number) => 0.2 * t + 0.8 * ease(t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
/* Smooth 1D noise in 0..1 */
function noise(seed: number, x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const base = seed * 57.31 + i;
  return lerp(hash(base), hash(base + 1), f * f * (3 - 2 * f));
}
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The optimized file Next would serve for this width. A plain Image with one
   src, so naturalWidth is real pixels (an <img srcset> reports it adjusted
   for density, which breaks canvas cropping). */
function pickSource(src: string, need: number) {
  const { props } = getImageProps({ src, alt: "", fill: true, sizes: "100vw" });
  const list = (props.srcSet ?? "")
    .split(", ")
    .map((entry) => {
      const [url, w] = entry.trim().split(/\s+/);
      return { url, w: parseInt(w ?? "", 10) };
    })
    .filter((c) => c.url && c.w > 0)
    .sort((a, b) => a.w - b.w);
  if (!list.length) return { url: props.src as string, w: 100000 };
  return list.find((c) => c.w >= need) ?? list[list.length - 1];
}

type Bristle = {
  v: number; // position across the brush, -1..1
  along: number; // how far this bristle leads (+) or trails (-) the brush, px
  lw: number;
  alpha: number;
  cover: number; // 1 = always touching, lower = dry and broken
  corr: number; // length of its dashes, px
  wander: number;
  seed: number;
  wet: number;
};

type Stroke = {
  dir: 1 | -1;
  xs: number;
  xe: number;
  yc: number;
  bow: number;
  tilt: number;
  hw: number;
  seed: number;
  bodyY: number;
  bristles: Bristle[];
};

type Pose = { x: number; y: number; sc: number; ang: number; rad: number };

type Job = {
  target: number;
  t: number;
  strokes: Stroke[];
  done: number[]; // how far each sweep has been painted, 0..1
  enter: number; // seconds before the first sweep
  pop: boolean; // appear in place, rather than hop over
  from: Pose;
  start: Pose;
  out: Pose | null;
  painting: boolean;
  committed: boolean;
  landed: boolean;
  turn: number;
  grid: Uint8ClampedArray | null;
};

type Painter = { set: (active: number, play: boolean) => void; destroy: () => void };

function createPainter(root: HTMLDivElement, srcs: string[]): Painter | null {
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
  const canvasEl = q<HTMLCanvasElement>(".pt-canvas");
  const wetEl = q<HTMLCanvasElement>(".pt-wet");
  const botEl = q<SVGSVGElement>(".pt-bot");
  const brushEl = q<SVGGElement>('[data-pt="brush"]');
  const bodyEl = q<SVGGElement>('[data-pt="body"]');
  const video = q<HTMLVideoElement>(".pt-clip");
  const tipPath = q<SVGPathElement>('[data-pt="tip"]');
  if (!canvasEl || !wetEl || !botEl) return null;
  if (!brushEl || !bodyEl || !tipPath) return null;
  const tmp = document.createElement("canvas"); // this frame's brush marks
  const fit = document.createElement("canvas"); // the screenshot, cropped to the panel
  const c1 = canvasEl.getContext("2d");
  const c2 = wetEl.getContext("2d");
  const c3 = tmp.getContext("2d");
  const c4 = fit.getContext("2d");
  if (!c1 || !c2 || !c3 || !c4) return null;
  // Plain names for the closures below (narrowing does not follow into them)
  const canvas = canvasEl;
  const wet = wetEl;
  const bot = botEl;
  const gBrush = brushEl;
  const gBody = bodyEl;
  const tipEl = tipPath;
  const ctx = c1;
  const wctx = c2;
  const tctx = c3;
  const fctx = c4;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let bw = 30; // the mark's width in CSS px
  let idleSc = 1;
  let active = 0;
  let play = false;
  let shown = -1; // which screenshot is fully on the canvas (-1: blank)
  let job: Job | null = null;
  let raf = 0;
  let last = 0;
  let onScreen = true;
  let dead = false;
  let restTimer = 0;
  let wetFade = 0;
  let wetDirty = false;
  let fitW = 0; // width of the file the fitted copy was drawn from

  /* The mark's pose. ang/rad place the brush tip relative to its centre. */
  const p = {
    x: 0,
    y: 0,
    sc: 1,
    ang: -2.1,
    rad: 1.3,
    lean: 0, // degrees of turn, into the direction of travel
    air: 0,
    tint: [...BRISTLE],
  };

  /* ---------- images ---------- */
  const clips = srcs.map(clipFor);
  const slots = srcs.map(() => ({ img: null as HTMLImageElement | null, w: 0, loading: 0 }));

  function load(i: number, low = false) {
    const s = slots[i];
    if (!s || W < 2) return;
    const c = pickSource(srcs[i], Math.min(2048, Math.ceil(W * dpr)));
    if (c.w <= s.w || c.w <= s.loading) return;
    s.loading = c.w;
    const img = new window.Image();
    img.decoding = "async";
    if (low) img.fetchPriority = "low";
    const done = () => {
      if (s.loading === c.w) s.loading = 0;
      if (dead || c.w <= s.w || !img.naturalWidth) return;
      s.img = img;
      s.w = c.w;
      if (shown === i && !job) drawShown();
      resolve();
    };
    img.onload = () => {
      // decode first, so the first brush stroke never waits on it
      if (typeof img.decode === "function") img.decode().then(done, done);
      else done();
    };
    img.onerror = () => {
      if (s.loading === c.w) s.loading = 0;
    };
    img.src = c.url;
  }
  function loadOthers() {
    window.clearTimeout(restTimer);
    restTimer = 0;
    for (let i = 0; i < slots.length; i++) if (i !== active) load(i, true);
  }

  /* The screenshot at panel size: object-fit cover, anchored to the top */
  function drawFit(i: number) {
    const img = slots[i]?.img;
    if (!img) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const s = Math.max(W / iw, H / ih);
    const sw = W / s;
    const sh = H / s;
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.imageSmoothingEnabled = true;
    fctx.imageSmoothingQuality = "high";
    fctx.clearRect(0, 0, fit.width, fit.height);
    fctx.drawImage(img, (iw - sw) / 2, 0, sw, sh, 0, 0, fit.width, fit.height);
    fitW = slots[i].w;
  }
  function drawShown() {
    if (shown < 0) return;
    drawFit(shown);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(fit, 0, 0);
  }
  function sampleGrid() {
    try {
      const c = document.createElement("canvas");
      c.width = GW;
      c.height = GH;
      const g = c.getContext("2d");
      if (!g) return null;
      g.imageSmoothingQuality = "high";
      g.drawImage(fit, 0, 0, GW, GH);
      return g.getImageData(0, 0, GW, GH).data;
    } catch {
      return null;
    }
  }

  /* ---------- brush strokes ---------- */
  function makeStroke(k: number, rnd: () => number): Stroke {
    const S = H / STROKES;
    const dir: 1 | -1 = k % 2 === 0 ? -1 : 1; // start top right, finish bottom right
    const hw = S * 0.94;
    const core = (S * 0.68) / hw; // inside this the paint is solid
    const yc = 0.38 * S + (k * (H - 0.76 * S)) / (STROKES - 1);
    const seed = 1 + Math.floor(rnd() * 900);
    const gap = clamp((2 * hw) / 84, 1.6, 4); // spacing between loaded bristles, px
    const front = (v: number) => -0.72 * v * v; // the brush presses down in a curve
    const bristles: Bristle[] = [];
    let j = 0;
    for (let v = -1; v < 1; j++) {
      const av = Math.abs(v);
      const edge = clamp((av - core) / (1 - core));
      const clump = noise(seed + 11, (v * hw) / (gap * 4.2)) - 0.5;
      const along = hw * (front(v) + 0.2 * clump + 0.09 * (rnd() - 0.5));
      if (edge === 0) {
        // Loaded bristles. Near the rim a few run thin and leave slivers,
        // which the next pass covers.
        const rim = av > core * 0.82 && rnd() < 0.45;
        bristles.push({
          v,
          along,
          lw: rim ? gap * (0.9 + rnd() * 0.6) : gap * 2.2,
          alpha: 1,
          cover: rim ? 0.8 + rnd() * 0.12 : 1,
          corr: S * (0.4 + rnd() * 1.1),
          wander: gap * 0.8,
          seed: seed + 20 + j,
          wet: 0.04 + 0.1 * rnd() * rnd(),
        });
        v += (gap / hw) * (0.85 + rnd() * 0.3);
      } else {
        // Dry bristles at the sides: fine, close together, broken into
        // tapering dashes that thin out toward the rim
        const thin = Math.pow(edge, 0.7);
        bristles.push({
          v,
          along: along - edge * hw * 0.2 * rnd(),
          lw: gap * lerp(1.5, 0.45, thin) * (0.6 + rnd() * 0.8),
          alpha: 0.82 + rnd() * 0.18,
          cover: lerp(0.94, 0.1, thin) * (0.7 + rnd() * 0.6),
          corr: S * (0.1 + rnd() * rnd() * 0.7),
          wander: gap * 1.3,
          seed: seed + 20 + j,
          wet: rnd() < 0.35 ? 0.06 : 0,
        });
        v += (gap / hw) * (0.4 + rnd() * 0.45);
      }
    }
    // Loose hairs: fine broken lines that run ahead of the brush and off its sides
    const hairs = Math.round(bristles.length * 0.3);
    for (let h = 0; h < hairs; h++) {
      const v = (rnd() * 2 - 1) * 1.04;
      const out = Math.abs(v) > core;
      bristles.push({
        v,
        along: hw * (front(v) + 0.05 + rnd() * (out ? 0.1 : 0.26)),
        lw: gap * (0.3 + rnd() * 0.4),
        alpha: 0.75 + rnd() * 0.25,
        cover: out ? 0.2 + rnd() * 0.22 : 0.5,
        corr: S * (0.1 + rnd() * 0.4),
        wander: gap * 1.6,
        seed: seed + 400 + h,
        wet: 0,
      });
    }
    // The mark works from just below the stroke, or above it near the bottom
    const reach = 1.25 * bw;
    let bodyY = yc + reach;
    if (bodyY + 0.56 * bw > H - 2) bodyY = yc - reach;
    bodyY = clamp(bodyY, 0.45 * bw, H - 0.56 * bw);
    return {
      dir,
      xs: dir > 0 ? -0.03 * W : 1.03 * W,
      xe: dir > 0 ? 1.06 * W : -0.06 * W, // far enough that the trailing bristles clear the edge
      yc,
      bow: S * (0.15 + rnd() * 0.06),
      tilt: S * (rnd() - 0.5) * 0.06,
      hw,
      seed,
      bodyY,
      bristles,
    };
  }
  function strokeX(st: Stroke, u: number) {
    return st.xs + (st.xe - st.xs) * u;
  }
  function strokeY(st: Stroke, u: number) {
    const c = 2 * u - 1;
    return st.yc + st.tilt * c + st.bow * (c * c - 0.5);
  }

  const MAXN = 50;
  /* Distance between samples along a stroke: finer on small panels, where the
     dry dashes are only a few pixels long */
  const sampleStep = () => clamp(H / STROKES / 22, 1.5, 4);
  const X = new Float32Array(MAXN + 1);
  const Y = new Float32Array(MAXN + 1);
  const TX = new Float32Array(MAXN + 1);
  const TY = new Float32Array(MAXN + 1);
  const SS = new Float32Array(MAXN + 1);
  const WA = new Float32Array(MAXN + 1);
  const WB = new Float32Array(MAXN + 1);
  const PX = new Float32Array(MAXN + 1);
  const PY = new Float32Array(MAXN + 1);
  const HW = new Float32Array(MAXN + 1);

  /* One dash: samples from..to-1 as a closed ribbon of varying width */
  function ribbon(path: Path2D, from: number, to: number) {
    for (let m = from; m < to; m++) {
      const x = PX[m] - TY[m] * HW[m];
      const y = PY[m] + TX[m] * HW[m];
      if (m === from) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
    for (let m = to - 1; m >= from; m--) {
      path.lineTo(PX[m] + TY[m] * HW[m], PY[m] - TX[m] * HW[m]);
    }
    path.closePath();
  }

  function layDown(st: Stroke, u0: number, u1: number, wetColor: string) {
    const S = H / STROKES;
    const span = Math.abs(st.xe - st.xs);
    // Sample 0 sits a hair behind where the last frame stopped, so the joins in
    // the paint never show. (The sheen starts at sample 1: there an overlap
    // would show as a bright tick.)
    const n = Math.min(MAXN, 1 + Math.max(1, Math.ceil((span * (u1 - u0)) / sampleStep())));
    for (let i = 0; i <= n; i++) {
      const u = i ? u0 + ((u1 - u0) * (i - 1)) / (n - 1) : Math.max(0, u0 - 0.75 / span);
      const c = 2 * u - 1;
      let dx = st.xe - st.xs;
      let dy = 2 * st.tilt + 4 * st.bow * c;
      const l = Math.hypot(dx, dy) || 1;
      dx /= l;
      dy /= l;
      const s = span * u;
      X[i] = strokeX(st, u);
      Y[i] = strokeY(st, u);
      TX[i] = dx;
      TY[i] = dy;
      SS[i] = s;
      // the two sides of the stroke wobble on their own
      WA[i] =
        1 +
        0.08 * (noise(st.seed + 1, s / (1.4 * S)) * 2 - 1) +
        0.035 * (noise(st.seed + 2, s / (0.33 * S)) * 2 - 1);
      WB[i] =
        1 +
        0.08 * (noise(st.seed + 3, s / (1.4 * S)) * 2 - 1) +
        0.035 * (noise(st.seed + 4, s / (0.33 * S)) * 2 - 1);
    }
    wctx.strokeStyle = wetColor;
    wctx.fillStyle = wetColor;
    for (const b of st.bristles) {
      const path = new Path2D();
      const sheen = b.wet > 0 ? new Path2D() : null;
      if (b.cover >= 1) {
        // a loaded bristle: one unbroken line
        for (let i = 0; i <= n; i++) {
          const off = b.v * st.hw * (b.v < 0 ? WA[i] : WB[i]);
          const x = X[i] + TX[i] * b.along - TY[i] * off;
          const y = Y[i] + TY[i] * b.along + TX[i] * off;
          if (i) path.lineTo(x, y);
          else path.moveTo(x, y);
          if (sheen && i > 1) sheen.lineTo(x, y);
          else if (sheen && i === 1) sheen.moveTo(x, y);
        }
        tctx.lineWidth = b.lw;
        tctx.globalAlpha = 1;
        tctx.stroke(path);
        if (sheen) {
          wctx.lineWidth = b.lw * 0.8;
          wctx.globalAlpha = b.wet;
          wctx.stroke(sheen);
          wetDirty = true;
        }
        continue;
      }
      // a dry bristle: dashes that swell and taper as it touches and lifts
      let from = -1;
      let any = false;
      for (let i = 0; i <= n + 1; i++) {
        let half = 0;
        if (i <= n) {
          const s = SS[i] + b.along;
          // the brush runs a little drier toward the end of each pass
          const touch = b.cover * (1 - 0.3 * (SS[i] / span)) - noise(b.seed, s / b.corr);
          if (touch > 0) {
            half = 0.5 * b.lw * Math.pow(Math.min(1, touch / 0.16), 0.6);
            const off =
              b.v * st.hw * (b.v < 0 ? WA[i] : WB[i]) +
              (noise(b.seed + 7, s / (0.9 * S)) - 0.5) * b.wander;
            PX[i] = X[i] + TX[i] * b.along - TY[i] * off;
            PY[i] = Y[i] + TY[i] * b.along + TX[i] * off;
            HW[i] = half;
          }
        }
        if (half > 0) {
          if (from < 0) from = i;
          continue;
        }
        if (from >= 0) {
          if (i - from >= 2) {
            ribbon(path, from, i);
            any = true;
          }
          if (sheen && i - Math.max(from, 1) >= 2) ribbon(sheen, Math.max(from, 1), i);
        }
        from = -1;
      }
      if (!any) continue;
      tctx.globalAlpha = b.alpha;
      tctx.fill(path);
      if (sheen) {
        wctx.globalAlpha = b.wet;
        wctx.fill(sheen);
        wetDirty = true;
      }
    }
    tctx.globalAlpha = 1;
    wctx.globalAlpha = 1;
  }

  /* Paint everything the brush has passed over by time tau */
  function paint(j: Job, tau: number) {
    const period = SWEEP + TURN;
    const todo: [Stroke, number, number][] = [];
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (let k = 0; k < STROKES; k++) {
      const local = tau - k * period;
      if (local <= 0) break;
      const u1 = sweepEase(Math.min(1, local / SWEEP));
      const u0 = j.done[k];
      if (u1 <= u0) continue;
      j.done[k] = u1;
      const st = j.strokes[k];
      todo.push([st, u0, u1]);
      const padX = st.hw * 1.25 + 3;
      const padY = st.hw * 1.25 + st.bow * 0.5 + Math.abs(st.tilt) + 3;
      x0 = Math.min(x0, strokeX(st, u0) - padX, strokeX(st, u1) - padX);
      x1 = Math.max(x1, strokeX(st, u0) + padX, strokeX(st, u1) + padX);
      y0 = Math.min(y0, st.yc - padY);
      y1 = Math.max(y1, st.yc + padY);
    }
    if (!todo.length) return;
    const rx = Math.max(0, Math.floor(x0 * dpr));
    const ry = Math.max(0, Math.floor(y0 * dpr));
    const rw = Math.min(canvas.width, Math.ceil(x1 * dpr)) - rx;
    const rh = Math.min(canvas.height, Math.ceil(y1 * dpr)) - ry;
    if (rw <= 0 || rh <= 0) return;

    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.globalCompositeOperation = "source-over";
    tctx.clearRect(rx, ry, rw, rh);
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.strokeStyle = "#000";
    tctx.fillStyle = "#000";
    tctx.lineCap = "butt";
    tctx.lineJoin = "round";
    wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    wctx.globalCompositeOperation = "source-over";
    wctx.lineCap = "butt";
    wctx.lineJoin = "round";

    // Wet paint reads a shade deeper on light areas and glossier on dark ones
    const [r, g, b] = p.tint;
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const light = lum > 0.42;
    const wetColor = `rgb(${[r, g, b]
      .map((c, i) => Math.round(light ? c * 0.32 + [8, 9, 19][i] : lerp(c, 255, 0.55)))
      .join(",")})`;

    for (const [st, u0, u1] of todo) {
      // in pieces, so a long catch-up is sampled as finely as a single frame
      const piece = ((MAXN - 2) * sampleStep()) / Math.abs(st.xe - st.xs);
      for (let a = u0; a < u1; a += piece) layDown(st, a, Math.min(u1, a + piece), wetColor);
    }

    // The screenshot, only where the bristles touched, added to the painting
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.globalCompositeOperation = "source-atop";
    tctx.drawImage(fit, rx, ry, rw, rh, rx, ry, rw, rh);
    tctx.globalCompositeOperation = "source-over";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(tmp, rx, ry, rw, rh, rx, ry, rw, rh);
  }

  function clearWet() {
    wctx.setTransform(1, 0, 0, 1, 0, 0);
    wctx.clearRect(0, 0, wet.width, wet.height);
    wetDirty = false;
    wetFade = 0;
  }
  /* The sheen dries in small steps rather than every frame: big enough that
     8-bit alpha really falls, small enough that the steps are invisible. */
  function dryWet(dt: number, last: boolean) {
    if (!wetDirty) return;
    wetFade += dt;
    if (wetFade < (last ? 0.05 : 0.033)) return;
    wctx.setTransform(1, 0, 0, 1, 0, 0);
    wctx.globalCompositeOperation = "destination-out";
    // the last traces go in firmer steps, so nothing is left to clear at rest
    wctx.fillStyle = `rgba(0,0,0,${last ? 0.3 : 1 - Math.exp(-wetFade / WET_TAU)})`;
    wctx.fillRect(0, 0, wet.width, wet.height);
    wctx.globalCompositeOperation = "source-over";
    wetFade = 0;
  }

  /* ---------- the mark ---------- */
  function idlePose(): Pose {
    const pad = Math.max(6, W * 0.014);
    return {
      x: W - pad - 0.6 * bw * idleSc,
      y: H - pad - 0.53 * bw * idleSc,
      sc: idleSc,
      ang: -2.0,
      rad: 1.3,
    };
  }
  function startPose(st: Stroke): Pose {
    const tipX = strokeX(st, 0);
    const tipY = strokeY(st, 0);
    const mx = 0.6 * bw;
    const x = clamp(tipX - st.dir * 0.12 * bw, mx, W - mx);
    const y = st.bodyY + (tipY - st.yc) * 0.6;
    return {
      x,
      y,
      sc: 1,
      ang: Math.atan2(tipY - y, tipX - x),
      rad: Math.hypot(tipX - x, tipY - y) / bw,
    };
  }
  function setPose(to: Pose) {
    p.x = to.x;
    p.y = to.y;
    p.sc = to.sc;
    p.ang = to.ang;
    p.rad = to.rad;
  }
  /* A lift from one pose to another; the brush swings round rather than through */
  function hop(from: Pose, to: Pose, f: number, clockwise: boolean) {
    const e = ease(f);
    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const arc = Math.min(0.9 * bw, 0.22 * bw + dist * 0.16);
    let d = to.ang - from.ang;
    if (clockwise) {
      d %= Math.PI * 2;
      if (d < 0) d += Math.PI * 2;
    } else {
      d = Math.atan2(Math.sin(d), Math.cos(d));
    }
    const lift = Math.sin(Math.PI * f);
    p.x = lerp(from.x, to.x, e);
    p.y = lerp(from.y, to.y, e) - lift * arc;
    p.sc = lerp(from.sc, to.sc, e);
    p.ang = from.ang + d * e;
    p.rad = Math.max(1.05, lerp(from.rad, to.rad, e) - lift * 0.2 * Math.min(1, Math.abs(d) / 2));
    p.air = lift;
  }

  /* While painting: the tip follows the stroke, the body keeps up underneath */
  function drive(j: Job, tau: number, dt: number) {
    const period = SWEEP + TURN;
    const k = Math.min(STROKES - 1, Math.floor(tau / period));
    const local = tau - k * period;
    const st = j.strokes[k];
    let tipX: number;
    let tipY: number;
    let ty: number;
    if (local <= SWEEP || k === STROKES - 1) {
      const u = sweepEase(Math.min(1, local / SWEEP));
      tipX = strokeX(st, u);
      tipY = strokeY(st, u);
      ty = st.bodyY + (tipY - st.yc) * 0.6;
    } else {
      // lift, drop to the next line, and come back the other way
      const g = (local - SWEEP) / TURN;
      const e = ease(g);
      const nx = j.strokes[k + 1];
      tipX = lerp(strokeX(st, 1), strokeX(nx, 0), e) + st.dir * Math.sin(Math.PI * g) * 0.012 * W;
      tipY = lerp(strokeY(st, 1), strokeY(nx, 0), e);
      ty =
        lerp(st.bodyY, nx.bodyY, e) +
        (tipY - lerp(st.yc, nx.yc, e)) * 0.6 -
        Math.sin(Math.PI * g) * 0.1 * bw;
      j.turn = k;
    }
    const mx = 0.6 * bw;
    const tx = clamp(tipX - st.dir * 0.12 * bw, mx, W - mx);
    p.x += (tx - p.x) * (1 - Math.exp(-dt / 0.024));
    p.y += (ty - p.y) * (1 - Math.exp(-dt / 0.034));
    p.sc = 1;
    p.ang = Math.atan2(tipY - p.y, tipX - p.x);
    p.rad = Math.hypot(tipX - p.x, tipY - p.y) / bw;
    p.air = 0;

    // load the brush with the colour it is about to lay down
    if (j.grid) {
      const gx = Math.round(clamp(tipX / W) * (GW - 1));
      const gy = Math.round(clamp(tipY / H) * (GH - 1));
      const o = (gy * GW + gx) * 4;
      const a = 1 - Math.exp(-dt / 0.1);
      for (let c = 0; c < 3; c++) p.tint[c] += (j.grid[o + c] - p.tint[c]) * a;
    }
  }

  function renderBot() {
    const size = 4.4 * bw;
    bot.style.transform = `translate(${(p.x - size / 2).toFixed(2)}px, ${(p.y - size / 2).toFixed(2)}px) scale(${p.sc.toFixed(4)})`;
    const cos = Math.cos(p.ang);
    const sin = Math.sin(p.ang);
    const ox = cos * p.rad * 100;
    const oy = sin * p.rad * 100;
    // The handle runs straight back from the tip to the middle of the mark,
    // which is drawn over it: the brush is carried like one more ray.
    const a = (p.ang * 180) / Math.PI;
    gBrush.setAttribute("transform", `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) rotate(${a.toFixed(2)})`);
    // The mark itself only ever turns, about its own centre
    gBody.setAttribute("transform", `rotate(${p.lean.toFixed(2)})`);
    tipEl.style.fill = `rgb(${Math.round(p.tint[0])},${Math.round(p.tint[1])},${Math.round(p.tint[2])})`;
  }

  /* ---------- the sequence ---------- */
  function step(dt: number) {
    const j = job;
    if (!j) return;
    j.t += dt;
    const t = j.t;
    const x0 = p.x;
    dryWet(dt, t > j.enter + PAINT + EXIT);

    if (t < j.enter) {
      const f = t / j.enter;
      if (j.pop) {
        // Appear with the brush held high, then reach out to the first stroke
        setPose(j.start);
        const e = ease(clamp((f - 0.35) / 0.65));
        p.sc = Math.max(0.01, easeOut(clamp(f / 0.7)));
        p.ang = lerp(-2.0, j.start.ang, e);
        p.rad = lerp(1.3, j.start.rad, e);
      } else {
        hop(j.from, j.start, f, false);
      }
    } else if (t < j.enter + PAINT) {
      if (!j.painting) {
        j.painting = true;
        setPose(j.start);
      }
      const tau = t - j.enter;
      paint(j, tau);
      drive(j, tau, dt);
    } else {
      if (!j.committed) {
        // Finish every pass, then lay the whole screenshot in, so no pinhole
        // or dry edge is ever left behind.
        paint(j, PAINT + 1);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(fit, 0, 0);
        shown = j.target;
        j.committed = true;
        j.out = { x: p.x, y: p.y, sc: p.sc, ang: p.ang, rad: p.rad };
      }
      const f = (t - j.enter - PAINT) / EXIT;
      const idle = idlePose();
      if (f < 1 && j.out) {
        hop(j.out, idle, f, true);
      } else {
        j.landed = true;
        setPose(idle);
        p.air = 0;
      }
      if (t > j.enter + PAINT + EXIT + SETTLE) {
        rest();
        return;
      }
    }

    // The only secondary motion: a few degrees of turn into the travel,
    // which comes back to level as soon as the mark stops
    const vx = (p.x - x0) / Math.max(dt, 0.001) / bw; // mark widths per second
    const leanTo = clamp(vx / 24, -1, 1) * 9;
    p.lean += (leanTo - p.lean) * (1 - Math.exp(-dt / 0.07));
    renderBot();
  }

  /* At rest in the corner. From here on the motion is CSS. */
  function rest() {
    job = null;
    stop();
    clearWet();
    // a sharper file arrived while this one was being painted
    if (shown >= 0 && slots[shown].w !== fitW) drawShown();
    setPose(idlePose());
    p.lean = 0;
    p.air = 0;
    renderBot();
    root.classList.add("pt-live", "pt-idle");
    syncClip();
  }

  /* ---------- the moving capture ---------- */
  /* One <video>, and it only ever holds the clip of the project that is
     painted and at rest. Nothing is fetched before that, off screen, in a
     hidden tab, with Save-Data on, or when motion is reduced. */
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const clipsOk =
    !!video && !conn?.saveData && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 640px)");
  let clipOf = -1; // which project's clip has the src
  let clipOn = false; // faded in over the still

  /* Take the clip away so its download stops. With freeze, its current frame
     is left on the canvas first, so the next painting goes over what was
     showing and nothing jumps. */
  function dropClip(freeze: boolean) {
    if (!video || clipOf < 0) return;
    if (freeze && clipOn && video.videoWidth) {
      try {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const s = Math.max(W / vw, H / vh);
        const sw = W / s;
        const sh = H / s;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(video, (vw - sw) / 2, 0, sw, sh, 0, 0, canvas.width, canvas.height);
      } catch {
        /* the still is underneath anyway */
      }
    }
    clipOf = -1;
    clipOn = false;
    video.removeAttribute("data-on");
    video.pause();
    video.removeAttribute("src");
    video.preload = "none";
    video.load();
  }
  function syncClip() {
    if (!video || !clipsOk || dead) return;
    const visible = onScreen && !document.hidden;
    if (clipOf < 0) {
      const base = !job && play && shown >= 0 && shown === active ? clips[shown] : null;
      if (!base || !visible) return;
      clipOf = shown;
      video.muted = true;
      video.defaultMuted = true;
      video.preload = "auto";
      video.src = `${base}${small.matches ? "-sm" : ""}.mp4`;
      video.load();
    }
    if (visible) video.play().catch(() => {});
    else video.pause();
  }
  /* Shown only once a frame is really on screen, so the still is never
     replaced by an empty box */
  const onPlaying = () => {
    if (!video || clipOf < 0 || clipOn) return;
    const of = clipOf;
    const reveal = () => {
      if (dead || clipOf !== of || clipOn) return;
      clipOn = true;
      video.setAttribute("data-on", "");
    };
    const v = video as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };
    if (typeof v.requestVideoFrameCallback === "function") v.requestVideoFrameCallback(reveal);
    else reveal();
  };
  const onClipError = () => {
    if (clipOf < 0) return;
    clips[clipOf] = null; // keeps its still
    dropClip(false);
  };
  video?.addEventListener("playing", onPlaying);
  video?.addEventListener("error", onClipError);

  function begin(target: number) {
    dropClip(true);
    drawFit(target);
    const rnd = mulberry(Math.floor(Math.random() * 1e9));
    const strokes = Array.from({ length: STROKES }, (_, k) => makeStroke(k, rnd));
    const start = startPose(strokes[0]);
    const visible = root.classList.contains("pt-live");
    const from: Pose = { x: p.x, y: p.y, sc: p.sc, ang: p.ang, rad: p.rad };
    const dist = Math.hypot(start.x - from.x, start.y - from.y);
    job = {
      target,
      t: 0,
      strokes,
      done: strokes.map(() => 0),
      enter: visible ? clamp(0.3 + (dist / Math.max(W, 1)) * 0.3, 0.3, 0.5) : POP,
      pop: !visible,
      from,
      start,
      out: null,
      painting: false,
      committed: false,
      landed: false,
      turn: -1,
      grid: sampleGrid(),
    };
    if (!visible) {
      setPose(start);
      p.sc = 0.01;
      p.ang = -2.0;
      p.rad = 1.3;
      p.tint = [...BRISTLE];
      renderBot();
    }
    root.classList.add("pt-live");
    root.classList.remove("pt-idle");
    loadOthers();
    kick();
  }

  function blank() {
    dropClip(false);
    job = null;
    stop();
    shown = -1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearWet();
    root.classList.remove("pt-live", "pt-idle");
  }

  /* Bring the panel in line with what was asked for */
  function resolve() {
    if (dead || W < 2) return;
    if (!play) {
      if (job || shown !== -1 || root.classList.contains("pt-live")) blank();
      return;
    }
    if (job ? job.target === active : shown === active) return;
    // Not downloaded yet: whatever is on the canvas stays until it is
    if (!slots[active]?.img) {
      load(active);
      return;
    }
    begin(active);
  }

  function tick(now: number) {
    raf = 0;
    if (dead || !job) return;
    const dt = last ? Math.min(0.05, Math.max(0.001, (now - last) / 1000)) : 1 / 60;
    last = now;
    step(dt);
    if (job && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (raf || dead || !job || !onScreen || document.hidden) return;
    last = 0;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function measure() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    const d = Math.min(window.devicePixelRatio || 1, 2);
    if (w < 2 || h < 2 || (w === W && h === H && d === dpr)) return;
    const first = W === 0;
    W = w;
    H = h;
    dpr = d;
    bw = Math.max(30, W * 0.105);
    idleSc = clamp(30 / bw, 0.8, 1);
    for (const c of [canvas, wet, tmp, fit]) {
      c.width = Math.max(1, Math.round(W * dpr));
      c.height = Math.max(1, Math.round(H * dpr));
    }
    wetDirty = false;
    const size = 4.4 * bw;
    bot.style.width = `${size}px`;
    bot.style.height = `${size}px`;
    // A painting caught mid-stroke by a resize is simply finished
    if (job) {
      shown = job.target;
      job = null;
      stop();
    }
    if (shown >= 0) {
      drawShown();
      if (play) rest();
    }
    load(active);
    if (first) {
      // The other screenshots follow once the page itself has finished loading
      const later = () => {
        if (!dead) restTimer = window.setTimeout(loadOthers, 600);
      };
      if (document.readyState === "complete") later();
      else window.addEventListener("load", later, { once: true });
    }
    else for (let i = 0; i < slots.length; i++) if (slots[i].w) load(i, true);
    resolve();
  }

  const ro = new ResizeObserver(measure);
  ro.observe(root);
  const io = new IntersectionObserver(
    (entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
      root.classList.toggle("pt-paused", !onScreen);
      if (onScreen) kick();
      else stop();
      syncClip();
    },
    { rootMargin: "80px" }
  );
  io.observe(root);
  const onVisibility = () => {
    if (document.hidden) stop();
    else kick();
    syncClip();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    set(a, pl) {
      active = a;
      play = pl;
      if (W >= 2) load(active);
      resolve();
    },
    destroy() {
      dropClip(false);
      video?.removeEventListener("playing", onPlaying);
      video?.removeEventListener("error", onClipError);
      dead = true;
      stop();
      window.clearTimeout(restTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.classList.remove("pt-live", "pt-idle", "pt-paused");
    },
  };
}

let canvasSupport: boolean | null = null;
function hasCanvas() {
  if (canvasSupport === null) {
    try {
      canvasSupport =
        typeof Path2D !== "undefined" &&
        typeof ResizeObserver !== "undefined" &&
        typeof IntersectionObserver !== "undefined" &&
        !!document.createElement("canvas").getContext("2d");
    } catch {
      canvasSupport = false;
    }
  }
  return canvasSupport;
}
const noSubscribe = () => () => {};

export function PaintedPanel({
  projects,
  active,
  play,
  className,
}: {
  projects: PaintedProject[];
  active: number; // which project should be on the canvas
  play: boolean; // false: blank white panel. true: paint.
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const canvasOk = useSyncExternalStore(noSubscribe, hasCanvas, () => true);
  // A context can still be refused at mount (iOS caps total canvas memory)
  const [failed, setFailed] = useState(false);
  // No motion, or no canvas: the screenshots simply crossfade
  const simple = reduced || !canvasOk || failed;

  const rootRef = useRef<HTMLDivElement>(null);
  const painter = useRef<Painter | null>(null);
  const index = Math.round(clamp(active, 0, Math.max(0, projects.length - 1)));
  const srcKey = projects.map((p) => p.image).join("\n");

  useEffect(() => {
    const root = rootRef.current;
    if (simple || !root || !srcKey) return;
    const made = createPainter(root, srcKey.split("\n"));
    painter.current = made;
    if (!made) {
      setFailed(true);
      return;
    }
    return () => {
      made?.destroy();
      painter.current = null;
    };
  }, [simple, srcKey]);

  useEffect(() => {
    painter.current?.set(index, play);
  }, [index, play, simple, srcKey]);

  return (
    <div
      ref={rootRef}
      className={className ? `pt-panel ${className}` : "pt-panel"}
      role="img"
      aria-label={projects[index] ? `${projects[index].title} screenshot` : undefined}
    >
      {simple ? (
        projects.map((p, i) => (
          <Image
            key={p.image}
            src={p.image}
            alt=""
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 1160px"
            loading={i === index ? "eager" : "lazy"}
            fetchPriority={i === index ? "auto" : "low"}
            className="pt-shot"
            data-on={i === index ? "" : undefined}
          />
        ))
      ) : (
        <>
          <canvas className="pt-canvas" aria-hidden="true" />
          {/* The moving capture of the painted site. It has no src until the
              painter gives it one. */}
          <video
            className="pt-clip"
            muted
            loop
            playsInline
            preload="none"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            aria-hidden="true"
          />
          <canvas className="pt-wet" aria-hidden="true" />
          <Mark />
        </>
      )}
    </div>
  );
}

/* The Claude Code agent: the little pixel character from Claude Code, traced
   block for block and in Claude's own colour. It is only placed and leaned,
   never reshaped. The paths are in the source image's pixels (447 wide) and
   scaled so the character is 100 units wide and centred on the origin. */
const AGENT_BODY =
  "M56 93H391V205H447V260H391V318H363V372H335V318H307V372H279V318H168V372H140V318H112V372H84V318H56V260H0V205H56Z";
const AGENT_EYES = "M112 150H140V205H112ZM307 150H335V205H307Z";

function Mark() {
  return (
    <svg className="pt-bot" viewBox="-220 -220 440 440" aria-hidden="true" focusable="false">
      {/* brush: bristle tip at the origin, handle running back along -x */}
      <g data-pt="brush">
        <g className="pt-bob">
          <path d="M-52 -5.6 L-130 -7.8 A7.8 7.8 0 0 0 -130 7.8 L-52 5.6 Z" fill="#5266eb" />
          <path
            d="M-124 -3.1 L-62 -1.6"
            fill="none"
            stroke="#8f9cf5"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect x="-57" y="-21.5" width="18" height="43" rx="3.5" fill="#e6e8f0" />
          <path d="M-48 -21.5 V21.5" stroke="#b4b8c9" strokeWidth="2.2" />
          <path
            d="M-40 -19.5 L-13 -23 L-13 23 L-40 19.5 Z"
            fill="#f0deba"
            stroke="rgba(60,40,25,0.28)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            data-pt="tip"
            d="M-17 -23.2 L-5 -22.6 C0.5 -22 3.6 -17.5 3 -11.5 L1.6 -3.5 L4 4 L2.4 12 C2.6 18 0 21.8 -5.4 22.5 L-17 23.2 Z"
            fill="#f0deba"
            stroke="rgba(60,40,25,0.28)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M-36 -11 L-7 -12.5 M-37 0 L-5 0 M-36 11 L-7 12.5"
            fill="none"
            stroke="rgba(60,40,25,0.16)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </g>
      {/* the agent, over the end of the handle */}
      <g data-pt="body">
        <g className="pt-bob">
          <g transform="scale(0.22371) translate(-223.5 -232.5)">
            <path d={AGENT_BODY} fill={CORAL} />
            <path d={AGENT_EYES} fill="#1f1d1a" />
          </g>
        </g>
      </g>
    </svg>
  );
}
