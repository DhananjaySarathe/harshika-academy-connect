import { Fragment } from "react";
import { GraduationCap, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import { faculty, type Teacher } from "@/data/content";
import { GoldArc, Reveal, SectionHeading } from "./shared";

export function Faculty() {
  return (
    <section
      id="faculty"
      className="ink-band scroll-mt-28 overflow-clip px-5 pb-14 pt-8 sm:px-6 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16"
    >
      <div className="mx-auto max-w-[1200px] space-y-24">
        {faculty.map((teacher, index) => (
          <TeacherCard key={teacher.name} teacher={teacher} showHeading={index === 0} />
        ))}
      </div>
    </section>
  );
}

function TeacherCard({ teacher, showHeading }: { teacher: Teacher; showHeading: boolean }) {
  const [firstName, ...rest] = teacher.name.split(" ");

  return (
    <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
      <Reveal className="relative mx-auto w-full max-w-[400px]">
        {/* Signature arc, use 2 of 2. */}
        <GoldArc className="absolute -inset-x-8 -top-6 h-40 w-[calc(100%+4rem)] rotate-180" />
        <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-gold/20 bg-panel">
          <img
            src={teacher.image}
            alt={teacher.alt}
            loading="lazy"
            decoding="async"
            width={1040}
            height={1563}
            className="h-full w-full object-cover"
          />
        </div>
      </Reveal>

      <div>
        {showHeading ? (
          <SectionHeading
            chapter="03"
            eyebrow="Meet Your Teacher"
            title={firstName ?? ""}
            highlight={rest.join(" ")}
          />
        ) : (
          <Reveal>
            <h3 className="font-display text-[clamp(1.75rem,5vw,2.75rem)] uppercase leading-none text-heading">
              {firstName} <span className="gold-foil">{rest.join(" ")}</span>
            </h3>
          </Reveal>
        )}

        <Reveal delay={120}>
          <p className="mt-4 font-utility text-[10px] font-semibold uppercase tracking-[0.18em] text-body">
            {teacher.role}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <ul className="mt-6 flex flex-wrap gap-2">
            {teacher.qualifications.map((qualification) => (
              <li
                key={qualification}
                className="rounded border border-gold/40 px-3 py-1.5 font-utility text-[10px] font-semibold uppercase tracking-wider text-heading"
              >
                {qualification}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={240}>
          <ul className="mt-5 flex flex-wrap gap-2">
            {teacher.badges.map((badge) => (
              <li
                key={badge}
                className="inline-flex items-center gap-2 rounded bg-gold-fill px-4 py-2 font-utility text-xs font-bold uppercase tracking-wider text-on-gold"
              >
                <GraduationCap className="size-4" aria-hidden="true" />
                {badge}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-7 max-w-2xl text-base leading-[1.65] text-body">{teacher.note}</p>
        </Reveal>

        {teacher.formula ? (
          <Reveal delay={360}>
            <div className="gold-border-glow relative mt-8 overflow-hidden rounded-2xl border border-gold/40 bg-gold/[0.07] p-5 elevate-lg sm:p-6">
              {/* A gold wash so the block reads as the highlight of the section
                  rather than one more panel. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(227,178,60,0.18),transparent_62%)]"
              />
              <div className="relative">
                <p className="flex items-center gap-2 font-utility text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  <Target className="size-3.5" aria-hidden="true" />
                  {teacher.formula.label}
                </p>
                {/* Each term is one token carrying both languages, so the Hindi
                    sits under its own English word instead of on a second line
                    the reader has to map back themselves. */}
                <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-3 sm:gap-x-3.5">
                  {teacher.formula.terms.map((term, index) => (
                    <Fragment key={term.en}>
                      {index > 0 ? <Operator sign="+" /> : null}
                      <FormulaTerm term={term} />
                    </Fragment>
                  ))}
                  <Operator sign="=" />
                  <FormulaTerm term={teacher.formula.result} accent />
                </div>
              </div>
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={420}>
          <blockquote className="mt-8 border-l-2 border-gold pl-5 text-lg italic leading-[1.5] text-gold-bright">
            &ldquo;{teacher.quote}&rdquo;
          </blockquote>
        </Reveal>
      </div>
    </div>
  );
}

/** Read out, not hidden: without the plus and equals it is a list, not a formula. */
function Operator({ sign }: { sign: string }) {
  return (
    <span className="font-display text-2xl leading-none text-gold/70 sm:text-3xl">{sign}</span>
  );
}

/** One term of the formula: the English word with its Hindi directly beneath. */
function FormulaTerm({
  term,
  accent = false,
}: {
  term: { en: string; hi: string };
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex flex-col items-center rounded-xl border px-3 py-2 text-center sm:px-4",
        accent ? "border-gold bg-gold-fill text-on-gold" : "border-gold/25 bg-panel text-heading",
      )}
    >
      <span className="font-display text-lg uppercase leading-none tracking-wide sm:text-xl">
        {term.en}
      </span>
      <span
        lang="hi"
        className={cn(
          "mt-1 font-devanagari text-sm font-bold leading-tight sm:text-base",
          accent ? "text-on-gold/80" : "text-gold-bright",
        )}
      >
        {term.hi}
      </span>
    </span>
  );
}
