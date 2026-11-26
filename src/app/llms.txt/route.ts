import { BUNDLE_EXTRAS, FAQ, PRICING, PROCESS, PROJECTS, SKILLS } from "../content";

/* /llms.txt: a plain-text summary of the site for AI assistants (llmstxt.org).
   Built from content.ts at build time, so it never drifts from the homepage. */
export const dynamic = "force-static";

const BASE = "https://founder.zrk.ventures";

export function GET() {
  const lines = [
    "# Founder",
    "",
    "> One-on-one sessions over Zoom where high school students build and launch a real web or iOS app, and the online business around it, with AI. Run by Zac Klein, founder of Vantage Recruiting.",
    "",
    "Students start from their own idea. No coding experience is needed. Families can start with a free 30-minute consultation over Zoom.",
    "",
    "## The five steps",
    ...PROCESS.map((s) => `- ${s.no} ${s.title}: ${s.body} Outcome: ${s.outcome}.`),
    "",
    "## What students learn",
    ...SKILLS.map((s) => `- ${s.title}: ${s.body}`),
    "",
    "## Pricing",
    ...PRICING.flatMap((t) => [
      `- ${t.track}: ${t.blurb}`,
      ...t.rows.map((r) => `  - ${r.length.replace(" hours", " hour").replace(" ", "-")} sessions: ${r.single} single, ${r.bundle} for a bundle of 5 (${r.each})`),
    ]),
    "",
    "Every bundle of 5 includes:",
    ...BUNDLE_EXTRAS.map((x) => `- ${x.title}: ${x.body}`),
    "",
    "## Apps Zac has built",
    ...PROJECTS.map((p) => `- [${p.title}](${p.href}): ${p.blurb}`),
    "",
    "## FAQ",
    ...FAQ.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Pages",
    `- [Home](${BASE}/): the full overview`,
    `- [Book a free consultation](${BASE}/contact)`,
    `- [Terms](${BASE}/terms), including the bundle guarantee`,
    `- [Privacy](${BASE}/privacy)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
