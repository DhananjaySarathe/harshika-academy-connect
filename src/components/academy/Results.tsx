import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { results } from "@/data/content";
import { useReducedMotion } from "@/hooks/use-motion";
import { Reveal, SectionHeading } from "./shared";

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

  /** Scroll by roughly one card, whatever the current breakpoint's card width is. */
  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: reducedMotion ? "auto" : "smooth" });
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

  return (
    <section id="results" className="scroll-mt-28 px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between gap-5">
          <SectionHeading eyebrow="Our Results" title="Students Who" highlight="Made It Count" />
          <div className="hidden shrink-0 gap-2 sm:flex">
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
            "focus-ring no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4",
            dragging ? "cursor-grabbing select-none" : "sm:cursor-grab",
          )}
        >
          {results.map((item) => (
            <article
              key={`${item.name}-${item.className}`}
              className="w-[270px] shrink-0 snap-start overflow-hidden rounded-2xl border border-gold/[0.18] bg-panel sm:w-[320px]"
            >
              <img
                src={item.image}
                alt={`${item.name}, ${item.className}`}
                loading="lazy"
                decoding="async"
                draggable={false}
                width={720}
                height={540}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-5">
                <p className="font-utility text-[10px] uppercase tracking-wider text-gold">
                  {item.className}
                </p>
                <h3 className="mt-2 font-utility font-semibold text-heading">{item.name}</h3>
                <p className="mt-3 font-display text-2xl uppercase leading-tight text-gold">
                  {item.result}
                </p>
                <p className="mt-2 text-xs text-body">{item.school}</p>
              </div>
            </article>
          ))}
        </div>

        <Reveal>
          <p className="mt-2 text-xs text-body sm:hidden">Swipe to see more students.</p>
        </Reveal>
      </div>
    </section>
  );
}
