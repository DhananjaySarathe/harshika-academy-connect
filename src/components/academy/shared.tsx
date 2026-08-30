import { ArrowUpRight, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, FlaskConical, Globe2, GraduationCap, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/data/content";

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return <a href="#home" className="group flex items-center gap-3" aria-label="Harshika Academy home">
    <span className={cn("grid shrink-0 place-items-center border border-gold/70 rotate-45", compact ? "size-7" : "size-8")}>
      <BookOpen className="size-4 -rotate-45 text-gold-bright" strokeWidth={1.5} />
    </span>
    <span className="flex flex-col leading-[0.82]">
      <span className={cn("font-display tracking-wide gold-foil", compact ? "text-lg" : "text-xl")}>HARSHIKA</span>
      <span className="font-utility text-[9px] font-semibold tracking-[0.28em] text-paper">ACADEMY</span>
    </span>
  </a>;
}

export function SectionHeading({ eyebrow, title, highlight, intro, align = "left" }: { eyebrow: string; title: string; highlight?: string; intro?: string; align?: "left" | "center" }) {
  return <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
    <p className="font-utility text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
    <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-paper sm:text-5xl lg:text-6xl">{title}{highlight && <> <span className="gold-foil">{highlight}</span></>}</h2>
    {intro && <p className="mt-5 max-w-2xl text-base leading-8 text-muted-copy">{intro}</p>}
  </div>;
}

export function WhatsAppButton({ label = "WhatsApp Us", className }: { label?: string; className?: string }) {
  return <Button asChild className={cn("h-11 rounded-full bg-gold px-5 font-utility text-xs font-bold uppercase tracking-wider text-ink shadow-lg shadow-gold/10 hover:bg-gold-bright", className)}>
    <a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle className="size-4" />{label}</a>
  </Button>;
}

export const iconFor = (icon: string) => {
  const props = { className: "size-6", strokeWidth: 1.5 };
  if (icon === "flask") return <FlaskConical {...props} />;
  if (icon === "globe") return <Globe2 {...props} />;
  if (icon === "target") return <ArrowUpRight {...props} />;
  if (icon === "brain") return <Globe2 {...props} />;
  return <BookOpen {...props} />;
};

export { ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, GraduationCap, Menu, MessageCircle, Phone, X };
