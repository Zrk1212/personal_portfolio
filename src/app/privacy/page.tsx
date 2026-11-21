import type { Viewport } from "next";
import { EmailLink, LegalPage, legalMetadata } from "@/components/site/legal";

export const viewport: Viewport = { themeColor: "#171721" };

export const metadata = legalMetadata(
  "Privacy policy · Zac Klein",
  "What this site collects when you send a message, who receives it, how long it is kept, and how to ask me to delete it.",
  "/privacy"
);

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="This site is run by Zac Klein, an individual and a University of Virginia student from Chappaqua, New York. It is written for parents, so this page is short and plain. It explains what happens to the details you share with me."
      sections={[
        {
          heading: "What I collect",
          body: (
            <>
              <p>
                The only thing the site collects is what you type into the contact form. That is
                your name, your email address, your student&apos;s grade, whether they want a web
                app or an iOS app, whether you prefer in person or Zoom, and your message.
              </p>
              <p>
                There are no accounts, no analytics and no advertising or tracking cookies on this
                site.
              </p>
            </>
          ),
        },
        {
          heading: "Why I collect it",
          body: (
            <p>
              I use these details to reply to you, to plan a first session, and to work with your
              family if you book. I do not use them for anything else.
            </p>
          ),
        },
        {
          heading: "Who receives it",
          body: (
            <>
              <p>
                <strong style={{ color: "var(--fg)" }}>Me.</strong> Your message is emailed to me
                at <EmailLink />.
              </p>
              <p>
                <strong style={{ color: "var(--fg)" }}>Web3Forms.</strong> The form is sent through
                Web3Forms (web3forms.com), a third-party form service. It processes your submission
                and passes it to my inbox. It has its own privacy policy.
              </p>
              <p>
                <strong style={{ color: "var(--fg)" }}>Vercel.</strong> The site is hosted on
                Vercel. Like any web host, Vercel receives standard request information when you
                visit, such as your IP address and browser type, to deliver the pages and keep the
                service running.
              </p>
              <p>
                The site&apos;s fonts are served from the site itself, so visiting it does not send
                a request to Google for fonts.
              </p>
              <p>I do not sell your information or share it for advertising.</p>
            </>
          ),
        },
        {
          heading: "What stays in your browser",
          body: (
            <p>
              The home page keeps two small flags in your browser&apos;s session storage, called
              zk-hero-done and zk-hero-y. They remember that the intro animation already played and
              where you had scrolled to. They are cleared when you close the tab and are never sent
              anywhere.
            </p>
          ),
        },
        {
          heading: "How long I keep it",
          body: (
            <p>
              I keep your emails for as long as I need them to reply and to work with your family.
              You can ask me to delete them at any time.
            </p>
          ),
        },
        {
          heading: "Children's privacy",
          body: (
            <p>
              The contact form is meant to be filled in by a parent or guardian, not by the
              student. This site does not knowingly collect information directly from children
              under 13. If you think a child has sent me information, email me and I will delete it.
            </p>
          ),
        },
        {
          heading: "Access and deletion",
          body: (
            <p>
              To see what I have about you, or to have it deleted, email <EmailLink />. I will
              reply by email.
            </p>
          ),
        },
        {
          heading: "Changes to this policy",
          body: (
            <p>
              If I change this policy, I will post the new version on this page and update the date
              at the top.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about this policy? Email Zac Klein at <EmailLink />.
            </p>
          ),
        },
      ]}
    />
  );
}
