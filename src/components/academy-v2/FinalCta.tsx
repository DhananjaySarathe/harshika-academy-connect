import { cn } from "@/lib/utils";
import { academy } from "@/data/content";
import { ghostClass, Marker, Reveal, WhatsAppButton } from "./shared";

export function FinalCta() {
  return (
    <section className="border-y border-line bg-surface px-5 py-16 text-center sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-[clamp(1.5rem,3.6vw,2.25rem)] font-bold leading-tight tracking-tight text-ink-1">
            Seats fill fast. <Marker>Talk to us today.</Marker>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-3 text-[15px] leading-[1.65] text-ink-2">
            Book a free demo class and see how we teach before you decide.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppButton className="h-12" />
            <a href={academy.phoneHref} className={cn(ghostClass, "h-12")}>
              Call now
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
