"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { SiteShell } from "@/components/site/shell";

/* Shown if a page throws while rendering. Offers a retry and a way home. */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SiteShell>
      <main id="main">
        <section
          data-section-theme="dark"
          className="flex min-h-[calc(100svh-120px)] items-center pb-16 pt-[136px]"
        >
          <div className="m-wrap text-center">
            <h1 className="m-h1 mx-auto max-w-[640px] text-balance">
              Something went wrong
            </h1>
            <p className="m-body mx-auto mt-5 max-w-[440px]" style={{ color: "var(--muted)" }}>
              That&apos;s on my end, not yours. Try again, or email me at
              zacklein555@gmail.com.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => unstable_retry()} className="m-btn m-btn-primary">
                Try again
              </button>
              {/* A full page load, in case client-side state is what broke */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="m-btn m-btn-secondary">
                Back to the homepage
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
