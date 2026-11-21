import type { Metadata, Viewport } from "next";
import ContactForm from "./contact-form";

export const viewport: Viewport = {
  themeColor: "#171721",
};

export const metadata: Metadata = {
  title: "Book a free consultation · Zac Klein",
  alternates: { canonical: "/contact" },
  description:
    "Book a free 30-minute consultation about one-on-one sessions where your high schooler builds a real web or iOS app with AI. I'll get back to you within a day.",
  openGraph: {
    title: "Book a free consultation · Zac Klein",
    description:
      "Book a free 30-minute consultation about one-on-one sessions where your high schooler builds a real web or iOS app with AI. I'll get back to you within a day.",
    type: "website",
    url: "/contact",
    siteName: "Zac Klein",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Book a session with Zac Klein" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a free consultation · Zac Klein",
    images: ["/og.jpg"],
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
