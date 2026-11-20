/* ----------------------------------------------------------------
   Content: edit these arrays to update the site
----------------------------------------------------------------- */

export const SKILLS = [
  {
    title: "A written plan",
    body: "Turning their idea into a PRD: a clear, written plan an AI can build from.",
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

export type Project = {
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

export const PROJECTS: Project[] = [
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

// The five steps. A bundle of five gives each step its own session.
export const PROCESS = [
  {
    no: "01",
    title: "Business model",
    body: "They start with something they care about and shape it into a business: who it's for, what problem it solves and how it could make money.",
    outcome: "A one-page business model",
  },
  {
    no: "02",
    title: "PRD and design",
    body: "They write a PRD, a plain-English plan of what the app does that the AI builds from. I send a set of sites and apps, and they pick the look they like.",
    outcome: "A PRD and a design to follow",
  },
  {
    no: "03",
    title: "Build",
    body: "They build the core of the app with Claude Code, one working piece at a time, following their PRD and design picks.",
    outcome: "A working first version",
  },
  {
    no: "04",
    title: "AI feature and tools",
    body: "They add an AI feature and set up an automation, a skill or an MCP connection.",
    outcome: "An AI feature and one automation",
  },
  {
    no: "05",
    title: "Launch and demo",
    body: "The app goes live with a real link, or onto their iPhone through TestFlight. The session ends with your student showing it to you.",
    outcome: "A live app with its own link",
  },
];

// Prices. iOS is double web at every length. A bundle is five sessions.
export type PriceRow = {
  length: string;
  single: string;
  bundle: string;
  each: string; // per-session price inside the bundle
};

export type PriceTrack = {
  track: string;
  blurb: string;
  featured?: boolean;
  rows: PriceRow[];
};

export const PRICING: PriceTrack[] = [
  {
    track: "Web app",
    blurb: "A web app with a real link your student can share with anyone.",
    featured: true,
    rows: [
      { length: "30 minutes", single: "$60", bundle: "$250", each: "$50 each" },
      { length: "1 hour", single: "$100", bundle: "$425", each: "$85 each" },
    ],
  },
  {
    track: "iOS app",
    blurb:
      "An iPhone app. iOS costs double because it adds Xcode, Apple's developer setup and the App Store / TestFlight process.",
    rows: [
      { length: "30 minutes", single: "$120", bundle: "$500", each: "$100 each" },
      { length: "1 hour", single: "$200", bundle: "$850", each: "$170 each" },
    ],
  },
];

export const FAQ = [
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
    a: "Most AI tools have age limits. Claude is for users 18 and older, and ChatGPT allows ages 13 to 17 with a parent's permission. In the first session we go over what each tool allows at your student's age and set up any accounts in your name, so you stay in the loop.",
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
