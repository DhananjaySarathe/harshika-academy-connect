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

import { cn } from "@/lib/utils";
import { academy, whatsappUrl, type PillarIcon, type SubjectIcon } from "@/data/content";
// Reveal is purely structural — no colours — so both themes share one copy.
import { Reveal } from "@/components/academy/shared";

export { Reveal };

/**
 * Readable theme, following the QuickAds palette:
 *   canvas #F7F3EF · surface #FBF7F2 · surface-2 #FEFCF9
 *   ink-1 #0F0F0C · ink-2 #3A362E · ink-3 #6B6459 · ink-4 #A8A296
 *   lime #C6F25C (primary CTA fill only) · lime-strong #9FCC2B (hover/active)
 *
 * Accent restraint is the rule that makes this readable: lime is a fill, never
 * text and never a large surface. Headings, eyebrows and icons are all ink.
 */

/** Primary CTA — the only place a full lime fill is allowed. */
export const ctaClass =
  "focus-ring-ink inline-flex items-center justify-center gap-2 rounded-lg bg-lime px-5 text-sm font-semibold text-ink-1 transition-colors hover:bg-lime-strong";

/** Everything else: an outlined ink button. */
export const ghostClass =
  "focus-ring-ink inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-transparent px-5 text-sm font-semibold text-ink-1 transition-colors hover:bg-surface-2";

export const cardClass = "rounded-xl border border-line bg-surface-2";

export const eyebrowClass = "text-xs font-semibold uppercase tracking-[0.14em] text-ink-3";

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="#home"
      className="focus-ring-ink group flex items-center gap-2.5 rounded-md"
      aria-label={`${academy.name} — back to top`}
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-lg bg-ink-1 text-canvas",
          compact ? "size-8" : "size-9",
        )}
      >
        <BookOpen className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cn("font-bold text-ink-1", compact ? "text-sm" : "text-base")}>
          Harshika
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          Academy
        </span>
      </span>
    </a>
  );
}

/** Lime behind the word, ink on top — the accent as a highlight, not as text. */
export function Marker({ children }: { children: React.ReactNode }) {
  return <span className="marker-lime">{children}</span>;
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
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Reveal>
        <p className={eyebrowClass}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={80}>
        {/* Sentence case in the body face, not condensed all-caps: the single
            biggest readability gain over the dark theme. */}
        <h2 className="mt-3 text-[clamp(1.5rem,3.4vw,2.25rem)] font-bold leading-tight tracking-tight text-ink-1">
          {title}
          {highlight ? (
            <>
              {" "}
              <Marker>{highlight}</Marker>
            </>
          ) : null}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={160}>
          <p
            className={cn(
              "mt-3 max-w-xl text-[15px] leading-[1.65] text-ink-2",
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

export function WhatsAppButton({
  label = "WhatsApp us",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(ctaClass, "h-11", className)}
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      {label}
    </a>
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

/** Icons stay neutral ink — colouring them lime is the classic overuse. */
export function SubjectGlyph({ icon, className }: { icon: SubjectIcon; className?: string }) {
  const Glyph = subjectGlyphs[icon];
  return (
    <Glyph className={cn("size-5 text-ink-3", className)} strokeWidth={1.75} aria-hidden="true" />
  );
}

const pillarGlyphs: Record<PillarIcon, typeof BookOpen> = {
  guidance: GraduationCap,
  clarity: Sparkles,
  results: TrendingUp,
};

export function PillarGlyph({ icon, className }: { icon: PillarIcon; className?: string }) {
  const Glyph = pillarGlyphs[icon];
  return (
    <Glyph className={cn("size-5 text-ink-3", className)} strokeWidth={1.75} aria-hidden="true" />
  );
}
