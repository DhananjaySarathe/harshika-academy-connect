import { academy, fullAddress, navItems } from "@/data/content";
import { LogoLockup } from "./shared";

export function Footer() {
  return (
    <footer className="bg-canvas px-5 pb-28 pt-14 sm:px-6 sm:pb-14">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-3">
        <div>
          <LogoLockup />
          <p className="mt-5 text-[13px] font-semibold text-ink-2">{academy.tagline}</p>
          <p className="mt-2.5 max-w-xs text-sm leading-[1.65] text-ink-3">
            A local academy in {academy.city} for clear concepts, steady practice and honest
            guidance.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2.5 text-sm text-ink-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="focus-ring-ink rounded hover:text-ink-1">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Reach us</h2>
          <address className="mt-4 text-sm not-italic leading-[1.65] text-ink-2">
            {fullAddress}
            <br />
            <a href={academy.phoneHref} className="focus-ring-ink rounded hover:text-ink-1">
              {academy.phone}
            </a>
            <br />
            <a href={`mailto:${academy.email}`} className="focus-ring-ink rounded hover:text-ink-1">
              {academy.email}
            </a>
          </address>
          <ul className="mt-3.5 flex flex-wrap gap-4 text-xs text-ink-3">
            {academy.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring-ink rounded hover:text-ink-1"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1200px] flex-col justify-between gap-2 border-t border-line pt-5 text-xs text-ink-3 sm:flex-row">
        <span>© 2026 {academy.name}. All rights reserved.</span>
        <span>{academy.strapline}</span>
      </div>
    </footer>
  );
}
