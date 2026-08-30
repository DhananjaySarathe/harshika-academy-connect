import { academy, stats, type Stat } from "@/data/content";
import { useCountUp, useInView } from "@/hooks/use-motion";

export function TrustStrip() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section className="border-y border-gold/10 bg-panel px-5 py-14 sm:px-6 sm:py-16">
      <div ref={ref} className="mx-auto max-w-[1200px]">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={inView} />
          ))}
        </dl>
        <p className="mt-12 text-center font-utility text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/70 sm:tracking-[0.35em]">
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
      {/* The live number would be announced on every frame, so screen readers
          get the final value and the animation is hidden from them. */}
      <dd className="font-display text-[clamp(2rem,7vw,3rem)] leading-none text-gold">
        <span aria-hidden="true">{shown}</span>
        <span className="sr-only">{stat.display ?? `${stat.value}${stat.suffix}`}</span>
      </dd>
      <dt className="mt-3 font-utility text-[10px] uppercase tracking-[0.14em] text-body">
        {stat.label}
      </dt>
    </div>
  );
}
