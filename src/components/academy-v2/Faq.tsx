import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { faqs } from "@/data/content";
import { Reveal, SectionHeading } from "./shared";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-y border-line bg-surface px-5 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto grid max-w-[1000px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <SectionHeading
          eyebrow="Questions"
          title="Before you"
          highlight="join"
          intro="A few things parents usually ask before the first class."
        />

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={item.question} delay={index * 60}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`v2-faq-panel-${index}`}
                    id={`v2-faq-trigger-${index}`}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    className="focus-ring-ink flex w-full items-center justify-between gap-5 py-4 text-left text-[15px] font-semibold text-ink-1 transition-colors hover:text-ink-2"
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-ink-2 transition-transform duration-300",
                        isOpen ? "rotate-180" : "rotate-0",
                      )}
                    >
                      {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                    </span>
                  </button>
                </h3>
                <div
                  id={`v2-faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`v2-faq-trigger-${index}`}
                  hidden={!isOpen}
                  className="pb-4"
                >
                  <p className="max-w-prose text-sm leading-[1.7] text-ink-2">{item.answer}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
