import { academy, stats, type Stat } from "@/data/content";
import { useCountUp, useInView } from "@/hooks/use-motion";

export function TrustStrip() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section className="border-b border-line bg-canvas px-5 py-12 sm:px-6 sm:py-14">
      <div ref={ref} className="mx-auto max-w-[1200px]">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={inView} />
          ))}
        </dl>
        <p className="mt-10 text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">
          {academy.strapline}
        </p>
      </div>
    </section>
  );
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const counted = useCountUp(stat.value, active);
  const shown = stat.display ?? `${counted}${stat.suffix}`;

  return (
    <div className="text-center">
      <dd className="text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold leading-none tracking-tight text-ink-1">
        <span aria-hidden="true">{shown}</span>
        <span className="sr-only">{stat.display ?? `${stat.value}${stat.suffix}`}</span>
      </dd>
      <dt className="mt-2.5 text-[13px] leading-snug text-ink-3">{stat.label}</dt>
    </div>
  );
}
