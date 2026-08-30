import { GraduationCap } from "lucide-react";

import { faculty, type Teacher } from "@/data/content";
import { GoldArc, Reveal, SectionHeading } from "./shared";

export function Faculty() {
  return (
    <section
      id="faculty"
      className="scroll-mt-28 overflow-hidden px-5 py-14 sm:px-6 sm:py-24 lg:py-28"
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
          <p className="mt-5 inline-flex items-center gap-2 rounded bg-gold-fill px-4 py-2 font-utility text-xs font-bold uppercase tracking-wider text-on-gold">
            <GraduationCap className="size-4" aria-hidden="true" />
            {teacher.badge}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-7 max-w-2xl text-base leading-[1.65] text-body">{teacher.note}</p>
        </Reveal>

        <Reveal delay={360}>
          <blockquote className="mt-8 border-l-2 border-gold pl-5 text-lg italic leading-[1.5] text-gold-bright">
            &ldquo;{teacher.quote}&rdquo;
          </blockquote>
        </Reveal>
      </div>
    </div>
  );
}
