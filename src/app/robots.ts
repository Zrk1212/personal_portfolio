import type { MetadataRoute } from "next";

// Every page is public. The sitemap lists them; llms.txt summarizes the site for AI assistants.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://founder.zrk.ventures/sitemap.xml",
    host: "https://founder.zrk.ventures",
  };
}
