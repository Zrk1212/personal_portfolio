import type { MetadataRoute } from "next";

const BASE = "https://founder.zrk.ventures";

// lastModified = the day each page's content last changed. Bump it when you edit one.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: "2026-11-25", changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/contact`, lastModified: "2026-11-25", changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/apify`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: "2026-11-25", changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: "2026-11-25", changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/cookies`, lastModified: "2026-11-25", changeFrequency: "yearly", priority: 0.2 },
  ];
}
