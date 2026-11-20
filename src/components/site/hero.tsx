"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/app/content";
import overlook from "../../../public/hero/overlook.webp";
import { TabList, usePrefersReducedMotion } from "./shell";

/* The laptop display inside /hero/overlook.webp, as fractions of the image.
   Re-measure these if the photo is ever swapped. */
const SCREEN = { x: 0.4479, y: 0.6787, w: 0.0931, h: 0.0791 };
const IMG_RATIO = 3 / 2;
const ANCHOR_Y = 0.6; // how much of the vertical crop comes off the top
const NAV_H = 72;

type Rect = { x: number; y: number; w: number; h: number };

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ----------------------------------------------------------------
   Hero: a pinned stage whose scroll position drives one sequence.
   The camera pushes into the laptop in the photo, the laptop's screen
   (a real DOM panel, so it stays sharp) grows to fill the stage, then
   docks beside the list of apps I've built.
----------------------------------------------------------------- */
export function Hero() {
  const reduced = usePrefersReducedMotion();
  const router = useRouter();

  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const copyInnerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const leftInnerRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [active, setActive] = useState(0);
  const [docked, setDocked] = useState(false);
  const dockedRef = useRef(false);
  // The laptop screen fades in with the photo, so a slow connection never
  // shows a dark panel floating over the blurred preview.
  const [photoReady, setPhotoReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setPhotoReady(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const shot = shotRef.current;
    if (!wrap || !stage || !scene || !shot) return;

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
      if (!stage || !shot) return;
      W = stage.clientWidth;
      H = stage.clientHeight;
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
        const room = r0.y - 14 - copyInner.offsetTop;
        const s = clamp(room / copyInner.offsetHeight, 0.6, 1);
        copyInner.style.transform = s < 1 ? `scale(${s})` : "";
      }

      // Docked column: keep it inside the stage on short screens.
      const left = leftRef.current;
      const leftInner = leftInnerRef.current;
      const slot = slotRef.current;
      if (left && leftInner) {
        left.style.transform = "";
        leftInner.style.transform = "";
        const lr = left.getBoundingClientRect();
        const top = lr.top - st.top;
        const sideBySide = slot ? lr.left < slot.getBoundingClientRect().left - 1 : false;
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

    function apply() {
      if (!wrap || !scene || !shot) return;
      const total = wrap.offsetHeight - H;
      const p = reduced || total <= 0 ? 0 : clamp(-wrap.getBoundingClientRect().top / total);

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
      shot.style.transform = `translate3d(${x - r2.x}px, ${y - r2.y}px, 0) scale(${pw / r2.w}, ${ph / r2.h})`;
      shot.style.opacity = "1";

      const copy = copyRef.current;
      if (copy) {
        const o = 1 - clamp(p / 0.1);
        copy.style.opacity = String(o);
        copy.style.transform = `translate3d(0, ${-p * 120}px, 0)`;
        copy.style.pointerEvents = o > 0.5 ? "auto" : "none";
        // The headline stays readable to assistive tech; only the controls switch off
        if (formRef.current) formRef.current.inert = o < 0.5;
        if (noteRef.current) noteRef.current.style.opacity = String(o);
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(1 - clamp(p / 0.3));
      const left = leftRef.current;
      if (left) {
        left.style.opacity = String(d);
        left.style.transform = `translate3d(0, ${(1 - d) * 20}px, 0)`;
        left.style.pointerEvents = d > 0.9 ? "auto" : "none";
      }

      const isDocked = d > 0.98;
      if (isDocked !== dockedRef.current) {
        dockedRef.current = isDocked;
        setDocked(isDocked);
      }
    }

    function onResize() {
      measure();
      prepareZoomSource();
      apply();
    }

    // Keyboard users reach the app list by tabbing: bring it on screen for them.
    function onFocusIn() {
      if (reduced || !wrap || dockedRef.current) return;
      const end = wrap.getBoundingClientRect().top + window.scrollY + wrap.offsetHeight - H;
      window.scrollTo({ top: end, behavior: "instant" });
    }
    const leftEl = leftRef.current;
    leftEl?.addEventListener("focusin", onFocusIn);
    const photoEl = photoRef.current;
    photoEl?.addEventListener("load", prepareZoomSource);

    onResize();
    // Web fonts change the text metrics the fit logic depends on.
    document.fonts?.ready.then(onResize).catch(() => {});
    const settle = window.setTimeout(onResize, 400);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("pageshow", onResize);
    if (!reduced) window.addEventListener("scroll", apply, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("pageshow", onResize);
      window.removeEventListener("scroll", apply);
      leftEl?.removeEventListener("focusin", onFocusIn);
      photoEl?.removeEventListener("load", prepareZoomSource);
    };
  }, [reduced]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    try {
      if (email) sessionStorage.setItem("zk-email", email);
    } catch {
      // Private mode: the contact form just starts empty.
    }
    router.push("/contact");
  }

  return (
    <>
      {/* Without JavaScript there is no scroll sequence, so don't reserve room for it */}
      <noscript>
        <style>{`#top{height:auto!important}`}</style>
      </noscript>

      <section
        ref={wrapRef}
        id="top"
        data-section-theme="dark"
        className={`relative ${
          reduced ? "" : "h-[calc(100svh+1100px)] md:h-[calc(100svh+1500px)]"
        }`}
      >
        <div
          ref={stageRef}
          className={`m-th top-0 h-[100svh] min-h-[320px] w-full overflow-hidden bg-[var(--bg)] text-[var(--fg)] ${
            reduced ? "relative" : "sticky"
          }`}
        >
          {/* Photo */}
          <div ref={sceneRef} className="absolute inset-0" aria-hidden>
            <div
              className="absolute left-1/2 aspect-[3/2] w-[max(100vw,150svh)] -translate-x-1/2 bg-[#8a7f93]"
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

          {/* Dusk tint so the headline reads over the sky */}
          <div
            ref={shadeRef}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(23,23,33,0.62) 0%, rgba(23,23,33,0.34) 34%, rgba(23,23,33,0.08) 62%, rgba(23,23,33,0.3) 100%)",
            }}
          />

          {/* Headline. First in the markup so it reads before the app list. */}
          <div
            ref={copyRef}
            className="m-hero-copy absolute inset-x-0 top-0 z-[3] px-6 text-center text-[#ededf3]"
          >
            <div ref={copyInnerRef} className="origin-top">
              <h1 className="m-h1 mx-auto max-w-[760px] text-balance">Your idea is the limit</h1>
              <p className="m-hero-sub mx-auto mt-3 max-w-[560px] text-[17px] leading-[1.35] text-[#ededf3] sm:text-[20px]">
                One-on-one sessions where your high schooler builds and launches
                a real web or iOS app, and learns AI skills like automations and
                MCP servers along the way.
              </p>
              <form
                ref={formRef}
                onSubmit={onSubmit}
                className="m-hero-form mx-auto mt-7 flex max-w-[520px] flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center"
              >
                <div className="flex h-10 items-center rounded-full bg-[rgba(120,118,150,0.5)] pl-5 transition-colors duration-300 focus-within:bg-[rgba(120,118,150,0.62)]">
                  <label htmlFor="hero-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="hero-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Your email"
                    className="m-hero-input h-full min-w-0 flex-1 bg-transparent text-[16px] text-[#ededf3] outline-none placeholder:text-[#ededf3]/80 sm:w-[170px] sm:flex-none"
                  />
                  <button type="submit" className="m-btn m-btn-primary shrink-0">
                    Book a session
                  </button>
                </div>
                <a
                  href="#pricing"
                  className="m-btn shrink-0 bg-[rgba(120,118,150,0.5)] text-[#ededf3] hover:bg-[rgba(120,118,150,0.62)]"
                >
                  See pricing
                </a>
              </form>
            </div>
          </div>

          {/* Docked layout: list of apps on the left, panel slot on the right */}
          {!reduced && (
            <div className="m-dock">
              <div className="m-wrap m-dock-grid">
                <div ref={slotRef} className="m-dock-slot" />
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
          )}

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
              <AppPanel active={active} loadAll={photoReady} />
            </div>
          </div>

          <p
            ref={noteRef}
            className="m-hero-note pointer-events-none absolute inset-x-0 bottom-6 mx-auto w-fit max-w-[calc(100vw-32px)] rounded-lg bg-[rgba(23,23,33,0.8)] px-4 py-2.5 text-center text-[12px] leading-[1.35] tracking-[0.02em] text-[#ededf3] sm:text-[13px]"
          >
            In person in Chappaqua and Westchester, or over Zoom year-round.
          </p>
        </div>

        {/* #work lands on the end of the sequence, with the panel docked */}
        {!reduced && (
          <div id="work" className="pointer-events-none absolute bottom-0 h-[100svh] w-px" />
        )}
      </section>

      {/* Without motion, the same content is a plain section */}
      {reduced && (
        <section id="work" data-section-theme="dark" className="scroll-mt-[72px] py-24">
          <div className="m-wrap grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
            <div className="relative aspect-[16/10] w-full lg:order-2">
              <AppPanel active={active} />
            </div>
            <div className="lg:order-1">
              <BuiltColumn active={active} onSelect={setActive} auto={false} />
            </div>
          </div>
        </section>
      )}
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
      <p className="m-th m-hide-short mt-2 max-w-[400px] text-[16px] leading-[1.4] text-[var(--muted)] max-lg:hidden">
        Everything here was built with the same tools your student will use.
      </p>
      <div className="m-dock-tabs mt-5 lg:mt-8">
        <TabList
          active={active}
          onSelect={onSelect}
          auto={auto}
          duration={7}
          items={PROJECTS.map((p) => ({
            key: p.title,
            title: p.title,
            body: (
              <>
                <span className="m-dock-blurb line-clamp-3 lg:line-clamp-none">{p.blurb}</span>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-focus m-th m-hide-shorter mt-2 inline-block rounded text-[var(--fg)] underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current max-lg:hidden"
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

/* The app screen: crossfades between the real screenshots. The first loads
   with the page; the rest follow as soon as the hero photo is in, so switching
   apps never shows an empty panel and nothing competes with the first paint. */
function AppPanel({ active, loadAll = true }: { active: number; loadAll?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl bg-[#272735] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
      {PROJECTS.map((p, i) =>
        i === 0 || i === active || loadAll ? (
          <Image
            key={p.image}
            src={p.image}
            alt={i === active ? `${p.title} screenshot` : ""}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 1160px"
            loading="eager"
            fetchPriority={i === 0 ? "auto" : "low"}
            className="object-cover object-top transition-opacity duration-500 ease-[cubic-bezier(0,0,0.2,1)]"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ) : null
      )}
    </div>
  );
}
