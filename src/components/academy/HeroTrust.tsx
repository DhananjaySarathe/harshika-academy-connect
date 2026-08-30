import { useEffect, useRef, useState } from "react";
import teacherImage from "@/assets/mohit-sarathe.jpg";
import { academy, stats, whatsappUrl } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Phone, SectionHeading } from "./shared";

export function HeroTrust() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.35 }); if (ref.current) io.observe(ref.current); return () => io.disconnect(); }, []);
  return <>
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-28 sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,oklch(0.76_0.16_82_/_9%),transparent_35%)]" />
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="relative z-10 fade-rise">
          <p className="font-utility text-xs font-semibold uppercase tracking-[0.2em] text-gold">Building Knowledge. Shaping Futures.</p>
          <h1 className="mt-5 flex flex-col font-display text-[clamp(4rem,10vw,7rem)] uppercase leading-[0.84] text-paper"><span className="gold-foil">Harshika</span><span>Academy</span></h1>
          <p className="mt-8 max-w-lg text-base leading-8 text-muted-copy sm:text-lg">Concept-first coaching for Classes 6th to 12th by CTET-qualified faculty.</p>
          <ul className="mt-7 space-y-3 text-sm leading-6 text-paper/90"><li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />Small batches, so every student gets attention</li><li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />Concepts explained until they actually click</li><li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />Regular tests, honest feedback to parents</li></ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button asChild className="h-12 rounded-full bg-gold px-6 font-utility text-xs font-bold uppercase tracking-wider text-ink hover:bg-gold-bright"><a href="#contact">Book a Free Demo Class</a></Button><Button asChild variant="outline" className="h-12 rounded-full border-gold/40 bg-transparent px-6 font-utility text-xs font-bold uppercase tracking-wider text-paper hover:bg-gold/10 hover:text-paper"><a href={academy.phoneHref}><Phone />Call {academy.phone}</a></Button></div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px] fade-rise [animation-delay:150ms]">
          <div className="absolute -inset-12 rounded-full bg-gold/5 blur-3xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/20 bg-ink-soft"><img src={teacherImage} alt="Mohit Sarathe standing beside a classroom blackboard" width={1024} height={1280} className="h-full w-full object-cover grayscale-[15%] transition duration-700 hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" /><span className="absolute bottom-6 left-6 font-utility text-[10px] uppercase tracking-[0.2em] text-gold/70">Mohit Sarathe · Faculty Head</span></div>
          <div className="absolute -bottom-12 -right-16 h-36 w-[130%] rounded-[50%] border-t border-gold/30" />
        </div>
      </div>
    </section>
    <section ref={ref} className="border-y border-gold/10 bg-ink-soft px-6 py-14 sm:py-16"><div className="mx-auto max-w-[1200px]"><div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-8">{stats.map((stat) => <div key={stat.label} className="text-center"><div className="font-display text-4xl text-gold sm:text-5xl">{stat.display ?? (visible ? `${stat.value}${stat.suffix}` : "0")}</div><div className="mt-2 font-utility text-[10px] uppercase tracking-widest text-muted-copy">{stat.label}</div></div>)}</div><p className="mt-12 text-center font-utility text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/70 sm:tracking-[0.4em]">Quality Education · Strong Foundation · Bright Future</p></div></section>
  </>;
}
