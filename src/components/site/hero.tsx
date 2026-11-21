"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/app/content";
import overlook from "../../../public/hero/overlook.webp";
import { HeroChat } from "./hero-chat";
import { PaintedPanel } from "./painter";
import { TabList, usePrefersReducedMotion } from "./shell";

/* The laptop display inside /hero/overlook.webp, as fractions of the image.
   The dark lid in the photo spans x 1463-1609, y 1309-1401 (of 3072 x 2048);
   the display sits inside it, so the photo's own lid shows around it as the
   bezel. Re-measure these if the photo is ever swapped. */
const SCREEN = { x: 1466.5 / 3072, y: 1312 / 2048, w: 139 / 3072, h: 84.5 / 2048 };
// The share of the push over which the screen's glare and dimming ease away
const FX_FADE = 0.45;
const IMG_RATIO = 3 / 2;
const ANCHOR_Y = 0.6; // how much of the vertical crop comes off the top
const NAV_H = 72;
// Remembered for the tab, so a reload part-way down the page comes back settled
const DONE_KEY = "zk-hero-done";
const Y_KEY = "zk-hero-y";
// True once the sequence has played in this document, so coming back to the
// homepage from another page finds it settled, where the reader left it.
let playedHere = false;

type Rect = { x: number; y: number; w: number; h: number };

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ----------------------------------------------------------------
   Hero: a pinned stage whose scroll position drives one sequence.
   The camera pushes into the laptop in the photo, the laptop's screen
   (a real DOM panel, so it stays sharp) grows to fill the stage, then
   docks beside the list of apps I've built.

   The sequence plays once. When it ends the section turns into two
   ordinary screens, the photo and then the app list, and stays that
   way until the page is reloaded.
