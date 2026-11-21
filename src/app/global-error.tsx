"use client"; // Error boundaries must be Client Components

/* Last-resort fallback if the root layout itself fails. It replaces the
   layout, so it carries its own html, body and styles. */
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const pill = {
    display: "inline-flex",
    alignItems: "center",
    height: 40,
    padding: "0 20px",
    borderRadius: 32,
    fontSize: 16,
    fontWeight: 500,
    border: 0,
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "inherit",
  } as const;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171721",
          color: "#ededf3",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <title>Something went wrong · Founder</title>
        <div>
          <h1 style={{ fontSize: 36, lineHeight: 1.1, fontWeight: 500, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.4, color: "#c3c3cc", maxWidth: 440, margin: "16px auto 0" }}>
            That&apos;s on my end, not yours. Try again, or email me at
            zacklein555@gmail.com.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{ ...pill, background: "#5266eb", color: "#fff" }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ ...pill, background: "rgba(175,178,206,0.2)", color: "#ededf3" }}>
              Back to the homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
