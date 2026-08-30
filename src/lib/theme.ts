export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "harshika-theme";

/** Light is the default; dark is opt-in via the header switch. */
export const DEFAULT_THEME: Theme = "light";

const THEME_COLOR = { dark: "#0B0E14", light: "#FCFAF6" } as const;

/**
 * Applies the theme to <html>. Sets `data-theme` (which the CSS keys off) and
 * keeps the `dark` class in sync, because shadcn's `dark:` variant hooks off
 * the class rather than the attribute.
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset["theme"] = theme;
  root.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch {
    // Private mode or blocked storage — fall back to the default.
    return null;
  }
}

export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Not being able to remember the choice shouldn't break the toggle.
  }
}

/**
 * Runs inline in <head>, before first paint, so a visitor who opted into a
 * non-default theme never sees a flash of the other one while React hydrates.
 * Kept as a string because it has to execute ahead of the bundle.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="light"&&t!=="dark")t=${JSON.stringify(
  DEFAULT_THEME,
)};var r=document.documentElement;r.dataset.theme=t;r.classList.toggle("dark",t==="dark");}catch(e){}})();`;
