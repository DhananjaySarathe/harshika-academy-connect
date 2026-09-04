import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { courseTabs, whatsappFor } from "@/data/content";
import { Reveal, SectionHeading, SubjectGlyph } from "./shared";

/**
 * The four batches as a deck of cards that stack as you scroll.
 *
 * Each card is `position: sticky`. In normal flow they sit one after another;
 * as the page scrolls, the first card reaches its `top` and pins, and the next
 * one slides up over it. No JavaScript drives this — it is the same mechanism
 * behind the "layers" effect on sites like fora.so, and it keeps working with
 * reduced motion because sticky is layout, not animation.
 *
 * Each card pins 18px lower than the one before, so the finished stack shows a
 * sliver of every card underneath — the deck reads as a deck.
 *
 * A pinned card taller than (viewport - --stack-top) never shows its bottom,
 * because the next card covers it first. So on phones the card is compact:
 * shorter photo, tighter padding, subject descriptions hidden. Measured to fit.
 */
export function CourseStack() {
  return (
    <section
      id="courses"
      className="ink-band relative scroll-mt-28 px-5 py-16 sm:px-6 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Courses & Batches"
          title="What We"
          highlight="Teach"
          intro="Nursery to Class 10 across CBSE and MP Board, plus a dedicated batch for the Navodaya entrance. Scroll through the four."
        />

        <div className="mt-12 sm:mt-16">
          {courseTabs.map((tab, index) => (
            <article
              key={tab.id}
              id={`course-${tab.id}`}
              aria-labelledby={`course-${tab.id}-title`}
              className="stack-card sticky mb-5 overflow-hidden rounded-[1.75rem] border border-gold/20 bg-panel elevate-lg last:mb-0 sm:mb-6"
              style={{ top: `calc(var(--stack-top) + ${index * 18}px)` }}
            >
              <div className="grid lg:min-h-[68vh] lg:grid-cols-[1.05fr_1fr]">
                {/* Photograph side */}
                <div className="relative min-h-[200px] sm:min-h-[300px] lg:min-h-0">
                  <img
                    src={tab.image}
                    alt={tab.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Scrim: fades the photo into the panel so the card reads as one object. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-panel"
                  />
                  <span
                    aria-hidden="true"
                    className="gold-foil absolute left-6 top-5 font-display text-5xl leading-none sm:left-8 sm:top-7 sm:text-6xl"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Copy side */}
                <div className="flex flex-col justify-center p-5 sm:p-10 lg:p-12">
                  <p className="font-utility text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    {tab.label}
                  </p>
                  <h3
                    id={`course-${tab.id}-title`}
                    className="mt-3 font-display text-[clamp(1.75rem,4.2vw,2.75rem)] uppercase leading-[0.95] tracking-tight text-heading"
                  >
                    {tab.tagline}
                  </h3>

                  <ul className="mt-6 space-y-3 sm:mt-7 sm:space-y-4">
                    {tab.subjects.map((subject) => (
                      <li key={subject.name} className="flex gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                          <SubjectGlyph icon={subject.icon} />
                        </span>
                        <div>
                          <p className="font-utility text-sm font-semibold text-heading">
                            {subject.name}
                            <span className="ml-2 font-normal text-body/70">
                              · {subject.timing}
                            </span>
                          </p>
                          <p className="mt-0.5 hidden text-sm leading-[1.6] text-body sm:block">
                            {subject.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 sm:mt-8">
                    <Button
                      asChild
                      className="focus-ring h-12 rounded-full bg-gold-fill px-6 font-utility text-xs font-bold uppercase tracking-wider text-on-gold transition-colors hover:bg-gold-fill-strong"
                    >
                      <a href={whatsappFor(tab.label)} target="_blank" rel="noreferrer noopener">
                        <MessageCircle className="size-4" aria-hidden="true" />
                        Ask about this batch
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Reveal className="mt-10 sm:mt-14">
          <p className="max-w-xl text-sm leading-[1.65] text-body">
            Not sure which batch fits? Send us the class and we will tell you the timings and what
            the first week looks like.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
