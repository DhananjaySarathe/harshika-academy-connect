import { about, aboutImages, pillars } from "@/data/content";
import { PillarGlyph, Reveal, SectionHeading } from "./shared";

/**
 * Split layout with the photographs pinned on lg while the copy scrolls
 * past them. The two photos ride a view timeline on the section and drift in
 * opposite directions, so they read as two layers rather than one flat image.
 * A ghosted "DOUBTS" behind the heading drifts the other way for the same
 * reason. All of it is CSS (see `.about-*` in styles.css) and all of it is
 * off under reduced motion.
 */
export function About() {
  return (
    <section
      id="about"
      className="about-section relative scroll-mt-28 px-5 py-14 sm:px-6 sm:py-24 lg:py-28"
    >
      {/* Clips only the ghost word; the pinned column is a sibling, so sticky
          is unaffected. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="about-ghost absolute -right-2 top-8 select-none font-display text-[22vw] uppercase leading-none text-gold/[0.06] lg:top-14 lg:text-[16vw]">
          Doubts
        </span>
      </div>

      <div className="relative mx-auto max-w-[1200px]">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <Reveal className="relative mx-auto w-full max-w-[520px] pb-12 sm:pb-14">
              <div className="about-photo-a aspect-[4/3] overflow-hidden rounded-2xl border border-gold/20">
                <img
                  src={aboutImages.classroom.src}
                  alt={aboutImages.classroom.alt}
                  loading="lazy"
                  decoding="async"
                  width={1400}
                  height={1050}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="about-photo-b absolute bottom-0 right-2 w-2/5 min-w-[130px] max-w-[200px] overflow-hidden rounded-2xl border border-gold/25 elevate-lg ring-4 ring-page sm:right-0">
                <img
                  src={aboutImages.student.src}
                  alt={aboutImages.student.alt}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </Reveal>
          </div>

          <div>
            <SectionHeading
              eyebrow="About Us"
              title="A Classroom Where"
              highlight="Doubts Are Welcome"
            />

            <div className="mt-7 space-y-6 text-base leading-[1.7] text-body sm:text-lg">
              {about.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={index * 80} as="div">
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* The three pillars, stacked and numbered, so the copy column is
                tall enough for the photos to stay pinned while it scrolls. */}
            <div className="mt-10 grid gap-3">
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 90}>
                  <div className="gold-border-glow relative overflow-hidden rounded-2xl border border-gold/[0.18] bg-panel p-5">
                    <span
                      aria-hidden="true"
                      className="gold-foil pointer-events-none absolute -right-1 -top-2 font-display text-6xl leading-none opacity-[0.28]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                        <PillarGlyph icon={pillar.icon} />
                      </span>
                      <div>
                        <h3 className="font-utility text-sm font-semibold text-heading">
                          {pillar.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-[1.65] text-body">{pillar.text}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
