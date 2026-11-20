import { Logo } from "./logo";

export function Footer({ home }: { home: boolean }) {
  const prefix = home ? "" : "/";
  const cols: { title: string; links: [string, string][] }[] = [
    {
      title: "Tutoring",
      links: [
        ["What they'll learn", `${prefix}#learn`],
        ["How sessions go", `${prefix}#process`],
        ["Pricing", `${prefix}#pricing`],
        ["FAQ", `${prefix}#faq`],
      ],
    },
    {
      title: "Zac",
      links: [
        ["What I've built", `${prefix}#work`],
        ["About", `${prefix}#about`],
        ["GitHub", "https://github.com/Zrk1212"],
        ["Data tools on Apify", "/apify"],
      ],
    },
    {
      title: "Contact",
      links: [
        ["Book a session", "/contact"],
        ["zacklein555@gmail.com", "mailto:zacklein555@gmail.com"],
      ],
    },
  ];

  return (
    <footer data-section-theme="dark" className="pb-12 pt-20">
      <div className="m-wrap">
        <div
          className="m-th grid gap-12 border-t pt-12 sm:grid-cols-[1.2fr_1fr_1fr_1fr]"
          style={{ borderColor: "var(--rule)" }}
        >
          <div>
            <Logo />
            <p className="m-th mt-4 max-w-[240px] text-[14px] leading-[1.45]" style={{ color: "var(--muted)" }}>
              One-on-one sessions where high schoolers build and launch a real
              app with AI.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="m-th text-[14px] font-[440]" style={{ color: "var(--muted)" }}>
                {c.title}
              </div>
              <ul className="mt-4 space-y-3">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="m-focus rounded text-[16px] font-[420] underline-offset-4 hover:underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="m-th mt-16 text-[13px]" style={{ color: "var(--muted)" }}>
          Designed and built by Zac Klein.
        </p>
      </div>
    </footer>
  );
}
