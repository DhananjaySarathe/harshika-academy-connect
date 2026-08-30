import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { academy, faculty, hero, heroPortrait, whatsappUrl } from "@/data/content";
import { GoldArc, Reveal } from "./shared";

export function Hero() {
  const lead = faculty[0];

  return (
    <section
      id="home"
      className="relative flex min-h-svh scroll-mt-28 items-center overflow-hidden px-5 pb-24 pt-28 sm:px-6 sm:pt-32"
    >
      {/* Soft gold glow behind the portrait. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(227,178,60,0.10),transparent_42%)]"
      />

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="relative z-10">
          <Reveal>
            <p className="font-utility text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 flex flex-col font-display text-[clamp(3rem,11vw,6rem)] uppercase leading-[0.84] tracking-tight text-heading">
              <span className="gold-foil">Harshika</span>
              <span>Academy</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-lg text-base leading-[1.65] text-body sm:text-lg">
              {hero.subline}
            </p>
          </Reveal>

          <ul className="mt-7 space-y-3 text-sm leading-[1.65] text-heading/90 sm:text-base">
            {hero.bullets.map((bullet, index) => (
              <Reveal as="li" key={bullet} delay={220 + index * 70} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-fill"
                />
                {bullet}
              </Reveal>
            ))}
          </ul>

          <Reveal delay={460}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="focus-ring h-12 rounded-full bg-gold-fill px-6 font-utility text-xs font-bold uppercase tracking-wider text-on-gold transition-colors hover:bg-gold-fill-strong"
              >
                <a href="#contact">Enquire About Admission</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="focus-ring h-12 rounded-full border-gold/40 bg-transparent px-6 font-utility text-xs font-bold uppercase tracking-wider text-heading transition-colors hover:border-gold hover:bg-gold/10 hover:text-heading"
              >
                <a href={academy.phoneHref}>
                  <Phone className="size-4" aria-hidden="true" />
                  Call {academy.phone}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative mx-auto w-full max-w-[520px]">
          <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-gold/5 blur-3xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/20 bg-panel">
            <img
              src={heroPortrait.src}
              alt={heroPortrait.alt}
              width={1040}
              height={1300}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
            {/* Scrim so the caption stays readable over a busy photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-page via-page/10 to-transparent"
            />
            <span className="absolute bottom-5 left-5 font-utility text-[10px] uppercase tracking-[0.2em] text-gold/80">
              {lead?.name} · {lead?.role}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Signature arc, use 1 of 2. */}
      <GoldArc className="absolute inset-x-0 bottom-0 h-16 w-full" />
    </section>
  );
}
