import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems, whatsappUrl } from "@/data/content";
import { LogoLockup } from "./shared";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const current = navItems.map((item) => item.href.slice(1)).find((id) => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top <= 150 && el.getBoundingClientRect().bottom > 150;
      });
      if (current) setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const go = (href: string) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); };
  return <>
    <div className="fixed left-0 top-0 z-[70] h-0.5 bg-gold transition-[width] duration-150" style={{ width: `${Math.min(100, (window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)) * 100)}%` }} />
    <nav className={`fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] -translate-x-1/2 transition-all duration-300 sm:top-6 sm:w-[95%] ${scrolled ? "max-w-6xl bg-ink/95" : "max-w-5xl bg-ink/80"}`}>
      <div className="flex items-center justify-between gap-3 rounded-full border border-gold/20 px-4 py-2.5 shadow-2xl backdrop-blur-md sm:px-6">
        <LogoLockup compact />
        <div className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => <button key={item.href} onClick={() => go(item.href)} className={`relative px-1 py-2 font-utility text-[10px] font-semibold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${active === item.href.slice(1) ? "text-gold after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-gold" : "text-paper/70 hover:text-gold"}`}>{item.label}</button>)}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="h-9 rounded-full bg-gold px-3 text-[10px] font-bold uppercase tracking-wider text-ink hover:bg-gold-bright sm:px-5"><a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp Us</a></Button>
          <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} className="text-paper hover:bg-accent hover:text-gold lg:hidden" onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
    </nav>
    {open && <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-ink px-8 lg:hidden">
      <div className="absolute right-6 top-24 text-center"><p className="font-utility text-[10px] uppercase tracking-[0.3em] text-gold/60">Building Knowledge</p><p className="mt-1 font-utility text-[10px] uppercase tracking-[0.3em] text-muted-copy">Shaping Futures</p></div>
      {navItems.map((item) => <button key={item.href} onClick={() => go(item.href)} className="font-display text-4xl uppercase text-paper transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">{item.label}</button>)}
    </div>}
  </>;
}
