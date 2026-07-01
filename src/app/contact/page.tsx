import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact · Zac Klein",
  description:
    "Start a project with Zac Klein. Tell me about your website or web app and I'll get back to you within a day.",
  openGraph: {
    title: "Contact · Zac Klein",
    description:
      "Start a project with Zac Klein. Tell me about your website or web app and I'll get back to you within a day.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
