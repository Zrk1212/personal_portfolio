import type { CSSProperties, ReactNode } from "react";

/* Small wireframe drawings for the five Sessions steps.
   Drawn on a 200 x 150 grid, in the site palette, on the #383b4b panel.
   Decoration only: the wrapper sets aria-hidden. */

const IND = "#5266eb";
const LAV = "#8f9cf5";
const INK = "#171721";
const GREEN = "#4fd18b";
const LINE = "rgba(255,255,255,0.34)"; // neutral strokes
const BAR = "rgba(255,255,255,0.16)"; // quiet text bars
const BAR2 = "rgba(255,255,255,0.3)"; // stronger text bars
const HEAD = "rgba(255,255,255,0.62)"; // headline bars

/** Delay for a staggered piece of the draw-in */
const at = (ms: number) => ({ "--sa-delay": `${ms}ms` }) as CSSProperties;

/** Dark backing plus a frame that draws itself in */
function Frame({ x, y, w, h, r, stroke = LINE, delay = 0 }: {
  x: number; y: number; w: number; h: number; r: number; stroke?: string; delay?: number;
}) {
  return (
    <>
      <rect className="sa-f" style={at(delay)} x={x} y={y} width={w} height={h} rx={r} fill={INK} fillOpacity={0.94} />
      <rect className="sa-d sa-s" style={at(delay)} pathLength={100} x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={stroke} />
    </>
  );
}

/** A stroked box that draws in, with an optional tint that fades in under it */
function Box({ x, y, w, h, r, stroke, tint, tintOpacity = 0.1, delay, strong = false }: {
  x: number; y: number; w: number; h: number; r: number; stroke: string;
  tint?: string; tintOpacity?: number; delay: number; strong?: boolean;
}) {
  return (
    <>
      {tint && (
        <rect className="sa-fl" style={at(delay + 150)} x={x} y={y} width={w} height={h} rx={r} fill={tint} fillOpacity={tintOpacity} />
      )}
      <rect
        className={`sa-d ${strong ? "sa-s2" : "sa-s"}`}
        style={at(delay)}
        pathLength={100}
        x={x} y={y} width={w} height={h} rx={r}
        fill="none" stroke={stroke}
      />
    </>
  );
}

function Bar({ x, y, w, h = 4, fill = BAR, delay }: { x: number; y: number; w: number; h?: number; fill?: string; delay: number }) {
  return <rect className="sa-f" style={at(delay)} x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />;
}

function BrowserDots({ y, delay }: { y: number; delay: number }) {
  return (
    <g className="sa-f" style={at(delay)}>
      <circle cx={18} cy={y} r={2.4} fill={BAR2} />
      <circle cx={26} cy={y} r={2.4} fill={BAR2} />
      <circle cx={34} cy={y} r={2.4} fill={BAR2} />
    </g>
  );
}

/* 01 Business model: a one-page canvas with three labelled boxes */
function ArtModel() {
  return (
    <>
      <Frame x={6} y={4} w={188} h={142} r={10} />
      <Bar x={20} y={17} w={54} h={6} fill={HEAD} delay={140} />
      <Bar x={80} y={17} w={22} h={6} delay={180} />

      {/* Who it's for */}
      <Box x={20} y={33} w={76} h={55} r={7} stroke={LAV} tint={LAV} tintOpacity={0.07} delay={180} />
      <g className="sa-f" style={at(380)}>
        <circle className="sa-s" cx={34} cy={47} r={4.5} fill="none" stroke={LAV} />
        <path className="sa-s" d="M26.5 59.5 a7.5 6.5 0 0 1 15 0" fill="none" stroke={LAV} />
      </g>
      <Bar x={28} y={68} w={54} fill={BAR2} delay={420} />
      <Bar x={28} y={76} w={36} delay={450} />

      {/* The problem */}
      <Box x={104} y={33} w={76} h={55} r={7} stroke={LAV} tint={LAV} tintOpacity={0.07} delay={260} />
      <g className="sa-f" style={at(460)}>
        <circle className="sa-s" cx={118} cy={50} r={6.5} fill="none" stroke={LAV} />
        <path className="sa-s" d="M118 46.6 V50.6" fill="none" stroke={LAV} />
        <circle cx={118} cy={53.6} r={1} fill={LAV} />
      </g>
      <Bar x={112} y={68} w={54} fill={BAR2} delay={500} />
      <Bar x={112} y={76} w={30} delay={530} />

      {/* How it makes money */}
      <Box x={20} y={96} w={160} h={38} r={7} stroke={IND} tint={IND} tintOpacity={0.16} delay={340} strong />
      <rect className="sa-f" style={at(540)} x={31} y={118} width={5} height={8} rx={1.5} fill={IND} />
      <rect className="sa-f" style={at(590)} x={39} y={112} width={5} height={14} rx={1.5} fill={IND} />
      <rect className="sa-f" style={at(640)} x={47} y={105} width={5} height={21} rx={1.5} fill={LAV} />
      <Bar x={64} y={107} w={76} fill={BAR2} delay={600} />
      <Bar x={64} y={117} w={44} delay={640} />
      <g className="sa-f" style={at(700)}>
        <rect className="sa-blink" x={112} y={115} width={1.6} height={8} rx={0.8} fill={LAV} />
      </g>
    </>
  );
}

