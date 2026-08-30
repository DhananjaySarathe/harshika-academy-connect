import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { courseTabs, whatsappUrl } from "@/data/content";
import { cardClass, Reveal, SectionHeading, SubjectGlyph } from "./shared";

export function Courses() {
  const [active, setActive] = useState(0);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const measure = () => {
      const tab = tabRefs.current[active];
      const list = listRef.current;
      if (!tab || !list) return;
      setIndicator({ left: tab.offsetLeft - list.scrollLeft, width: tab.offsetWidth });
    };

    measure();
    window.addEventListener("resize", measure);
    const list = listRef.current;
    list?.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      list?.removeEventListener("scroll", measure);
    };
  }, [active]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = courseTabs.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = courseTabs[active];

  return (
    <section
      id="courses"
      className="scroll-mt-20 border-y border-line bg-surface px-5 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="What we teach"
          title="Courses and"
          highlight="batches"
          intro="Clear teaching, regular practice and guidance suited to where your child is today."
        />

        <Reveal delay={100}>
          <div
            ref={listRef}
            role="tablist"
            aria-label="Course groups"
            onKeyDown={onKeyDown}
            className="no-scrollbar relative mt-8 flex gap-1 overflow-x-auto border-b border-line pb-px"
          >
            {courseTabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`v2-tab-${tab.id}`}
                aria-selected={active === index}
                aria-controls={`v2-panel-${tab.id}`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "focus-ring-ink shrink-0 rounded-t-md px-4 py-3 text-sm font-semibold transition-colors",
                  active === index ? "text-ink-1" : "text-ink-3 hover:text-ink-1",
                )}
              >
                {tab.label}
              </button>
            ))}

            {indicator ? (
              <span
                aria-hidden="true"
                className="absolute bottom-0 h-0.5 rounded-full bg-lime-strong transition-[left,width] duration-300 ease-out"
                style={{ left: indicator.left, width: indicator.width }}
              />
            ) : null}
          </div>
        </Reveal>

        {current ? (
          <div
            role="tabpanel"
            id={`v2-panel-${current.id}`}
            aria-labelledby={`v2-tab-${current.id}`}
            tabIndex={0}
            className="focus-ring-ink mt-7 rounded-lg"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {current.subjects.map((subject, index) => (
                <Reveal key={`${current.id}-${subject.name}`} delay={index * 80}>
                  <div className={`${cardClass} flex h-full flex-col p-5`}>
                    <span className="mb-4 grid size-10 place-items-center rounded-lg bg-surface">
                      <SubjectGlyph icon={subject.icon} />
                    </span>
                    <h3 className="text-base font-semibold text-ink-1">{subject.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-[1.65] text-ink-2">
                      {subject.description}
                    </p>
                    <span className="mt-5 inline-flex w-fit rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-ink-3">
                      {subject.timing} batch
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-7 text-sm leading-[1.65] text-ink-2">
              For batch timings and admission details,{" "}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring-ink rounded font-semibold text-ink-1 underline decoration-lime-strong decoration-2 underline-offset-4"
              >
                message us on WhatsApp
              </a>
              .
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
