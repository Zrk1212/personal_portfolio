import Link from "next/link";
import { PROJECTS } from "@/app/content";
import { LogoMark } from "./logo";

type FooterLink = [label: string, href: string];

function Item({ label, href }: { label: string; href: string }) {
  const cls =
    "m-focus m-th rounded text-[15px] font-[400] leading-[1.35] break-words transition-colors duration-150 hover:text-[var(--fg)]!";
  const style = { color: "var(--muted)" };
  if (/^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {label}
      </a>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} style={style}>
        {label.split("@").map((part, i) => (
          <span key={i}>
            {i > 0 && (
              <>
                <wbr />@
              </>
            )}
            {part}
          </span>
        ))}
      </a>
    );
  }
  // Section links behave like the ones in the nav: a plain jump within the page
  if (href.includes("#")) {
    return (
      <a href={href} className={cls} style={style}>
        {label}
      </a>
    );
  }
  // /apify has its own fonts and look, so it is not fetched ahead of a click
  return (
    <Link href={href} prefetch={href === "/apify" ? false : undefined} className={cls} style={style}>
      {label}
    </Link>
  );
}

export function Footer({ home }: { home: boolean }) {
  const prefix = home ? "" : "/";
  const cols: { title: string; links: FooterLink[] }[] = [
    {
      title: "Tutoring",
      links: [
        ["The five steps", `${prefix}#process`],
        ["Pricing", `${prefix}#pricing`],
        ["Book a session", "/contact"],
      ],
    },
    {
      title: "Learn",
      links: [
        ["What they'll learn", `${prefix}#learn`],
        ["FAQ", `${prefix}#faq`],
        ["About Zac", `${prefix}#about`],
      ],
    },
    {
      title: "My work",
      links: PROJECTS.map((p): FooterLink => [p.title, p.href]),
    },
    {
      title: "More",
      links: [
        ["GitHub", "https://github.com/Zrk1212"],
        ["Data tools on Apify", "/apify"],
        ["zacklein555@gmail.com", "mailto:zacklein555@gmail.com"],
      ],
    },
  ];

  return (
    <footer data-section-theme="dark" className="cl-footer pb-10 pt-6">
      <div className="m-wrap">
        <div className="m-th border-t" style={{ borderColor: "var(--rule)" }} />
        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <Link
              href="/"
              className="m-focus group inline-flex items-center gap-3 rounded text-[27px] font-[600] leading-none tracking-[-0.03em]"
            >
              <LogoMark className="h-[22px] w-auto shrink-0 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none" />
              Zac Klein
            </Link>
            <p className="m-th mt-3 max-w-[320px] text-[14px] leading-[1.5]" style={{ color: "var(--muted)" }}>
              One-on-one AI app tutoring for high schoolers. In person in Westchester or over Zoom.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-[repeat(4,auto)] lg:gap-x-10">
            {cols.map((c) => (
              <div key={c.title} className="min-w-0 lg:max-w-[170px]">
                <div className="text-[15px] font-[600]">{c.title}</div>
                <ul className="mt-4 space-y-3">
                  {c.links.map(([label, href]) => (
                    <li key={label}>
                      <Item label={label} href={href} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="m-th text-[13px]" style={{ color: "var(--muted)" }}>
          © 2026 Zac Klein
        </p>
      </div>
    </footer>
  );
}
