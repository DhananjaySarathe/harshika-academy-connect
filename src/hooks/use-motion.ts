import { useEffect, useRef, useState } from "react";

/**
 * True when the visitor has asked for less motion. Starts `false` on the server
 * and during hydration, then settles on the real value in an effect — reading
 * matchMedia during render would break SSR.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

// -----------------------------------------------------------------------------
// Shared viewport ticker
//
// Every scroll-driven feature on the page — the reveals, the nav scroll-spy, the
// progress line, the floating buttons — runs off this one rAF-throttled listener
// instead of registering its own.
// -----------------------------------------------------------------------------

/**
 * `forced` is true when the ticker has given up waiting for animation frames.
 * Return true to say "I'm done" — the ticker then drops the watcher, so the
 * one-shot reveals don't pile up as no-ops for the life of the page.
 */
type Watcher = (forced?: boolean) => boolean | void;

const watchers = new Set<Watcher>();
let listening = false;
let queued = false;
let framesWork = true;
let lastRun = 0;

function runWatchers() {
  queued = false;
  lastRun = Date.now();
  for (const watcher of [...watchers]) {
    if (watcher() === true) watchers.delete(watcher);
  }
}

function schedule() {
  if (framesWork) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(runWatchers);
    return;
  }
  // No animation frames in this environment, so throttle on the clock instead.
  if (Date.now() - lastRun < 16) return;
  runWatchers();
}

let framesChecked = false;

/**
 * Some environments (throttled background tabs, headless renderers, aggressive
 * battery savers) never deliver animation frames. Reveals hide their content
 * until a frame arrives, so that would leave the page blank. Probe once, and if
 * no frame lands within a second, switch the ticker to plain timers and tell
 * every watcher to give up waiting and show itself.
 */
function verifyFramesArrive() {
  if (framesChecked) return;
  framesChecked = true;

  let arrived = false;
  requestAnimationFrame(() => {
    arrived = true;
  });

  window.setTimeout(() => {
    if (arrived) return;
    framesWork = false;
    // The probe frame never ran, so `queued` is stuck true and would block
    // every future schedule() — clear it before falling back to timers.
    queued = false;
    for (const watcher of [...watchers]) {
      if (watcher(true) === true) watchers.delete(watcher);
    }
  }, 1000);
}

/** Register a callback to run on scroll and resize. Returns an unsubscribe fn. */
export function onViewportChange(watcher: Watcher) {
  watchers.add(watcher);

  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // Browsers suspend animation frames for hidden documents, so a page opened
    // in a background tab has no frames until it is looked at. Re-run on the
    // way back rather than waiting for the throttled failsafe timer.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;
      queued = false;
      schedule();
    });
  }

  verifyFramesArrive();
  schedule();
  return () => {
    watchers.delete(watcher);
  };
}

/**
 * True once the element has scrolled far enough into the viewport, and stays
 * true afterwards — reveals never play backwards.
 *
 * This uses getBoundingClientRect rather than IntersectionObserver on purpose:
 * the reveal hides content until it fires, so an observer that reports late (or
 * never) would leave a blank page. A rect check always answers.
 */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let done = false;

    // Returning true retires this watcher — a reveal only ever happens once.
    const check = (forced?: boolean) => {
      if (done) return true;

      if (!forced) {
        const rect = element.getBoundingClientRect();
        // How much of the element must clear the bottom edge before it reveals,
        // capped so a very tall block still animates as soon as it appears.
        const lead = Math.min(rect.height * threshold, window.innerHeight * 0.2);
        if (rect.top + lead >= window.innerHeight || rect.bottom <= 0) return false;
      }

      done = true;
      setInView(true);
      return true;
    };

    const stop = onViewportChange(check);
    // Anything already on screen at mount reveals without waiting for a frame.
    check();
    return stop;
  }, [threshold]);

  return { ref, inView };
}

/**
 * Counts from 0 up to `target` once `active` turns true.
 * With reduced motion the final value appears immediately.
 */
export function useCountUp(target: number, active: boolean, duration = 1400) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced || duration <= 0) {
      setValue(target);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      start ??= now;
      const progress = Math.min(1, (now - start) / duration);
      // easeOutCubic — fast at first, settles gently on the final number.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // If animation frames never arrive, the number must still reach its target.
    const failsafe = window.setTimeout(() => setValue(target), duration + 600);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
    };
  }, [target, active, duration, reduced]);

  return value;
}