/* 02 PRD and design: a PRD page beside three site thumbnails, one picked */
function ArtPrd() {
  const lines: [number, number, string][] = [
    [40, 74, BAR2], [49, 62, BAR], [58, 70, BAR],
    [73, 48, BAR2], [82, 72, BAR], [91, 58, BAR], [100, 66, BAR],
    [115, 42, BAR2], [124, 70, BAR], [133, 52, BAR],
  ];
  return (
    <>
      {/* PRD page */}
      <Frame x={6} y={4} w={100} h={142} r={9} />
      <path
        className="sa-f"
        style={at(120)}
        d="M6.75 28 V13 a8.25 8.25 0 0 1 8.25 -8.25 H97 a8.25 8.25 0 0 1 8.25 8.25 V28 Z"
        fill={LAV}
        fillOpacity={0.16}
      />
      <g className="sa-lbl sa-f" style={at(180)}>
        <text className="sa-txt" x={16} y={20.6} fontSize={12} fill={LAV}>PRD</text>
        <rect x={46} y={13.5} width={32} height={5} rx={2.5} fill={LAV} fillOpacity={0.45} />
      </g>
      <g className="sa-lblalt sa-f" style={at(180)}>
        <rect x={16} y={13} width={44} height={6} rx={3} fill={LAV} fillOpacity={0.75} />
      </g>
      {lines.map(([y, w, fill], i) => (
        <Bar key={y} x={16} y={y} w={w} fill={fill} delay={200 + i * 30} />
      ))}

      {/* Three looks to choose from */}
      <g className="sa-f" style={at(300)}>
        <rect x={118} y={4} width={76} height={40} rx={7} fill={INK} fillOpacity={0.94} />
        <rect className="sa-s" x={118} y={4} width={76} height={40} rx={7} fill="none" stroke={LINE} />
        <rect x={126} y={11} width={24} height={3.5} rx={1.75} fill={BAR2} />
        <rect x={126} y={19} width={26} height={18} rx={3} fill={BAR} />
        <rect x={158} y={21} width={28} height={3.5} rx={1.75} fill={BAR2} />
        <rect x={158} y={28} width={20} height={3.5} rx={1.75} fill={BAR} />
      </g>
      <g className="sa-f" style={at(380)}>
        <rect x={118} y={55} width={76} height={40} rx={7} fill={INK} fillOpacity={0.94} />
        <rect className="sa-s" x={118} y={55} width={76} height={40} rx={7} fill="none" stroke={LINE} />
        <rect x={126} y={62} width={24} height={3.5} rx={1.75} fill={BAR2} />
        <rect x={126} y={70} width={60} height={8} rx={2.5} fill={LAV} fillOpacity={0.55} />
        <rect x={126} y={83} width={22} height={6} rx={3} fill={IND} />
      </g>
      <g className="sa-f" style={at(460)}>
        <rect x={118} y={106} width={76} height={40} rx={7} fill={INK} fillOpacity={0.94} />
        <rect className="sa-s" x={118} y={106} width={76} height={40} rx={7} fill="none" stroke={LINE} />
        <rect x={126} y={113} width={24} height={3.5} rx={1.75} fill={BAR2} />
        <rect x={126} y={122} width={17} height={16} rx={3} fill={BAR} />
        <rect x={147.5} y={122} width={17} height={16} rx={3} fill={BAR} />
        <rect x={169} y={122} width={17} height={16} rx={3} fill={BAR} />
      </g>

      {/* The one they picked */}
      <Box x={118} y={55} w={76} h={40} r={7} stroke={IND} tint={IND} tintOpacity={0.16} delay={620} strong />
      <g className="sa-p" style={at(760)}>
        <circle cx={189} cy={58} r={7.5} fill={IND} />
        <path d="M185.6 58.2 l2.4 2.4 l4.4 -4.8" fill="none" stroke="#fff" strokeWidth={1.8} />
      </g>
    </>
  );
}

