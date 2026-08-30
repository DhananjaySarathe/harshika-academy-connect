import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { academy, navItems, whatsappUrl } from "@/data/content";
import { onViewportChange, useReducedMotion } from "@/hooks/use-motion";
import { ctaClass, LogoLockup } from "./shared";

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

        let current = navItems[0]?.id ?? "home";
        for (const item of navItems) {
          const element = document.getElementById(item.id);
          if (element && element.getBoundingClientRect().top <= SPY_OFFSET) current = item.id;
        }

        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        const last = navItems[navItems.length - 1];
        setActive(atBottom && last ? last.id : current);
      }),
    [],
  );

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
      element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      setActive(id);
    },
    [reducedMotion],
  );

  return (
    <header>
      <a
        href="#home"
        className="focus-ring-ink sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-lime focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-1"
      >
        Skip to content
      </a>

      {/* A plain top bar rather than a floating pill: on a light canvas a solid
          bar with a hairline reads more clearly than a translucent capsule. */}
      <nav
        aria-label="Primary"
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200",
          scrolled ? "border-line bg-canvas/95 backdrop-blur-md" : "border-transparent bg-canvas",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-5 sm:px-6">
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
                      "focus-ring-ink relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-ink-1" : "text-ink-3 hover:text-ink-1",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-lime-strong transition-transform duration-200",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(ctaClass, "h-9 px-3 text-[13px] sm:px-4")}
            >
              WhatsApp<span className="hidden sm:inline">&nbsp;us</span>
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-v2"
              onClick={() => setMenuOpen((open) => !open)}
              className="focus-ring-ink grid size-9 place-items-center rounded-lg border border-line text-ink-1 transition-colors hover:bg-surface-2 lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-menu-v2"
          className="fixed inset-0 top-16 z-40 overflow-y-auto border-t border-line bg-canvas px-5 py-6 lg:hidden"
        >
          <ul className="divide-y divide-line">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => goTo(item.id)}
                  className={cn(
                    "focus-ring-ink w-full rounded-md py-4 text-left text-lg font-semibold transition-colors",
                    active === item.id ? "text-ink-1" : "text-ink-2 hover:text-ink-1",
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-3">{academy.tagline}</p>
        </div>
      ) : null}
    </header>
  );
}
