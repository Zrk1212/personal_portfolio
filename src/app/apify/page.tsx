import type { Metadata } from "next";
import ApifyView from "./apify-view";

const TITLE = "Data tools on Apify · Zac Klein";
const DESCRIPTION =
  "Reliable scrapers by Zac Klein that run on Apify: jobs, TikTok transcripts, Google Ads copy, PageSpeed audits, UK company leads, Luma organizers, hotel prices and Telegram. Pay per result, free to try.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/apify" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/apify",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ApifyPage() {
  return <ApifyView />;
}
