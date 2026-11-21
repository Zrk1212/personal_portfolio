import type { Viewport } from "next";
import Link from "next/link";
import { EmailLink, LegalPage, legalMetadata } from "@/components/site/legal";

export const viewport: Viewport = { themeColor: "#171721" };

export const metadata = legalMetadata(
  "Cookie use · Founder",
  "Founder does not use tracking, advertising or analytics cookies. This page explains what the site stores and what the booking form sends.",
  "/cookies"
);

const link =
  "m-focus rounded underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] underline-offset-4 hover:decoration-current";

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie use"
      intro="The short version: Founder does not set any cookies. There is no tracking, no advertising and no analytics on this site."
      sections={[
        {
          heading: "What the site stores",
          body: (
            <>
              <p>
                No cookies. There are no accounts to sign in to, so there is nothing to remember
                between visits.
              </p>
              <p>
                The home page keeps two small flags in your browser&apos;s session storage, called
                zk-hero-done and zk-hero-y. They remember that the intro animation already played and where you had scrolled to,
                so the page looks right if you reload it. They never leave your browser, they are
                not used to identify you, and they are cleared when you close the tab.
              </p>
              <p>Because of that, there is no cookie banner and nothing for you to accept or decline.</p>
            </>
          ),
        },
        {
          heading: "The booking form",
          body: (
            <p>
              When you send the booking form, the details you typed are sent to Web3Forms
              (web3forms.com), the form service that emails them to me. That happens only when you
              press the button. The <Link href="/privacy" className={link}>privacy policy</Link>{" "}
              explains what is sent and how long I keep it.
            </p>
          ),
        },
        {
          heading: "Links to other sites",
          body: (
            <p>
              The apps in the work section are separate sites. If you open one, that site may use
              its own cookies under its own policy.
            </p>
          ),
        },
        {
          heading: "If this changes",
          body: (
            <p>
              If I ever add cookies, I will update this page first and say what each one is for.
            </p>
          ),
        },
        {
          heading: "Questions",
          body: (
            <p>
              Email Zac Klein at <EmailLink />.
            </p>
          ),
        },
      ]}
    />
  );
}
