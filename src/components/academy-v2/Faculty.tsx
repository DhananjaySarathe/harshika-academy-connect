import { GraduationCap } from "lucide-react";

import { faculty, type Teacher } from "@/data/content";
import { Reveal, SectionHeading } from "./shared";

export function Faculty() {
  return (
    <section id="faculty" className="scroll-mt-20 bg-canvas px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[1200px] space-y-20">
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
    <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <Reveal className="mx-auto w-full max-w-[380px]">
        <div className="overflow-hidden rounded-xl border border-line bg-surface-2">
          <img
            src={teacher.image}
            alt={teacher.alt}
            loading="lazy"
            decoding="async"
            width={1040}
            height={1563}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>
      </Reveal>

      <div>
        {showHeading ? (
          <SectionHeading
            eyebrow="Meet your teacher"
            title={firstName ?? ""}
            highlight={rest.join(" ")}
          />
        ) : (
          <Reveal>
            <h3 className="text-2xl font-bold tracking-tight text-ink-1">{teacher.name}</h3>
          </Reveal>
        )}

        <Reveal delay={120}>
          <p className="mt-3 text-sm text-ink-3">{teacher.role}</p>
        </Reveal>

        <Reveal delay={180}>
          <ul className="mt-5 flex flex-wrap gap-2">
            {teacher.qualifications.map((qualification) => (
              <li
                key={qualification}
                className="rounded-md border border-line bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-2"
              >
                {qualification}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={240}>
          {/* One of the two lime fills on this page — it marks the credential
              that matters most to a parent. */}
          <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-lime px-3 py-1.5 text-sm font-semibold text-ink-1">
            <GraduationCap className="size-4" aria-hidden="true" />
            {teacher.badge}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-ink-2">{teacher.note}</p>
        </Reveal>

        <Reveal delay={360}>
          <blockquote className="mt-6 border-l-2 border-lime-strong pl-4 text-base italic leading-[1.6] text-ink-1">
            &ldquo;{teacher.quote}&rdquo;
          </blockquote>
        </Reveal>
      </div>
    </div>
  );
}
