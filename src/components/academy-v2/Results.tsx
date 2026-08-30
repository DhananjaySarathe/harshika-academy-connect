import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { results } from "@/data/content";
import { useReducedMotion } from "@/hooks/use-motion";
import { cardClass, SectionHeading } from "./shared";

export function Results() {
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

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: reducedMotion ? "auto" : "smooth" });
  };

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

  const arrowClass =
    "focus-ring-ink grid size-10 place-items-center rounded-lg border border-line bg-surface-2 text-ink-1 transition-colors hover:bg-surface disabled:opacity-40";

  return (
    <section id="results" className="scroll-mt-20 bg-canvas px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between gap-5">
          <SectionHeading eyebrow="Our results" title="Students who" highlight="made it count" />
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous results"
              disabled={atStart}
              onClick={() => scrollByCard(-1)}
              className={arrowClass}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next results"
              disabled={atEnd}
              onClick={() => scrollByCard(1)}
              className={arrowClass}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={syncEdges}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          tabIndex={0}
          role="group"
          aria-label="Student results, scroll horizontally"
          className={cn(
            "focus-ring-ink no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2",
            dragging ? "cursor-grabbing select-none" : "sm:cursor-grab",
          )}
        >
          {results.map((item) => (
            <article
              key={`${item.name}-${item.className}`}
              className={`${cardClass} w-[260px] shrink-0 snap-start overflow-hidden sm:w-[300px]`}
            >
              {/* Initials, not a photograph: we do not hold consent to publish
                  these students' faces. Swap in a portrait once we do. */}
              <div
                aria-hidden="true"
                className="flex aspect-[4/3] w-full items-center justify-center border-b border-ink-4/15 bg-lime/10"
              >
                <span className="text-4xl font-bold tracking-tight text-ink-2/70">
                  {item.initials}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">
                  {item.className}
                </p>
                <h3 className="mt-1.5 text-[15px] font-semibold text-ink-1">{item.name}</h3>
                <p className="mt-2.5 text-xl font-bold tracking-tight text-ink-1">{item.result}</p>
                <p className="mt-1.5 text-xs text-ink-3">{item.school}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-3 text-xs text-ink-3 sm:hidden">Swipe to see more students.</p>
      </div>
    </section>
  );
}