/* 03 Build: a browser window whose blocks fill in one piece at a time */
function ArtBuild() {
  const step = (i: number) => 220 + i * 75;
  const card = (x: number, i: number, accent: string) => (
    <g key={x} className="sa-f" style={at(step(i))}>
      <rect x={x} y={88} width={50} height={46} rx={6} fill="#ffffff" fillOpacity={0.07} />
      <rect x={x + 8} y={96} width={12} height={12} rx={3.5} fill={accent} />
      <rect x={x + 8} y={114} width={34} height={3.5} rx={1.75} fill={BAR2} />
      <rect x={x + 8} y={121} width={24} height={3.5} rx={1.75} fill={BAR} />
    </g>
  );
  return (
    <>
      <Frame x={6} y={4} w={188} h={142} r={10} />
      <BrowserDots y={15} delay={100} />
      <rect className="sa-f" style={at(140)} x={48} y={10.5} width={104} height={9} rx={4.5} fill="#ffffff" fillOpacity={0.07} />
      <path className="sa-d sa-s" style={at(120)} pathLength={100} d="M6.75 26 H193.25" stroke={LINE} fill="none" />

      {/* Empty slots the blocks land in. Each one shows while it waits and
          clears as its block arrives, so the finished drawing has none. */}
      {[
        [18, 38, 100, 10, 3],
        [18, 54, 76, 5, 2.5],
        [18, 66, 36, 11, 5.5],
        [132, 38, 50, 39, 6],
        [18, 88, 50, 46, 6],
        [75, 88, 50, 46, 6],
        [132, 88, 50, 46, 6],
      ].map(([x, y, w, h, r], i) => (
        <rect
          key={i}
          className="sa-ph"
          style={{ "--sa-dur": `${step(i) + 160}ms` } as CSSProperties}
          x={x} y={y} width={w} height={h} rx={r}
          fill="none" stroke="rgba(255,255,255,0.22)" strokeDasharray="3 3" strokeWidth={1}
        />
      ))}

      <Bar x={18} y={38} w={100} h={10} fill={HEAD} delay={step(0)} />
      <Bar x={18} y={54} w={76} h={5} fill={BAR2} delay={step(1)} />
      <rect className="sa-f" style={at(step(2))} x={18} y={66} width={36} height={11} rx={5.5} fill={IND} />
      <g className="sa-f" style={at(step(3))}>
        <rect x={132} y={38} width={50} height={39} rx={6} fill={LAV} fillOpacity={0.32} />
        <path className="sa-s" d="M140 70 l11 -12 l8 8 l5 -5 l10 9" fill="none" stroke={LAV} />
        <circle cx={169} cy={48} r={3} fill={LAV} />
      </g>
      {card(18, 4, LAV)}
      {card(75, 5, IND)}
      {card(132, 6, LAV)}
      <g className="sa-f" style={at(step(1))}>
        <rect className="sa-blink" x={98} y={52.5} width={1.6} height={8} rx={0.8} fill={LAV} />
      </g>
    </>
  );
}

