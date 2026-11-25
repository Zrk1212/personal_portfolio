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
    body: "An AI assistant that writes code while students direct it and make the decisions.",
  },
  {
    title: "Launching it online",
    body: "Publishing the app on Vercel so it has a live, accessible link anyone can open.",
  },
  {
    title: "An AI feature",
    body: "Incorporating artificial intelligence inside their app, such as a chat helper or features that write or sort for the user.",
  },
  {
    title: "Automations",
    body: "Letting AI handle a repetitive task, such as a weekly summary or sorting messages.",
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
    body: "I review their progress and provide tailored guidance on how they can improve.",
  },
];

export type Project = {
  title: string;
  short?: string; // shorter name for the compact app list
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
    title: "Hoos Planner",
    blurb:
      "An AI schedule advisor for college students. Describe your semester and it builds a conflict-free week from real class data, tracks every requirement for your school and major, and plugs straight into Claude and ChatGPT.",
    tags: ["Next.js", "AI", "Supabase"],
    year: "2026",
    hue: "#3b6cf6",
    hue2: "#e57200",
    href: "https://hoosplanner.zrk.ventures",
    url: "hoosplanner.zrk.ventures",
    image: "/work/hoos-planner.png",
  },
  {
    title: "Vantage Recruiting",
    short: "Vantage",
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
    title: "Bubble",
    blurb:
      "A money planner for college clubs. Admins track dues, income and spending in one place, and members see the club's totals and where every dollar went. It never moves money. It is a planning and transparency tool, and it is free.",
    tags: ["Next.js", "Tailwind", "Postgres"],
    year: "2026",
    hue: "#0d9488",
    hue2: "#2dd4bf",
    href: "https://bubble.zrk.ventures",
    url: "bubble.zrk.ventures",
    image: "/work/bubble.png",
  },
  {
    title: "Dr. Rob Chiropractic",
    short: "Dr. Rob",
    blurb:
      "A polished marketing site for a chiropractic and sports-medicine practice. Credentials, Active Release Technique, the conditions he treats, and booking, built to turn visitors into patients.",
    tags: ["React", "Vite", "Local business"],
    year: "2026",
    hue: "#ffb44d",
    hue2: "#7c5cff",
    href: "https://www.drrobsanfilippo.com/",
    url: "drrobsanfilippo.com",
    image: "/work/dr-rob.png",
  },
];

// The five steps. A bundle of five gives each step its own session.
export const PROCESS = [
  {
    no: "01",
    title: "Business model",
    body: "Students start with something they care about and shape it into a business: who it's for, what problem it solves and how it could generate income.",
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
    body: "The app goes live with a real link, or onto their iPhone through TestFlight. The session ends with students showing you what they built.",
    outcome: "A live app with its own link",
  },
];

// Prices. Two session lengths, 1 hour and 2 hours. iOS is double web at both.
// A bundle is five sessions, and the 2-hour bundle is the best value.
export type PriceRow = {
  length: string;
  single: string;
  bundle: string;
  each: string; // per-session price inside the bundle
  best?: boolean; // highlight the bundle price as the best value
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
    blurb: "A web app with a live link students can share with anyone.",
    featured: true,
    rows: [
      { length: "1 hour", single: "$120", bundle: "$475", each: "$95 each" },
      { length: "2 hours", single: "$200", bundle: "$790", each: "$158 each", best: true },
    ],
  },
  {
    track: "iOS app",
    blurb:
      "An iPhone app. iOS costs double because it adds Xcode, Apple's developer setup and the App Store / TestFlight process.",
    rows: [
      { length: "1 hour", single: "$240", bundle: "$950", each: "$190 each" },
      { length: "2 hours", single: "$400", bundle: "$1,580", each: "$316 each", best: true },
    ],
  },
];

// What a bundle of five adds beyond the lower price. `href` links the fine print.
export const BUNDLE_EXTRAS: { title: string; body: string; href?: string; link?: string }[] = [
  {
    title: "Help between sessions",
    body: "Questions don't have to wait for the next session. Email me and I'll answer.",
  },
  {
    title: "A recap after every session",
    body: "You get a short note on what was built and what comes next.",
  },
  {
    title: "A finish guarantee",
    body: "If a student attends all five sessions and the app isn't live, I keep working with them at no charge until it is.",
    href: "/terms#guarantee",
    link: "How the guarantee works",
  },
];

export const FAQ = [
  {
    q: "Do students need coding experience?",
    a: "No. We start from their idea, and I teach what they need as we build.",
  },
  {
    q: "How many sessions does it take?",
    a: "About five sessions for a fully built web app. An iPhone app takes the same five sessions, plus the time Apple takes to review it, which can mean a few rounds of fixes and resubmitting. In total, plan on about 5 to 7 hours, depending on the app and how involved the student is.",
  },
  {
    q: "What if they don't have an idea yet?",
    a: "That's fine. In the first session, we start with something they care about and shape it into a business: who it's for, what problem it solves and how it could generate income.",
  },
  {
    q: "Should we book 1-hour or 2-hour sessions?",
    a: "One hour works for most students. Two-hour sessions make sense for a bigger idea or an iPhone app. We can decide together on the free consultation call.",
  },
  {
    q: "How do sessions work?",
    a: "Sessions are one-on-one over Zoom, scheduled around each student's commitments. Between sessions, students keep building on their own. Parents are welcome to join any session.",
  },
  {
    q: "What do they need?",
    a: "A laptop. For an iOS app it has to be a Mac, because Apple's tools only run on Macs.",
  },
  {
    q: "Do they need AI accounts?",
    a: "Yes. We will need a Pro subscription to Claude, ChatGPT or Gemini, which is about $20 a month.",
  },
  {
    q: "Are there other costs?",
    a: "Only for an iPhone app. Apple's developer program is $99 a year, and a parent enrolls because Apple requires an adult. A web app can go live for free. A custom domain is optional.",
  },
  {
    q: "What will they have at the end?",
    a: "A live app with its own link, or an iPhone app on their phone through TestFlight. They also keep the one-page business model and the plan they wrote. The app, the code and the accounts all belong to the student.",
  },
  {
    q: "How does this help with college applications?",
    a: "Students finish with a real business they built themselves. They can write about it and speak about it with confidence.",
  },
  {
    q: "Is this cheating?",
    a: "No. Students make the plan, make the decisions and can explain every part of what they built. It's also a real project they can talk about.",
  },
  {
    q: "How does payment work?",
    a: "You pay me directly by Zelle, Venmo or PayPal.",
  },
  {
    q: "Can we talk before booking a session?",
    a: "Absolutely! You can book a free 30-minute consultation over Zoom.",
  },
];
