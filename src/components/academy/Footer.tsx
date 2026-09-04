import { academy, fullAddress, navItems } from "@/data/content";
import { LogoLockup } from "./shared";

export function Footer() {
  return (
    // pb-28 on small screens keeps the copyright clear of the floating
    // WhatsApp button when you reach the very bottom of the page.
    <footer className="border-t border-gold/15 bg-page px-5 pb-28 pt-14 sm:px-6 sm:pb-14">
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-3">
        <div>
          <LogoLockup />
          <p className="mt-6 font-utility text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            {academy.tagline}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-[1.65] text-body">
            A coaching academy in {academy.city} for clear concepts, steady practice and honest
            guidance.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-utility text-xs font-semibold uppercase tracking-widest text-gold">
            Explore
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 text-sm text-body">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="focus-ring rounded hover:text-gold">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-utility text-xs font-semibold uppercase tracking-widest text-gold">
            Reach Us
          </h2>
          <address className="mt-5 text-sm not-italic leading-[1.65] text-body">
            {fullAddress}
            <br />
            <a href={academy.phoneHref} className="focus-ring rounded hover:text-gold">
              {academy.phone}
            </a>
            <br />
            <a href={`mailto:${academy.email}`} className="focus-ring rounded hover:text-gold">
              {academy.email}
            </a>
          </address>
          <ul className="mt-4 flex flex-wrap gap-4 text-xs text-body">
            {academy.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring rounded hover:text-gold"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1200px] flex-col justify-between gap-3 border-t border-gold/10 pt-6 text-[10px] uppercase tracking-wider text-body sm:flex-row">
        <span>© 2026 {academy.name}. All rights reserved.</span>
        <span>{academy.strapline}</span>
      </div>
    </footer>
  );
}
