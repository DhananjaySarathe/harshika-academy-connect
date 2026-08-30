import { admissionSteps } from "@/data/content";
import { Reveal, SectionHeading } from "./shared";

export function Admission() {
  return (
    <section
      id="admission"
      className="scroll-mt-20 border-y border-line bg-surface px-5 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Getting started"
          title="Two steps"
          highlight="to join"
          align="center"
        />

        <ol className="relative mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          <span
            aria-hidden="true"
            /* Inset to the centre of the first and last disc, derived from the
               step count so it cannot go stale if a step is added or removed. */
            style={{ inset: `1.25rem ${100 / (admissionSteps.length * 2)}% auto` }}
            className="absolute top-5 hidden h-px bg-line md:block"
          />
          {admissionSteps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 120}
              className="relative flex gap-4 md:block md:text-center"
            >
              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-line bg-canvas text-sm font-bold text-ink-1 md:mx-auto">
                {index + 1}
              </span>
              <div className="md:pt-5">
                <h3 className="text-[15px] font-semibold text-ink-1">{step.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-[1.65] text-ink-2 md:mx-auto">
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
