import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

import { cn } from "@/lib/utils";
import { testimonials } from "@/data/content";
import { useReducedMotion } from "@/hooks/use-motion";
import { Reveal, SectionHeading } from "./shared";

const AUTOPLAY_MS = 6500;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

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

  const arrowClass =
    "focus-ring-ink grid size-9 place-items-center rounded-lg text-ink-3 transition-colors hover:bg-surface hover:text-ink-1";

  return (
    <section id="testimonials" className="scroll-mt-20 bg-canvas px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[860px]">
        <SectionHeading
          eyebrow="Testimonials"
          title="Words from parents"
          highlight="and students"
          align="center"
        />

        <Reveal delay={120}>
          <div
            className="relative mt-9 rounded-xl border border-line bg-surface-2 px-5 py-8 sm:px-14 sm:py-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <Quote className="mx-auto size-6 text-ink-4" aria-hidden="true" />

            <div aria-live="polite" aria-atomic="true">
              <blockquote className="mt-4 text-center text-lg leading-[1.6] text-ink-1 sm:text-xl">
                {current.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center justify-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-lime-tint text-xs font-bold text-ink-1"
                >
                  {current.initials}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-ink-1">{current.name}</span>
                  <span className="block text-xs text-ink-3">{current.relation}</span>
                </span>
              </figcaption>
            </div>

            <div className="mt-7 flex items-center justify-center gap-2">
              {testimonials.map((item, dot) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Show testimonial ${dot + 1} of ${testimonials.length}`}
                  aria-current={dot === index}
                  onClick={() => setIndex(dot)}
                  className={cn(
                    "focus-ring-ink h-2 rounded-full transition-all",
                    dot === index ? "w-6 bg-ink-1" : "w-2 bg-line-strong hover:bg-ink-3",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className={cn(arrowClass, "absolute left-2 top-1/2 -translate-y-1/2")}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className={cn(arrowClass, "absolute right-2 top-1/2 -translate-y-1/2")}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
