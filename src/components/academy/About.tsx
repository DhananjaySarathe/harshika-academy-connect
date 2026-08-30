import { about, aboutImages, pillars } from "@/data/content";
import { PillarGlyph, Reveal, SectionHeading } from "./shared";

export function About() {
  return (
    <section id="about" className="scroll-mt-28 px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[520px] pb-12 sm:pb-14">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-gold/20">
            <img
              src={aboutImages.classroom.src}
              alt={aboutImages.classroom.alt}
              loading="lazy"
              decoding="async"
              width={1100}
              height={825}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-2 w-2/5 min-w-[130px] max-w-[200px] overflow-hidden rounded-2xl border border-gold/25 elevate-lg ring-4 ring-page sm:right-0">
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
            eyebrow="About Us"
            title="A Classroom Where"
            highlight="Doubts Are Welcome"
          />

          <div className="mt-7 space-y-5 text-sm leading-[1.65] text-body sm:text-base">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 80} as="div">
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid gap-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90}>
                <div className="gold-border-glow rounded-2xl border border-gold/[0.18] bg-panel p-5">
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
    </section>
  );
}
