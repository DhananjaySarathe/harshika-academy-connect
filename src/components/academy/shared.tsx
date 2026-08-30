import type { ReactNode } from "react";
import {
  Atom,
  BookOpen,
  BrainCircuit,
  Calculator,
  FlaskConical,
  Globe2,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { academy, whatsappUrl, type PillarIcon, type SubjectIcon } from "@/data/content";
import { useInView } from "@/hooks/use-motion";

/**
 * Fade-and-rise on scroll: 16px, 500ms, ease-out, staggered by `delay`.
 * The transform is dropped entirely under prefers-reduced-motion (see styles.css).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", inView && "reveal-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="#home"
      className="focus-ring group flex items-center gap-3 rounded-md"
      aria-label={`${academy.name} — back to top`}
    >
      <span
        className={cn(
          "grid shrink-0 rotate-45 place-items-center rounded-[3px] border border-gold/70 transition-colors group-hover:border-gold",
          compact ? "size-7" : "size-8",
        )}
      >
        <BookOpen className="size-4 -rotate-45 text-gold-bright" strokeWidth={1.5} />
      </span>
      <span className="flex flex-col leading-[0.82]">
        <span
          className={cn("gold-foil font-display tracking-wide", compact ? "text-lg" : "text-xl")}
        >
          HARSHIKA
        </span>
        <span className="font-utility text-[9px] font-semibold tracking-[0.28em] text-heading">
          ACADEMY
        </span>
      </span>
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <Reveal>
        <p className="font-utility text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-3 font-display text-[clamp(2rem,6vw,3.75rem)] uppercase leading-[0.95] tracking-tight text-heading">
          {title}
          {highlight ? (
            <>
              {" "}
              <span className="gold-foil">{highlight}</span>
            </>
          ) : null}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={160}>
          <p
            className={cn(
              "mt-5 max-w-2xl text-base leading-[1.65] text-body",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/**
 * The signature gold arc from the institute's banner.
 * Deliberately used exactly twice on the page — the hero divider and behind the
 * faculty portrait. Please don't add a third.
 */
export function GoldArc({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none select-none text-gold", className)}
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 118 C 300 8, 900 8, 1200 118"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
        opacity="0.45"
      />
    </svg>
  );
}

export function WhatsAppButton({
  label = "WhatsApp Us",
  className,
  size = "default",
}: {
  label?: string;
  className?: string;
  size?: "default" | "sm";
}) {
  return (
    <Button
      asChild
      className={cn(
        "focus-ring rounded-full bg-gold-fill font-utility font-bold uppercase tracking-wider text-on-gold shadow-lg shadow-gold/10 transition-colors hover:bg-gold-fill-strong",
        size === "sm" ? "h-9 px-4 text-[10px]" : "h-11 px-5 text-xs",
        className,
      )}
    >
      <a href={whatsappUrl} target="_blank" rel="noreferrer noopener">
        <MessageCircle className="size-4" aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}

const subjectGlyphs: Record<SubjectIcon, typeof BookOpen> = {
  maths: Calculator,
  science: FlaskConical,
  english: BookOpen,
  social: Globe2,
  physics: Atom,
  aptitude: Target,
  reasoning: BrainCircuit,
};

export function SubjectGlyph({ icon, className }: { icon: SubjectIcon; className?: string }) {
  const Glyph = subjectGlyphs[icon];
  return <Glyph className={cn("size-6", className)} strokeWidth={1.5} aria-hidden="true" />;
}

const pillarGlyphs: Record<PillarIcon, typeof BookOpen> = {
  guidance: GraduationCap,
  clarity: Sparkles,
  results: TrendingUp,
};

export function PillarGlyph({ icon, className }: { icon: PillarIcon; className?: string }) {
  const Glyph = pillarGlyphs[icon];
  return <Glyph className={cn("size-5", className)} strokeWidth={1.5} aria-hidden="true" />;
}
