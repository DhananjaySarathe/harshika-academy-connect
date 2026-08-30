import { Button } from "@/components/ui/button";
import { academy } from "@/data/content";
import { Reveal, WhatsAppButton } from "./shared";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-y border-gold/20 bg-page px-5 py-20 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(227,178,60,0.14),transparent_55%)]"
      />
      {/* The arc motif, faint — an echo rather than a third full use. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 opacity-[0.12] [mask-image:linear-gradient(to_top,black,transparent)]"
      >
        <svg viewBox="0 0 1200 160" preserveAspectRatio="none" className="h-full w-full text-gold">
          <path
            d="M0 158 C 300 20, 900 20, 1200 158"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <h2 className="font-display text-[clamp(1.85rem,6vw,3.25rem)] uppercase leading-[1.02] text-heading">
            Seats Fill Fast. <span className="gold-foil">Talk To Us Today.</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-4 text-base leading-[1.65] text-body">
            Book a free demo class and see how we teach before you decide.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppButton />
            <Button
              asChild
              variant="outline"
              className="focus-ring h-11 rounded-full border-gold/30 bg-transparent px-6 font-utility text-xs font-bold uppercase tracking-wider text-heading transition-colors hover:border-gold hover:bg-gold/10 hover:text-heading"
            >
              <a href={academy.phoneHref}>Call Now</a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
