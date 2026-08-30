import { about, aboutImages, pillars } from "@/data/content";
import { cardClass, PillarGlyph, Reveal, SectionHeading } from "./shared";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-canvas px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1200px] items-start gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-[520px] pb-12 sm:pb-14">
          <div className="overflow-hidden rounded-xl border border-line">
            <img
              src={aboutImages.classroom.src}
              alt={aboutImages.classroom.alt}
              loading="lazy"
              decoding="async"
              width={1100}
              height={825}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-2 w-2/5 min-w-[130px] max-w-[200px] overflow-hidden rounded-xl border border-line shadow-lg ring-4 ring-canvas sm:right-0">
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

        <div>
          <SectionHeading
            eyebrow="About us"
            title="A classroom where"
            highlight="doubts are welcome"
          />

          <div className="mt-6 space-y-4">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 80}>
                <p className="text-[15px] leading-[1.7] text-ink-2">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90}>
                <div className={`${cardClass} p-5`}>
                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-surface">
                      <PillarGlyph icon={pillar.icon} />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ink-1">{pillar.title}</h3>
                      <p className="mt-1 text-sm leading-[1.65] text-ink-2">{pillar.text}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
