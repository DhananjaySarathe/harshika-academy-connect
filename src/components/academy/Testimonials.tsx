import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { testimonials } from "@/data/content";
import { useReducedMotion } from "@/hooks/use-motion";
import { Reveal, SectionHeading } from "./shared";

const AUTOPLAY_MS = 6500;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  // Autoplay pauses on hover, on keyboard focus, and for reduced-motion visitors.
  useEffect(() => {
    if (paused || reducedMotion || testimonials.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % testimonials.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const go = (delta: number) =>
    setIndex((value) => (value + delta + testimonials.length) % testimonials.length);

  const current = testimonials[index];
  if (!current) return null;

  return (
    <section id="testimonials" className="scroll-mt-28 px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[900px]">
        <SectionHeading
          eyebrow="Testimonials"
          title="Words From Parents"
          highlight="& Students"
          align="center"
        />

        <Reveal delay={120}>
          <div
            className="relative mt-10 rounded-2xl border border-gold/[0.18] bg-panel px-5 py-10 sm:px-16"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* Live region so a screen reader hears each slide as it changes. */}
            <div aria-live="polite" aria-atomic="true">
              <blockquote className="text-center text-lg leading-[1.6] text-heading sm:text-xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/15 font-utility text-xs font-bold text-gold"
                >
                  {current.initials}
                </span>
                <span className="text-left">
                  <span className="block font-utility text-sm font-semibold text-heading">
                    {current.name}
                  </span>
                  <span className="block text-xs text-body">{current.relation}</span>
                </span>
              </figcaption>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              {testimonials.map((item, dot) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Show testimonial ${dot + 1} of ${testimonials.length}`}
                  aria-current={dot === index}
                  onClick={() => setIndex(dot)}
                  className={cn(
                    "focus-ring size-2.5 rounded-full transition-colors",
                    dot === index ? "bg-gold-fill" : "bg-gold/25 hover:bg-gold/50",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="focus-ring absolute left-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-gold transition-colors hover:bg-gold/10 sm:left-3"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="focus-ring absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-gold transition-colors hover:bg-gold/10 sm:right-3"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