/* 04 AI feature and tools: a chat bubble wired to three tool nodes */
function ArtTools() {
  const wires = [
    "M98 73 C118 73 118 21 138 21",
    "M98 73 H138",
    "M98 73 C118 73 118 125 138 125",
  ];
  const node = (y: number, i: number, icon: ReactNode, strong: boolean) => (
    <g key={y}>
      <g className="sa-f" style={at(520 + i * 80)}>
        <rect x={138} y={y} width={56} height={30} rx={8} fill={INK} fillOpacity={0.94} />
        {icon}
        <rect x={163} y={y + 13} width={22} height={4} rx={2} fill={BAR2} />
      </g>
      <rect
        className={`sa-d ${strong ? "sa-s2" : "sa-s"}`}
        style={at(500 + i * 80)}
        pathLength={100}
        x={138} y={y} width={56} height={30} rx={8}
        fill="none" stroke={strong ? IND : LAV}
      />
    </g>
  );
  return (
    <>
      {/* Wires sit under everything else */}
      {wires.map((d, i) => (
        <path key={d} className="sa-d sa-s" style={at(380 + i * 60)} pathLength={100} d={d} fill="none" stroke={LAV} strokeOpacity={0.6} />
      ))}
      <path className="sa-flow sa-s2" pathLength={100} d={wires[1]} fill="none" stroke="#ffffff" />

      {/* Chat bubble */}
      <path
        className="sa-f"
        d="M18 44 H86 A12 12 0 0 1 98 56 V90 A12 12 0 0 1 86 102 H33 L21 112 V102 H18 A12 12 0 0 1 6 90 V56 A12 12 0 0 1 18 44 Z"
        fill={INK}
        fillOpacity={0.94}
      />
      <path
        className="sa-d sa-s"
        pathLength={100}
        d="M18 44 H86 A12 12 0 0 1 98 56 V90 A12 12 0 0 1 86 102 H33 L21 112 V102 H18 A12 12 0 0 1 6 90 V56 A12 12 0 0 1 18 44 Z"
        fill="none"
        stroke={LAV}
      />
      <path
        className="sa-p"
        style={at(260)}
        d="M22 53 Q23.2 58.8 29 60 Q23.2 61.2 22 67 Q20.8 61.2 15 60 Q20.8 58.8 22 53 Z"
        fill={IND}
      />
      <Bar x={35} y={58} w={50} fill={BAR2} delay={300} />
      <Bar x={16} y={74} w={70} delay={340} />
      <Bar x={16} y={83} w={48} delay={370} />

      {/* Wire ends */}
      <circle className="sa-p" style={at(380)} cx={98} cy={73} r={2.6} fill={LAV} />

      {node(6, 0, <circle cx={152} cy={21} r={6} fill={LAV} fillOpacity={0.85} />, false)}
      {node(58, 1, <rect x={146} y={67} width={12} height={12} rx={3.5} fill={IND} />, true)}
      {node(110, 2, <path d="M152 118 l7 7 l-7 7 l-7 -7 Z" fill={LAV} fillOpacity={0.85} />, false)}
    </>
  );
}

/* 05 Launch and demo: a browser window with an address bar and a Live dot */
function ArtLive() {
  return (
    <>
      <Frame x={6} y={8} w={188} h={134} r={10} />
      <BrowserDots y={22} delay={100} />
      <rect className="sa-f" style={at(140)} x={46} y={14} width={140} height={16} rx={8} fill="#ffffff" fillOpacity={0.07} />
      <path className="sa-d sa-s" style={at(120)} pathLength={100} d="M6.75 37 H193.25" stroke={LINE} fill="none" />

      <g className="sa-lbl sa-f" style={at(220)}>
        <text className="sa-txt" x={63} y={25.8} fontSize={10.5} fill={GREEN}>Live</text>
        <rect x={90} y={20} width={72} height={4} rx={2} fill={BAR2} />
      </g>
      <g className="sa-lblalt sa-f" style={at(220)}>
        <rect x={64} y={20} width={96} height={4} rx={2} fill={BAR2} />
      </g>

      <Bar x={20} y={51} w={92} h={10} fill={HEAD} delay={260} />
      <Bar x={20} y={67} w={70} h={5} fill={BAR2} delay={320} />
      <rect className="sa-f" style={at(380)} x={20} y={80} width={40} height={12} rx={6} fill={IND} />
      <g className="sa-f" style={at(420)}>
        <rect x={126} y={49} width={56} height={43} rx={6} fill={LAV} fillOpacity={0.32} />
        <path className="sa-s" d="M134 85 l12 -13 l8 8 l6 -6 l12 11" fill="none" stroke={LAV} />
        <circle cx={170} cy={59} r={3} fill={LAV} />
      </g>
      <rect className="sa-f" style={at(480)} x={20} y={104} width={48} height={26} rx={6} fill="#ffffff" fillOpacity={0.07} />
      <rect className="sa-f" style={at(530)} x={76} y={104} width={48} height={26} rx={6} fill="#ffffff" fillOpacity={0.07} />
      <rect className="sa-f" style={at(580)} x={132} y={104} width={50} height={26} rx={6} fill="#ffffff" fillOpacity={0.07} />

      {/* The Live dot, which keeps pulsing */}
      <g className="sa-p" style={at(640)}>
        <circle className="sa-pulse" cx={56} cy={22} r={3.6} fill={GREEN} />
        <circle cx={56} cy={22} r={3.6} fill={GREEN} />
      </g>
    </>
  );
}

const ART = [ArtModel, ArtPrd, ArtBuild, ArtTools, ArtLive];

/** One step's wireframe. `play` runs the draw-in; without it the finished drawing shows. */
export function StepArt({ step, play }: { step: number; play: boolean }) {
  const Art = ART[step];
  if (!Art) return null;
  return (
    <svg
      className={`sa-art${play ? " sa-play" : ""}`}
      viewBox="0 0 200 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <Art />
    </svg>
  );
}
