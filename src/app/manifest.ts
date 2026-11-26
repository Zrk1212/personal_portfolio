import type { MetadataRoute } from "next";

// Lets phones save the site to the home screen with the right name, icon and colors
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Founder",
    short_name: "Founder",
    description:
      "One-on-one sessions where high school students build and launch a real web or iOS app with AI.",
    start_url: "/",
    display: "browser",
    background_color: "#171721",
    theme_color: "#171721",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
