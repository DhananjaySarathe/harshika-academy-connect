import { admissionSteps } from "@/data/content";
import { Reveal, SectionHeading } from "./shared";

export function Admission() {
  return (
    <section
      id="admission"
      className="scroll-mt-28 border-y border-gold/10 bg-panel/60 px-5 py-14 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Getting Started"
          title="Two Steps"
          highlight="to Join"
          align="center"
        />

        <ol className="relative mt-14 grid gap-10 md:grid-cols-2 md:gap-10">
          {/* Connector line, desktop only — it sits behind the numbered discs. */}
          <span
            aria-hidden="true"
            /* Inset to the centre of the first and last disc, derived from the
               step count so it cannot go stale if a step is added or removed. */
            style={{ inset: `1.5rem ${100 / (admissionSteps.length * 2)}% auto` }}
            className="absolute top-6 hidden h-px bg-gold/30 md:block"
          />
          {admissionSteps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 120}
              className="relative flex gap-4 md:block md:text-center"
            >
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-gold bg-page font-display text-xl text-gold md:mx-auto">
                {index + 1}
              </span>
              <div className="pt-1 md:pt-6">
                <h3 className="font-utility text-sm font-semibold text-heading">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-[1.65] text-body md:mx-auto">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
