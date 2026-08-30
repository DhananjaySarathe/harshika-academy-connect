import { Check, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { academy, faculty, hero, heroPortrait } from "@/data/content";
import { ctaClass, eyebrowClass, ghostClass, Marker, Reveal } from "./shared";

export function Hero() {
  const lead = faculty[0];

  return (
    <section
      id="home"
      className="scroll-mt-20 border-b border-line bg-surface px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <p className={eyebrowClass}>{hero.eyebrow}</p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-4 text-[clamp(2rem,5.2vw,3.5rem)] font-extrabold leading-[1.06] tracking-tight text-ink-1">
              Harshika Academy
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-4 max-w-xl text-lg leading-[1.6] text-ink-2">
              Concept-first coaching for <Marker>Classes 6 to 12</Marker> by CTET-qualified faculty.
            </p>
          </Reveal>

          <ul className="mt-7 space-y-3">
            {hero.bullets.map((bullet, index) => (
              <Reveal as="li" key={bullet} delay={200 + index * 70} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime-tint"
                >
                  <Check className="size-3 text-ink-1" strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-[1.6] text-ink-2">{bullet}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={440}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className={cn(ctaClass, "h-12")}>
                Enquire about admission
              </a>
              <a href={academy.phoneHref} className={cn(ghostClass, "h-12")}>
                <Phone className="size-4 text-ink-3" aria-hidden="true" />
                Call {academy.phone}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative mx-auto w-full max-w-[460px]">
          <div className="overflow-hidden rounded-xl border border-line bg-surface-2">
            <img
              src={heroPortrait.src}
              alt={heroPortrait.alt}
              width={1040}
              height={1300}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          {/* A caption card instead of a gradient scrim — no text over the photo. */}
          <div className="mt-3 rounded-lg border border-line bg-surface-2 px-4 py-3">
            <p className="text-sm font-semibold text-ink-1">{lead?.name}</p>
            <p className="text-xs text-ink-3">{lead?.role}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
