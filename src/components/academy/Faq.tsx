import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { faqs } from "@/data/content";
import { Reveal, SectionHeading } from "./shared";

export function Faq() {
  // One item open at a time; -1 means everything is closed.
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="scroll-mt-28 border-y border-gold/10 bg-panel/50 px-5 py-14 sm:px-6 sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1000px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Pinned on lg so the heading keeps the questions company as they scroll. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Questions"
            title="Before You"
            highlight="Join"
            intro="A few things parents usually ask before the first class."
          />
        </div>

        <div className="divide-y divide-gold/15 border-y border-gold/15">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={item.question} delay={index * 60}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    className="focus-ring flex w-full items-center justify-between gap-5 py-5 text-left font-utility text-sm font-semibold text-heading transition-colors hover:text-gold"
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-6 shrink-0 place-items-center text-gold transition-transform duration-300",
                        isOpen ? "rotate-180" : "rotate-0",
                      )}
                    >
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  hidden={!isOpen}
                  className="pb-5"
                >
                  <p className="max-w-prose text-sm leading-[1.65] text-body">{item.answer}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
