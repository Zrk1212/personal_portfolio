"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ----------------------------------------------------------------
   Actors live on the Apify Store under apify.com/zrk1212/<slug>.
   Prices mirror each actor's README (pay per event, per 1,000).
----------------------------------------------------------------- */

type Actor = {
  slug: string;
  name: string;
  category: string;
  pitch: string;
  price: string;
};

const ACTORS: Actor[] = [
  {
    slug: "workday-jobs-scraper",
    name: "Workday Jobs Scraper",
    category: "Jobs",
    pitch:
      "Every job from any Workday career site, past the 2,000 result cap, with full descriptions, parsed salary and a daily new and closed monitor.",
    price: "$1.50 per 1,000 jobs",
  },
  {
    slug: "ats-jobs-monitor",
    name: "Greenhouse, Lever & Ashby Jobs",
    category: "Jobs",
    pitch:
      "Paste company names and get every open job from 9 applicant tracking systems, normalized with parsed salary. Monitor mode charges only new or changed jobs.",
    price: "$2 per 1,000 jobs",
  },
  {
    slug: "tiktok-transcript-scraper",
    name: "TikTok Transcript Scraper",
    category: "Social",
    pitch:
      "Transcripts of any public TikTok video or creator, from TikTok's own captions first and low-cost AI speech-to-text only when there are none.",
    price: "$1.50 per 1,000 captions, AI $0.004 per minute",
  },
  {
    slug: "telegram-channel-scraper-stats",
    name: "Telegram Channel Scraper",
    category: "Social",
    pitch:
      "Posts, views, reactions, media and exact subscriber counts from public Telegram channels, with an only-new-posts mode for schedules. No login needed.",
    price: "$0.60 per 1,000 posts, $1.50 per 1,000 channels",
  },
  {
    slug: "google-ads-transparency-ad-copy",
    name: "Google Ads Transparency Scraper",
    category: "Marketing",
    pitch:
      "The actual ad copy as text from the Google Ads Transparency Center, plus bulk checks of whether a domain runs Google Ads and alerts for new and stopped ads.",
    price: "$1.20 per 1,000 ads, $2 per 1,000 domain checks",
  },
  {
    slug: "pagespeed-bulk-auditor",
    name: "Bulk PageSpeed & Core Web Vitals",
    category: "SEO",
    pitch:
      "Audit a whole site or a list of URLs with PageSpeed Insights: Lighthouse scores, real-user Core Web Vitals, a pass or fail verdict and the top fixes per page.",
    price: "$5 per 1,000 audits, $2 with your own Google key",
  },
  {
    slug: "uk-new-company-leads",
    name: "UK New Company Leads",
    category: "Leads",
    pitch:
      "A daily list of newly incorporated UK companies from Companies House, filtered by industry, area and type, with directors and registered addresses.",
    price: "$2 per 1,000 companies, directors +$0.50",
  },
  {
    slug: "luma-organizer-leads",
    name: "Luma Organizer Leads",
    category: "Leads",
    pitch:
      "The people and companies who run events on Luma in any city, one row per organizer with website, socials, followers, hosting frequency and event size.",
    price: "$6 per 1,000 organizers, $1 per 1,000 events",
  },
  {
    slug: "google-hotels-prices-scraper",
    name: "Google Hotels Prices Scraper",
    category: "Travel",
    pitch:
      "Every seller's price for a hotel on your exact dates from Google Hotels, with date checks and rate-parity flags between the official site and OTAs.",
    price: "$4 per 1,000 hotel-dates, $1.50 per 1,000 hotels",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function ApifyView() {
  return (
    <div className="relative z-[2] w-full overflow-x-clip">
      {/* Aurora field, faded out with a mask so it never ends on a hard edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[64rem] [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
        aria-hidden
      >
        <div className="animate-drift absolute -top-40 -left-20 h-[38rem] w-[38rem] max-w-[100vw] rounded-full bg-[var(--color-violet)] opacity-[0.2] blur-[120px]" />
        <div className="animate-drift-slow absolute top-0 right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[var(--color-lime)] opacity-[0.14] blur-[130px]" />
        <div className="dotgrid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      </div>

      {/* ---------------- Nav ---------------- */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6"
      >
        <nav className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-bone)]"
          >
            Zac Klein
          </Link>
          <div className="hidden items-center gap-8 sm:flex">
            {[
              ["Work", "/#work"],
              ["Sessions", "/#process"],
              ["About", "/#about"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[var(--color-mist)] transition-colors hover:text-[var(--color-bone)]"
              >
                {label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-[var(--color-bone)] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-transform duration-300 hover:scale-[1.04]"
          >
            Get in touch
          </Link>
        </nav>
      </motion.header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative px-6 pt-40 pb-14 sm:px-10 sm:pt-48 sm:pb-20">

        <div className="mx-auto max-w-6xl">
          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.2em] text-[var(--color-lime)]"
          >
            Apify Store · 9 actors
          </motion.p>
          <motion.h1
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[1.03] tracking-tight text-[var(--color-bone)]"
          >
            Data tools on <span className="text-gradient italic">Apify</span>
          </motion.h1>
          <motion.p
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-mist)] sm:text-xl"
          >
            I build reliable scrapers that run on Apify. You pay per result, and
            Apify&apos;s free monthly credits are enough to try any of them.
          </motion.p>
        </div>
      </section>

      {/* ---------------- Grid ---------------- */}
      <section className="relative px-6 pb-28 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACTORS.map((a, i) => (
            <ActorCard key={a.slug} actor={a} index={i} />
          ))}
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          animate="show"
          custom={8}
          className="mx-auto mt-14 flex max-w-6xl flex-col items-start justify-between gap-5 rounded-[var(--radius-glass)] border border-[var(--color-hair)] px-7 py-6 sm:flex-row sm:items-center"
        >
          <p className="text-[15px] leading-7 text-[var(--color-mist)]">
            Need data from a site that is not listed here? I build custom scrapers too.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://apify.com/zrk1212"
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-[var(--color-bone)] transition-colors hover:border-[var(--color-hair-strong)]"
            >
              All actors on Apify
            </a>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full bg-[var(--color-lime)] px-5 text-sm font-semibold text-[#0a0a0a] transition-transform duration-300 hover:scale-[1.04]"
            >
              Get in touch
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="relative border-t border-[var(--color-hair)] px-6 py-12 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-bone)]"
          >
            Zac Klein
          </Link>
          <p className="text-sm text-[var(--color-faint)]">
            Designed and built by Zac Klein.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ActorCard({ actor, index }: { actor: Actor; index: number }) {
  const href = `https://apify.com/zrk1212/${actor.slug}`;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variants={reveal}
      initial="hidden"
      animate="show"
      custom={index + 3}
      className="glass group relative flex flex-col overflow-hidden rounded-[var(--radius-glass)] p-6 transition-colors duration-300 hover:border-[var(--color-hair-strong)]"
    >
      <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-[var(--color-lime)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.12]" />

      <div className="flex items-center justify-between gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--color-hair)] bg-[var(--color-panel)]">
          <Image
            src={`/apify/${actor.slug}.png`}
            alt=""
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="rounded-full border border-[var(--color-hair)] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-faint)]">
          {actor.category}
        </span>
      </div>

      <h2 className="mt-5 font-[family-name:var(--font-display)] text-[1.4rem] font-medium leading-tight text-[var(--color-bone)]">
        {actor.name}
      </h2>
      <p className="mt-3 flex-1 text-[15px] leading-7 text-[var(--color-mist)]">
        {actor.pitch}
      </p>

      <div className="mt-6 border-t border-[var(--color-hair)] pt-4">
        <p className="font-[family-name:var(--font-mono)] text-[12.5px] leading-5 text-[var(--color-lime)]">
          {actor.price}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-bone)]">
          Open on Apify
          <span className="text-[var(--color-faint)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-lime)]">
            &#8599;
          </span>
        </p>
      </div>
    </motion.a>
  );
}
