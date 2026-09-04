import Lenis from "lenis";

let instance: Lenis | null = null;

/**
 * Inertial smooth scrolling, the piece that makes a scroll feel "buttery".
 *
 * Lenis smooths wheel/trackpad deltas and drives `window.scrollTo` each frame,
 * so native scroll events still fire — the reveal ticker, scroll-spy and the
 * progress bar in `use-motion.ts` keep working unchanged, and `position:
 * sticky` still pins. `anchors: true` makes real `<a href="#…">` links glide.
 *
 * Off entirely under prefers-reduced-motion and on touch devices, where the OS
 * already owns the scroll physics and fighting it feels broken.
 */
export function startSmoothScroll(): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    anchors: true,
    autoRaf: true,
  });
  instance = lenis;

  return () => {
    lenis.destroy();
    if (instance === lenis) instance = null;
  };
}

/**
 * Scroll the window to an element or a pixel offset.
 *
 * While Lenis is running, a native `behavior: "smooth"` scroll fights its
 * inertia — two easings driving the same scroll position — so window scrolls
 * go through Lenis instead. Lenis does not read `scroll-margin-top`, so the
 * element's own margin is applied as the offset to match what
 * `scrollIntoView` would have done. Without Lenis, the browser handles it.
 */
export function scrollWindowTo(target: HTMLElement | number, reducedMotion = false) {
  if (instance) {
    const offset =
      typeof target === "number" ? 0 : -parseFloat(getComputedStyle(target).scrollMarginTop || "0");
    instance.scrollTo(target, { offset, immediate: reducedMotion });
    return;
  }
  const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ behavior, block: "start" });
}
