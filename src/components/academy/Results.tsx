import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { scrollWindowTo } from "@/lib/smooth-scroll";
import { results } from "@/data/content";
import { useReducedMotion } from "@/hooks/use-motion";
import { Reveal, SectionHeading } from "./shared";

/**
 * Two behaviours from one markup, chosen by CSS (see `.results-rail` in
 * styles.css):
 *
 * - Rail mode — motion allowed and `animation-timeline` supported, on every
 *   viewport. The section grows tall, the heading and track pin, and the
 *   page's vertical scroll drives the track sideways — on a phone that means
 *   a vertical swipe moves the row. A gold progress line runs the same
 *   timeline. Arrows and the swipe hint hide; the page IS the scroller.
 * - Fallback — reduced motion, or no scroll-driven animation (Firefox). The
 *   original horizontal rail: native overflow, snap points, arrows on sm+,
 *   mouse drag on desktop.
 *
 * Nothing here branches on which mode is active except the focus handler,
 * which has to know whether a card can be scrolled into view natively.
 */
export function Results() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useReducedMotion();

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges]);

  /** Scroll by roughly one card, whatever the current breakpoint's card width is. */
  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: reducedMotion ? "auto" : "smooth" });
  };

  /**
   * In rail mode a focused card may be translated off-screen, and the browser
   * cannot scroll a transform into view. Move the page to the vertical
   * position that brings that card on-screen instead.
   */
  const onTrackFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    if (getComputedStyle(track).animationName !== "rail-slide") return;
    const card = (event.target as HTMLElement).closest("article");
    if (!card) return;
    const cards = [...track.querySelectorAll("article")];
    const index = cards.indexOf(card);
    if (index < 0) return;
    const progress = cards.length > 1 ? index / (cards.length - 1) : 0;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const runway = section.offsetHeight - window.innerHeight;
    scrollWindowTo(Math.round(sectionTop + progress * runway), reducedMotion);
  };

  // Click-and-drag on desktop. Touch devices already scroll natively, so mouse only.
  const drag = useRef({ startX: 0, startScroll: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    setDragging(true);
    drag.current = { startX: event.clientX, startScroll: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = drag.current.startScroll - (event.clientX - drag.current.startX);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    trackRef.current?.releasePointerCapture(event.pointerId);
  };

  const showSampleTags = import.meta.env.DEV;

  return (
    <section
      ref={sectionRef}
      id="results"
      className="results-rail scroll-mt-28 py-14 sm:py-24 lg:py-28"
      style={{ "--rail-cards": results.length } as React.CSSProperties}
    >
      <div className="results-pin">
        <div className="results-inner mx-auto w-full max-w-[1200px] px-5 sm:px-6">
          <div className="flex items-end justify-between gap-5">
            <SectionHeading eyebrow="Our Results" title="Students Who" highlight="Made It Count" />
            <div className="results-arrows hidden shrink-0 gap-2 sm:flex">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous results"
                disabled={atStart}
                onClick={() => scrollByCard(-1)}
                className="focus-ring rounded-full border-gold/30 bg-transparent text-gold transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold disabled:opacity-30"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next results"
                disabled={atEnd}
                onClick={() => scrollByCard(1)}
                className="focus-ring rounded-full border-gold/30 bg-transparent text-gold transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold disabled:opacity-30"
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Rail mode only: how far along the row you are. */}
          <div aria-hidden="true" className="results-progress mt-6 hidden h-px w-full bg-gold/15">
            <span className="block h-full w-full origin-left bg-gold-fill" />
          </div>

          <div
            ref={trackRef}
            onScroll={syncEdges}
            onFocus={onTrackFocus}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            tabIndex={0}
            role="group"
            aria-label="Student results"
            className={cn(
              "results-track focus-ring no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4",
              dragging ? "cursor-grabbing select-none" : "sm:cursor-grab",
            )}
          >
            {results.map((item) => (
              <article
                key={`${item.name}-${item.className}`}
                tabIndex={0}
                className="focus-ring relative w-[270px] shrink-0 snap-start overflow-hidden rounded-2xl border border-gold/[0.18] bg-panel sm:w-[320px]"
              >
                {showSampleTags && item.placeholder ? (
                  <span className="absolute right-3 top-3 z-10 rounded bg-danger px-1.5 py-0.5 font-utility text-[9px] font-bold uppercase tracking-wider text-white">
                    sample
                  </span>
                ) : null}
                {/* Initials, not a photograph: we do not hold consent to publish
                    these students' faces. Swap in a portrait once we do. */}
                <div
                  aria-hidden="true"
                  className="flex aspect-[4/3] w-full items-center justify-center border-b border-gold/[0.18] bg-gold/[0.06]"
                >
                  <span className="font-display text-5xl uppercase tracking-[0.1em] text-gold/70">
                    {item.initials}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-utility text-[10px] uppercase tracking-wider text-gold">
                    {item.className}
                  </p>
                  <h3 className="mt-2 font-utility font-semibold text-heading">{item.name}</h3>
                  <p className="mt-3 font-display text-2xl uppercase leading-tight text-gold">
                    {item.result}
                  </p>
                  <p className="mt-2 text-xs text-body">{item.note}</p>
                </div>
              </article>
            ))}
          </div>

          <Reveal>
            <p className="results-hint mt-2 text-xs text-body sm:hidden">
              Swipe to see more students.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