----------------------------------------------------------------- */
export function Hero() {
  const reduced = usePrefersReducedMotion();

  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const copyInnerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const leftInnerRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const coverLogoRef = useRef<HTMLImageElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [docked, setDocked] = useState(false);
  const dockedRef = useRef(false);
  // Once the panel has docked the painter keeps going, even if the reader scrolls back
  const [painting, setPainting] = useState(false);
  const [done, setDone] = useState(() => playedHere);
  const doneRef = useRef(playedHere);
  // The laptop screen fades in with the photo, so a slow connection never
  // shows a white panel floating over the blurred preview.
  const [photoReady, setPhotoReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setPhotoReady(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const view = viewRef.current;
    const scene = sceneRef.current;
    const shot = shotRef.current;
    if (!wrap || !stage || !view || !scene || !shot) return;

    let W = 0;
    let H = 0;
    let r0: Rect = { x: 0, y: 0, w: 1, h: 1 }; // laptop screen in the photo
    let r1: Rect = r0; // full view
    let r2: Rect = r0; // docked slot
    let box: Rect = r0; // where the photo sits when it covers the stage
    // A plain copy of whichever photo file the browser picked. The on-page
    // <img> uses srcset, whose reported size is density-adjusted; this copy
    // reports real pixels, which is what canvas cropping needs.
    let zoomSource: HTMLImageElement | null = null;

    const isStill = () => reduced || doneRef.current;

    function prepareZoomSource() {
      const photo = photoRef.current;
      const src = photo?.currentSrc;
      if (!src || zoomSource?.src === src) return;
      const copy = new window.Image();
      copy.decoding = "async";
      copy.onload = () => {
        zoomSource = copy;
        apply();
      };
      copy.src = src; // already in the cache, so this costs no download
    }

    function measure() {
      if (!stage || !view || !shot) return;
      W = view.clientWidth;
      H = view.clientHeight;
      const st = stage.getBoundingClientRect();

      // The photo covers the stage (see the CSS on the scene box).
      const bw = Math.max(W, H * IMG_RATIO);
      const bh = bw / IMG_RATIO;
      const bx = (W - bw) / 2;
      const by = (H - bh) * ANCHOR_Y;
      box = { x: bx, y: by, w: bw, h: bh };
      r0 = {
        x: bx + SCREEN.x * bw,
        y: by + SCREEN.y * bh,
        w: SCREEN.w * bw,
        h: SCREEN.h * bh,
      };
      const laptop = laptopRef.current;
      if (laptop) {
        laptop.style.left = `${r0.x}px`;
        laptop.style.top = `${r0.y}px`;
        laptop.style.width = `${r0.w}px`;
        laptop.style.height = `${r0.h}px`;
      }

      // The zoom is painted on a canvas exactly the size of the stage.
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw = Math.max(1, Math.round(W * dpr));
        const ch = Math.max(1, Math.round(H * dpr));
        if (canvas.width !== cw || canvas.height !== ch) {
          canvas.width = cw;
          canvas.height = ch;
        }
      }

      const availH = H - NAV_H - 56;
      const fw = Math.max(120, Math.min(W - 48, 1160, availH * 1.6));
      const fh = fw / 1.6;
      r1 = { x: (W - fw) / 2, y: NAV_H + 16 + (availH - fh) / 2, w: fw, h: fh };

      // Headline block: shrink it if the screen is too short to clear the laptop.
      const copyInner = copyInnerRef.current;
      if (copyInner) {
        copyInner.style.transform = "";
        const room = r0.y - 16 - copyInner.offsetTop;
        const s = clamp(room / copyInner.offsetHeight, 0.6, 1);
        copyInner.style.transform = s < 1 ? `scale(${s})` : "";
        // The soft blur behind the headline follows the block's real size
        const haze = hazeRef.current;
        if (haze) {
          const cr = copyInner.getBoundingClientRect();
          const padX = Math.min(120, W * 0.12);
          haze.style.left = `${cr.left - st.left - padX}px`;
          haze.style.top = `${cr.top - st.top - 40}px`;
          haze.style.width = `${cr.width + padX * 2}px`;
          haze.style.height = `${cr.height + 84}px`;
        }
      }

      // Docked column: keep it inside its screen on short displays.
      const left = leftRef.current;
      const leftInner = leftInnerRef.current;
      const slot = slotRef.current;
      const dock = dockRef.current;
      if (left && leftInner && dock) {
        left.style.transform = "";
        leftInner.style.transform = "";
        const lr = left.getBoundingClientRect();
        const top = lr.top - dock.getBoundingClientRect().top;
        // Same condition as the side-by-side rule in globals.css
        const sideBySide = window.matchMedia(
          "(min-width: 1024px), (orientation: landscape) and (max-height: 560px) and (min-width: 480px)"
        ).matches;
        const minTop = NAV_H + 8;
        const maxBottom = H - 10;
        if (sideBySide) {
          const s = clamp((maxBottom - minTop) / lr.height, 0.55, 1);
          leftInner.style.transformOrigin = "left center";
          leftInner.style.transform = s < 1 ? `scale(${s})` : "";
        } else if (top + lr.height > maxBottom) {
          const s = clamp((maxBottom - top) / lr.height, 0.55, 1);
          leftInner.style.transformOrigin = "left top";
          leftInner.style.transform = s < 1 ? `scale(${s})` : "";
        }
      }

      if (slot) {
        const sl = slot.getBoundingClientRect();
        r2 = { x: sl.left - st.left, y: sl.top - st.top, w: sl.width, h: sl.height };
      } else {
        r2 = { x: 0, y: 0, w: 800, h: 500 };
      }
      shot.style.left = `${r2.x}px`;
      shot.style.top = `${r2.y}px`;
      shot.style.width = `${r2.w}px`;
      shot.style.height = `${r2.h}px`;
    }

    function setDockedState(v: boolean) {
      if (v === dockedRef.current) return;
      dockedRef.current = v;
      setDocked(v);
      if (v) setPainting(true);
    }

    // The resting layout: photo and headline on one screen, the app list and
    // its panel on the next. Used after the sequence has played, and from the
    // start for readers who ask for reduced motion.
    function applyStill() {
      if (!scene || !shot) return;
      const canvas = canvasRef.current;
      if (canvas) canvas.style.visibility = "hidden";
      scene.style.visibility = "visible";
      scene.style.opacity = "1";
      shot.style.transform = "none";
      shot.style.opacity = "1";
      const copy = copyRef.current;
      if (copy) {
        copy.style.opacity = "1";
        copy.style.transform = "none";
        copy.style.pointerEvents = "auto";
      }
      if (ctaRef.current) ctaRef.current.inert = false;
      if (shadeRef.current) shadeRef.current.style.opacity = "1";
      if (hazeRef.current) {
        hazeRef.current.style.display = "";
        hazeRef.current.style.opacity = "1";
      }
      const left = leftRef.current;
      if (left) {
        left.style.opacity = "1";
        left.style.transform = "none";
        left.style.pointerEvents = "auto";
      }
      if (coverRef.current) coverRef.current.style.opacity = "0";
      if (fxRef.current) fxRef.current.style.opacity = "0";
      if (laptopRef.current) laptopRef.current.style.opacity = "1";
      setDockedState(true);
    }

    function apply() {
      if (!wrap || !scene || !shot) return;
      if (isStill()) {
        applyStill();
        return;
      }
      const total = wrap.offsetHeight - H;
      const p = total <= 0 ? 0 : clamp(-wrap.getBoundingClientRect().top / total);

      const z = ease(clamp((p - 0.03) / 0.55)); // push into the laptop
      const d = ease(clamp((p - 0.66) / 0.24)); // dock beside the list

      // Zoom: grow exponentially so the push feels like a constant-speed camera.
      const w = r0.w * Math.pow(r1.w / r0.w, z);
      const f = (w - r0.w) / (r1.w - r0.w || 1);
      const c0x = r0.x + r0.w / 2;
      const c0y = r0.y + r0.h / 2;
      const cx = lerp(c0x, r1.x + r1.w / 2, f);
      const cy = lerp(c0y, r1.y + r1.h / 2, f);
      const h = w * lerp(r0.h / r0.w, r1.h / r1.w, z);

      // The push into the laptop. Scaling the photo itself would hand the GPU a
      // layer many screens wide, so the zoomed view is drawn onto a canvas the
      // size of the stage instead: the visible crop of the photo, nothing more.
      const sceneOpacity = 1 - clamp((z - 0.7) / 0.3);
      const canvas = canvasRef.current;
      const photo = zoomSource;
      const photoReady = !!photo && photo.complete && photo.naturalWidth > 0;
      const zooming = z > 0.0005;
      if (canvas && zooming && photoReady && sceneOpacity > 0) {
        const s = w / r0.w;
        const tx = cx - c0x;
        const ty = cy - c0y;
        // Stage point v shows photo-box point q:  v = c0 + (q - c0) * s + t
        const qx = c0x + (0 - tx - c0x) / s;
        const qy = c0y + (0 - ty - c0y) / s;
        const iw = photo.naturalWidth;
        const ih = photo.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingQuality = "high";
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            photo,
            ((qx - box.x) / box.w) * iw,
            ((qy - box.y) / box.h) * ih,
            (W / s / box.w) * iw,
            (H / s / box.h) * ih,
            0,
            0,
            canvas.width,
            canvas.height
          );
        }
        canvas.style.opacity = String(sceneOpacity);
        canvas.style.visibility = "visible";
        scene.style.visibility = "hidden";
      } else {
        if (canvas) canvas.style.visibility = "hidden";
        // At rest, or if the photo hasn't arrived yet, the plain image shows.
        scene.style.visibility = !zooming || !photoReady ? "visible" : "hidden";
        scene.style.opacity = String(zooming ? sceneOpacity : 1);
      }

      // Panel: follows the laptop screen, then eases into its slot.
      const x = lerp(cx - w / 2, r2.x, d);
      const y = lerp(cy - h / 2, r2.y, d);
      const pw = lerp(w, r2.w, d);
      const ph = lerp(h, r2.h, d);
      const sx = pw / r2.w;
      const sy = ph / r2.h;
      shot.style.transform = `translate3d(${x - r2.x}px, ${y - r2.y}px, 0) scale(${sx}, ${sy})`;
      shot.style.opacity = "1";
      // The white screen with the logo on it gives way to the painted panel as
      // it docks. The panel changes shape on the way, so the logo is scaled
      // back the other way to keep its proportions.
      if (coverRef.current) coverRef.current.style.opacity = String(1 - clamp((d - 0.5) / 0.45));
      if (coverLogoRef.current) coverLogoRef.current.style.transform = `scale(1, ${sx / sy})`;
      // In the photo it is a lit display under an evening sky; that light
      // eases away as the camera closes in, leaving a clean panel.
      if (fxRef.current) fxRef.current.style.opacity = String(1 - ease(clamp(z / FX_FADE)));
      if (laptopRef.current) laptopRef.current.style.opacity = "0";

      const copy = copyRef.current;
      const o = 1 - clamp(p / 0.1);
      if (copy) {
        copy.style.opacity = String(o);
        copy.style.transform = `translate3d(0, ${-p * 120}px, 0)`;
        copy.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
      // The headline stays readable to assistive tech; only the link switches off
      if (ctaRef.current) ctaRef.current.inert = o < 0.5;
      const haze = hazeRef.current;
      if (haze) {
        haze.style.display = o <= 0 ? "none" : "";
        haze.style.opacity = String(o);
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(1 - clamp(p / 0.3));
      const left = leftRef.current;
      if (left) {
        left.style.opacity = String(d);
        left.style.transform = `translate3d(0, ${(1 - d) * 20}px, 0)`;
        left.style.pointerEvents = d > 0.9 ? "auto" : "none";
      }

      setDockedState(d > 0.98);
      if (p >= 0.999) settle("end");
    }

    // Turn the sequence into two ordinary screens, keeping whatever the reader
    // is looking at where it is.
    function settle(where: "end" | "link" | "focus" | "restore") {
      if (!wrap || isStill()) return;
      const before = wrap.getBoundingClientRect();
      const y = window.scrollY;
      const docTop = before.top + y;
      const total = wrap.offsetHeight - H;
      const scrolled = -before.top;

      doneRef.current = true;
      playedHere = true;
      wrap.setAttribute("data-done", "");
      measure();
      applyStill();

      try {
        sessionStorage.setItem(DONE_KEY, "1");
      } catch {
        // Private mode: a reload simply plays the sequence again.
      }
      let target = y;
      if (where === "restore") target = y;
      else if (where === "focus") target = docTop + H;
      else if (scrolled >= total) target = y - (total - H); // past the end: nothing below moves
      else if (scrolled > total * 0.5) target = docTop + H; // most of the way: land on the app list
      else if (scrolled > 0) target = docTop; // barely started: back to the photo
      if (Math.abs(target - y) > 0.5) window.scrollTo({ top: target, behavior: "instant" });
      setDone(true);
    }

    function onResize() {
      measure();
      if (!isStill()) prepareZoomSource();
      apply();
    }

    // Keyboard users reach the app list by tabbing: bring it on screen for them.
    function onFocusIn() {
      if (!reduced) settle("focus");
    }
    // A jump to another section must not be cut short by the switch above, so
    // make the switch first and let the browser scroll the settled page.
    function onLinkClick(e: MouseEvent) {
      if (isStill()) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (link?.getAttribute("href")?.includes("#")) settle("link");
    }
    // Same for the End key, which scrolls smoothly to the bottom of the page.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "End" || (e.key === "ArrowDown" && e.metaKey)) settle("link");
    }
    const leftEl = leftRef.current;
    leftEl?.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("click", onLinkClick, true);
    const photoEl = photoRef.current;
    photoEl?.addEventListener("load", prepareZoomSource);

    // A visit that opens on a named section: hold that section in place while
    // fonts and images finish moving things, until the reader takes over.
    let hashTarget: HTMLElement | null = null;
    const holdHash = () => hashTarget?.scrollIntoView({ behavior: "instant", block: "start" });
    const releaseHash = () => {
      hashTarget = null;
    };
    for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
      window.addEventListener(type, releaseHash, { passive: true, once: true });
    }

    measure();
    if (!isStill()) {
      // Arriving part-way down the page: start settled, so the position the
      // browser restores (or the section named in the address) is the right one.
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const returning = nav?.type === "reload" || nav?.type === "back_forward";
      let wasDone = false;
      try {
        wasDone = sessionStorage.getItem(DONE_KEY) === "1" && Number(sessionStorage.getItem(Y_KEY)) > 4;
      } catch {
        wasDone = false;
      }
      const hash = window.location.hash.slice(1);
      const target = hash && hash !== "top" ? document.getElementById(hash) : null;
      if (returning && wasDone) settle("restore");
      else if (target && !returning) {
        settle("restore");
        target.scrollIntoView({ behavior: "instant", block: "start" });
        hashTarget = target;
      } else {
        try {
          sessionStorage.removeItem(DONE_KEY);
        } catch {
          // nothing to clear
        }
      }
    }
    onResize();
    const onPageHide = () => {
      try {
        sessionStorage.setItem(Y_KEY, String(Math.round(window.scrollY)));
      } catch {
        // Private mode
      }
    };
    window.addEventListener("pagehide", onPageHide);
    // Web fonts change the text metrics the fit logic depends on.
    const refit = () => {
      onResize();
      holdHash();
    };
    document.fonts?.ready.then(refit).catch(() => {});
    const settleTimer = window.setTimeout(refit, 400);
    const hashTimer = window.setTimeout(() => {
      holdHash();
      releaseHash();
    }, 1500);
    // The stacked panel is sized against the app list, so follow the list's height
    const colWatch = new ResizeObserver(() => {
      measure();
      apply();
    });
    if (leftInnerRef.current) colWatch.observe(leftInnerRef.current);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("pageshow", onResize);
    window.addEventListener("scroll", apply, { passive: true });
    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(hashTimer);
      colWatch.disconnect();
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.removeEventListener(type, releaseHash);
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("pageshow", onResize);
      window.removeEventListener("scroll", apply);
      window.removeEventListener("pagehide", onPageHide);
      leftEl?.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onLinkClick, true);
      document.removeEventListener("keydown", onKeyDown, true);
      photoEl?.removeEventListener("load", prepareZoomSource);
    };
  }, [reduced]);

  return (
    <>
      {/* Without JavaScript there is no sequence: show the two screens as they end up */}
      <noscript>
        <style>{`#top{height:auto!important}#top .m-hero-stage{position:relative!important;height:200svh!important}#top .m-dock{top:100svh!important}#top .m-dock-col{opacity:1!important;pointer-events:auto!important}`}</style>
      </noscript>

      <section
        ref={wrapRef}
        id="top"
        data-section-theme="dark"
        data-done={done || reduced ? "" : undefined}
        className="m-hero relative"
      >
        <div ref={stageRef} className="m-hero-stage m-th w-full bg-[var(--bg)] text-[var(--fg)]">
          <div ref={viewRef} className="m-hero-view">
            {/* Photo */}
            <div ref={sceneRef} className="absolute inset-0" aria-hidden>
              <div
                className="absolute left-1/2 aspect-[3/2] w-[max(100vw,150svh)] -translate-x-1/2 bg-[#b9a9c4]"
                style={{ top: `calc((100svh - max(100vw, 150svh) / 1.5) * ${ANCHOR_Y})` }}
              >
                <Image
                  ref={photoRef}
                  src={overlook}
                  alt=""
                  fill
                  preload
                  placeholder="blur"
                  onLoad={() => setPhotoReady(true)}
                  sizes="(max-width: 640px) 80vh, (max-aspect-ratio: 3/2) 150vh, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* The zoomed view of the photo, painted while the camera pushes in */}
            <canvas
              ref={canvasRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ visibility: "hidden" }}
            />

            {/* Dusk tint so the headline reads, and edges that fall away into the page */}
            <div ref={shadeRef} aria-hidden className="m-hero-shade pointer-events-none absolute inset-0" />
            {/* A soft, feathered blur behind the headline */}
            <div ref={hazeRef} aria-hidden className="m-hero-haze pointer-events-none absolute" />

            {/* The laptop's own screen, for when the panel has moved on to the app list */}
            <div
              ref={laptopRef}
              aria-hidden
              className="absolute grid place-items-center overflow-hidden rounded-[1px] bg-white"
              style={{ opacity: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero/common-app.svg" alt="" className="w-[52%]" />
              <div className="m-screen-fx absolute inset-0" />
            </div>

            {/* Headline. First in the markup so it reads before the app list. */}
            <div
              ref={copyRef}
              className="m-hero-copy absolute inset-x-0 top-0 z-[3] px-4 text-center text-[#ededf3] sm:px-6"
            >
              <div ref={copyInnerRef} className="origin-top">
                <h1 className="m-h1 mx-auto max-w-[760px] text-balance">Your ambition is the limit</h1>
                <p className="m-hero-sub mx-auto mt-3 max-w-[520px] text-balance text-[17px] leading-[1.35] text-[#ededf3] sm:text-[20px]">
                  One-on-one sessions where your high schooler builds and
                  launches a real online business.
                </p>
                <div ref={ctaRef} className="m-hero-cta">
                  <HeroChat />
                </div>
              </div>
            </div>
          </div>

          {/* The app list on the left, the panel's slot on the right */}
          <div ref={dockRef} className="m-dock">
            <div className="m-wrap m-dock-grid">
              <div className="m-dock-slot">
                <div ref={slotRef} className="m-dock-slot-box">
                <noscript>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PROJECTS[0].image}
                    alt={`${PROJECTS[0].title} screenshot`}
                    className="h-full w-full rounded-xl object-cover object-top"
                  />
                </noscript>
                </div>
              </div>
              <div
                ref={leftRef}
                className="m-dock-col"
                style={{ opacity: 0, pointerEvents: "none" }}
              >
                <div ref={leftInnerRef}>
                  <BuiltColumn active={active} onSelect={setActive} auto={docked} />
                </div>
              </div>
            </div>
          </div>

          {/* The laptop screen. One element for the whole sequence. */}
          <div
            ref={shotRef}
            className="absolute origin-top-left"
            style={{ opacity: 0 }}
            aria-hidden={!docked}
          >
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: photoReady || docked ? 1 : 0 }}
            >
              <PaintedPanel projects={PROJECTS} active={active} play={painting} />
              {/* What the laptop shows before the painter starts */}
              <div
                ref={coverRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden rounded-xl bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={coverLogoRef} src="/hero/common-app.svg" alt="" className="w-[52%]" />
              </div>
              {/* The light of the scene on the display: dimming, a warm cast, a streak of glare */}
              <div
                ref={fxRef}
                aria-hidden
                className="m-screen-fx pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* #work lands on the second screen, the app list */}
        <div id="work" className="pointer-events-none absolute bottom-0 h-[100svh] w-px" />
      </section>
    </>
  );
}

function BuiltColumn({
  active,
  onSelect,
  auto,
}: {
  active: number;
  onSelect: (i: number) => void;
  auto: boolean;
}) {
  return (
    <div>
      <h2 className="m-dock-title max-w-[400px] text-[22px] font-[480] leading-[1.25] sm:text-[24px]">
        I build with these tools every day.
      </h2>
      <div className="m-dock-tabs mt-5 lg:mt-8">
        <TabList
          active={active}
          onSelect={onSelect}
          auto={auto}
          duration={8}
          items={PROJECTS.map((p) => ({
            key: p.title,
            title: p.short ? (
              <>
                <span className="m-dock-long">{p.title}</span>
                <span className="m-dock-short">{p.short}</span>
              </>
            ) : (
              p.title
            ),
            body: (
              <>
                <span className="m-dock-blurb block">{p.blurb}</span>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-dock-link m-focus m-th mt-2 inline-block rounded text-[var(--fg)] underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current"
                >
                  Visit {p.url}
                </a>
              </>
            ),
          }))}
        />
      </div>
      <Link
        href="/contact"
        className="m-focus m-hide-short mt-4 inline-block rounded text-[16px] font-[480] underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current max-lg:hidden"
      >
        Book a session
      </Link>
    </div>
  );
}
