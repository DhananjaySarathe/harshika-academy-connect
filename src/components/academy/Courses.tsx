import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { courseTabs, whatsappUrl } from "@/data/content";
import { Reveal, SectionHeading, SubjectGlyph } from "./shared";

export function Courses() {
  const [active, setActive] = useState(0);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Measure the active tab so the gold underline can slide onto it.
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
      className="scroll-mt-28 border-y border-gold/10 bg-panel/60 px-5 py-14 sm:px-6 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="What We Teach"
          title="Courses &"
          highlight="Batches"
          intro="Clear teaching, regular practice and guidance suited to where your child is today."
        />

        <Reveal delay={100}>
          <div
            ref={listRef}
            role="tablist"
            aria-label="Course groups"
            onKeyDown={onKeyDown}
            className="relative mt-10 flex gap-1 overflow-x-auto border-b border-gold/15 pb-px"
          >
            {courseTabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active === index}
                aria-controls={`panel-${tab.id}`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "focus-ring shrink-0 rounded-t px-4 py-3 font-utility text-xs font-semibold uppercase tracking-wider transition-colors",
                  active === index ? "text-gold" : "text-body hover:text-heading",
                )}
              >
                {tab.label}
              </button>
            ))}

            {indicator ? (
              <span
                aria-hidden="true"
                className="absolute bottom-0 h-0.5 bg-gold-fill transition-[left,width] duration-300 ease-out"
                style={{ left: indicator.left, width: indicator.width }}
              />
            ) : null}
          </div>
        </Reveal>

        {current ? (
          <div
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            tabIndex={0}
            className="focus-ring mt-8 rounded-lg"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {current.subjects.map((subject, index) => (
                <Reveal key={`${current.id}-${subject.name}`} delay={index * 80}>
                  <div className="gold-border-glow flex h-full flex-col rounded-2xl border border-gold/[0.18] bg-page p-6">
                    <span className="mb-6 grid size-11 place-items-center rounded-xl bg-gold/10 text-gold">
                      <SubjectGlyph icon={subject.icon} />
                    </span>
                    <h3 className="font-utility text-lg font-semibold text-heading">
                      {subject.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-[1.65] text-body">
                      {subject.description}
                    </p>
                    <span className="mt-6 inline-flex w-fit rounded bg-gold/10 px-3 py-1 font-utility text-[10px] font-semibold uppercase tracking-wider text-gold">
                      {subject.timing} Batch
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-8 text-sm leading-[1.65] text-body">
              For batch timings and admission details,{" "}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring rounded font-semibold text-gold underline underline-offset-4 transition-colors hover:text-gold-bright"
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
