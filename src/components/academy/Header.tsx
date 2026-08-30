import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { academy, navItems, whatsappUrl } from "@/data/content";
import { onViewportChange, useReducedMotion } from "@/hooks/use-motion";
import { LogoLockup } from "./shared";
import { ThemeToggle } from "./ThemeToggle";

/** Distance from the top at which a section counts as "the one you're reading". */
const SPY_OFFSET = 160;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(navItems[0]?.id ?? "home");
  const reducedMotion = useReducedMotion();

  useEffect(
    () =>
      onViewportChange(() => {
        setScrolled(window.scrollY > 80);

        // Walk the sections top-down and keep the last one that has passed the
        // spy line — that's the section filling the viewport.
        let current = navItems[0]?.id ?? "home";
        for (const item of navItems) {
          const element = document.getElementById(item.id);
          if (element && element.getBoundingClientRect().top <= SPY_OFFSET) current = item.id;
        }

        // At the very bottom the last section may never cross the line, so pin to it.
        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        const last = navItems[navItems.length - 1];
        setActive(atBottom && last ? last.id : current);
      }),
    [],
  );

  // Lock the page behind the full-screen mobile menu, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const goTo = useCallback(
    (id: string) => {
      setMenuOpen(false);
      const element = document.getElementById(id);
      if (!element) return;
      // scroll-mt-* on each section keeps the heading clear of the floating bar.
      element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      setActive(id);
    },
    [reducedMotion],
  );

  return (
    <header>
      <a
        href="#home"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-fill focus:px-5 focus:py-2 focus:font-utility focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-on-gold"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className={cn(
          "fixed left-1/2 z-50 w-[calc(100%-20px)] -translate-x-1/2 transition-all duration-300",
          scrolled ? "top-2 max-w-5xl sm:top-3" : "top-4 max-w-6xl sm:top-6",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 rounded-full border border-gold/20 elevate-lg backdrop-blur-md transition-all duration-300",
            scrolled ? "bg-page/95 px-3 py-2 sm:px-5" : "bg-page/70 px-4 py-2.5 sm:px-6",
          )}
        >
          <LogoLockup compact />

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "focus-ring relative rounded-full px-3 py-2 font-utility text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
                      isActive ? "text-gold" : "text-heading/70 hover:text-gold",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-px origin-center bg-gold-fill transition-transform duration-300",
                        isActive ? "scale-x-100 shadow-[0_0_8px_var(--gold)]" : "scale-x-0",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <ThemeToggle className="hidden sm:grid" />
            <Button
              asChild
              className="focus-ring h-9 rounded-full bg-gold-fill px-3 font-utility text-[10px] font-bold uppercase tracking-wider text-on-gold transition-colors hover:bg-gold-fill-strong sm:px-5"
            >
              <a href={whatsappUrl} target="_blank" rel="noreferrer noopener">
                WhatsApp<span className="hidden sm:inline">&nbsp;Us</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="focus-ring size-9 text-heading hover:bg-gold/10 hover:text-gold lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col justify-center gap-2 overflow-y-auto bg-page px-8 py-28 lg:hidden"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              className={cn(
                "focus-ring rounded-lg py-2 text-left font-display text-[clamp(2rem,9vw,3rem)] uppercase leading-tight transition-colors",
                active === item.id ? "text-gold" : "text-heading hover:text-gold",
              )}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-8 flex items-center gap-3 sm:hidden">
            <ThemeToggle />
            <span className="font-utility text-[11px] uppercase tracking-[0.18em] text-body">
              Switch theme
            </span>
          </div>
          <p className="mt-8 font-utility text-[10px] uppercase tracking-[0.28em] text-gold/60">
            {academy.tagline}
          </p>
        </div>
      ) : null}
    </header>
  );
}
