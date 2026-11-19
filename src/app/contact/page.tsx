import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Book a session · Zac Klein",
  description:
    "Book a one-on-one session where your high schooler builds a real web or iOS app with AI. Tell me about your student and I'll get back to you within a day.",
  openGraph: {
    title: "Book a session · Zac Klein",
    description:
      "Book a one-on-one session where your high schooler builds a real web or iOS app with AI. Tell me about your student and I'll get back to you within a day.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
