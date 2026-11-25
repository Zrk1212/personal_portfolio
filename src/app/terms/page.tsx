import type { Viewport } from "next";
import { EmailLink, LegalPage, legalMetadata } from "@/components/site/legal";

export const viewport: Viewport = { themeColor: "#171721" };

export const metadata = legalMetadata(
  "Terms of use · Founder",
  "The plain-English terms for using this site and booking one-on-one app-building sessions with Zac Klein.",
  "/terms"
);

const strong = { color: "var(--fg)" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      intro="These terms cover this website and the tutoring sessions offered through it. By using the site or booking a session, you agree to them. They are written in plain English for parents."
      sections={[
        {
          heading: "What the service is",
          body: (
            <p>
              Founder offers one-on-one tutoring sessions with Zac Klein, an individual from
              Chappaqua, New York. Sessions are held over Zoom. In them, a high school student builds
              a web or iOS app, or an online business, using AI tools.
            </p>
          ),
        },
        {
          heading: "Booking and payment",
          body: (
            <p>
              Sessions are booked and paid for directly with Zac, by Zelle, Venmo or PayPal. Payment
              is not taken through this site.
            </p>
          ),
        },
        {
          heading: "The bundle guarantee",
          id: "guarantee",
          body: (
            <>
              <p>
                If you buy a bundle of five sessions and the student attends all five, the app
                will be live by the end. If it is not, I will keep working with the student over
                Zoom, at no extra charge, until it is.
              </p>
              <p>
                Live means a web app that opens at its own link, or an iOS app installed on the
                student&apos;s iPhone through TestFlight. Approval for the App Store is
                Apple&apos;s decision, so it is not part of the guarantee.
              </p>
              <p>
                The guarantee applies to the app described in the plan the student writes in the
                second session. It covers my time. It does not cover other companies&apos; costs,
                such as AI subscriptions or the Apple developer program.
              </p>
            </>
          ),
        },
        {
          heading: "No promised outcomes",
          body: (
            <>
              <p>
                Apart from the bundle guarantee above, nothing on this site guarantees admission to
                any college or any other result. The
                home page types playful prompts, such as asking an AI to build a business with no
                mistakes, as an illustration of how the tools work. They are not a promise of
                anything.
              </p>
              <p>
                What a student builds, and what comes of it, depends on the student, the idea and
                the effort they put in.
              </p>
            </>
          ),
        },
        {
          heading: "Not affiliated",
          body: (
            <p>
              This site and service are not affiliated with, endorsed by or sponsored by Common
              App, any college or university named on the site, Anthropic, OpenAI, Google, Apple or Vercel. Their
              names and logos belong to their owners.
            </p>
          ),
        },
        {
          heading: "Third-party tools",
          body: (
            <p>
              Building an app can involve other companies&apos; products, such as AI subscriptions,
              the Apple developer program and hosting. Each has its own terms, costs and age rules.
              Your family is responsible for those terms and costs.
            </p>
          ),
        },
        {
          heading: "Using what you build responsibly",
          body: (
            <p>
              The student is responsible for using what they build honestly. That includes
              following their school&apos;s rules and academic integrity policies.
            </p>
          ),
        },
        {
          heading: "The site and sessions are provided as is",
          body: (
            <>
              <p>
                The site and the sessions are provided &quot;as is&quot; and &quot;as
                available,&quot; without warranties of any kind, to the extent the law allows.
              </p>
              <p>
                To the extent the law allows, Zac Klein is not liable for indirect or consequential
                losses that come from using the site or taking part in sessions. Nothing in these
                terms limits any rights you have that the law does not allow to be limited.
              </p>
            </>
          ),
        },
        {
          heading: "Governing law",
          body: <p>These terms are governed by the laws of the State of New York.</p>,
        },
        {
          heading: "Changes to these terms",
          body: (
            <p>
              If I change these terms, I will post the new version on this page and update the date
              at the top.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              <span style={strong}>Zac Klein</span>, <EmailLink />
            </p>
          ),
        },
      ]}
    />
  );
}
