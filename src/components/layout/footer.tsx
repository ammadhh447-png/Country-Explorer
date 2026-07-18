import Link from "next/link";
import { SiteLogo } from "@/components/brand/site-logo";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/time", label: "World Time" },
  { href: "/countries", label: "Countries" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/50 w-full min-w-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
          <div className="flex justify-center md:justify-start min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <SiteLogo size={34} />
              <span className="font-serif text-sm font-bold text-foreground">Country Explorer</span>
            </Link>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-accent transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-muted-foreground text-center md:text-right leading-relaxed min-w-0">
            © {year} Country Explorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
