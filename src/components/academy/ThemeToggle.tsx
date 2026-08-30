import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { applyTheme, DEFAULT_THEME, readStoredTheme, storeTheme, type Theme } from "@/lib/theme";

/**
 * Dark/light switch. The server can't know the visitor's choice, so this renders
 * the default on the server and syncs to the stored value on mount — the inline
 * script in __root.tsx has already painted the right theme by then, so there is
 * no flash, only this button's icon settling.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.dataset["theme"] as Theme | undefined) ??
      readStoredTheme() ??
      DEFAULT_THEME;
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    storeTheme(next);
  };

  const nextLabel = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${nextLabel} mode`}
      title={`Switch to ${nextLabel} mode`}
      className={cn(
        "focus-ring grid size-9 shrink-0 place-items-center rounded-full border border-gold/25 text-gold transition-colors hover:border-gold hover:bg-gold/10",
        className,
      )}
    >
      {/* Before mount the stored choice isn't known, so render neither icon
          rather than flashing the wrong one. */}
      {mounted ? (
        theme === "dark" ? (
          <Sun className="size-4" aria-hidden="true" />
        ) : (
          <Moon className="size-4" aria-hidden="true" />
        )
      ) : (
        <span className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
