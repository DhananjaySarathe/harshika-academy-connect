import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
  type GalleryRatio,
} from "@/data/content";
import { Reveal, SectionHeading } from "./shared";

/** Fixed boxes per ratio so the masonry keeps its varied heights without CLS. */
const ratioClass: Record<GalleryRatio, string> = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
};

export function Gallery() {
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const filtered = useMemo(
    () => (category === "All" ? galleryItems : galleryItems.filter((i) => i.category === category)),
    [category],
  );

  const close = useCallback(() => {
    setLightbox(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) =>
      setLightbox((current) =>
        current === null || filtered.length === 0
          ? null
          : (current + delta + filtered.length) % filtered.length,
      ),
    [filtered.length],
  );

  // Keyboard: Escape closes, arrows page, Tab is trapped inside the dialog.
  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    // Move focus into the dialog so the arrows are reachable straight away.
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close, step]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined) return;
    const distance = end - start;
    if (Math.abs(distance) < 48) return;
    step(distance < 0 ? 1 : -1);
  };

  const current = lightbox === null ? undefined : filtered[lightbox];

  return (
    <section
      id="gallery"
      className="scroll-mt-28 border-y border-gold/10 bg-panel/50 px-5 py-14 sm:px-6 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Inside the Academy"
          title="Gallery"
          intro="A glimpse of the calm, focused place where classes actually happen."
        />

        <Reveal delay={100}>
          <div
            role="group"
            aria-label="Filter gallery by category"
            className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2"
          >
            {galleryCategories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item);
                  setLightbox(null);
                }}
                className={cn(
                  "focus-ring shrink-0 rounded-full border px-4 py-2 font-utility text-[10px] font-semibold uppercase tracking-wider transition-colors",
                  category === item
                    ? "border-gold bg-gold-fill text-on-gold"
                    : "border-gold/25 text-gold hover:bg-gold/10",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 columns-2 gap-4 lg:columns-3">
          {filtered.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setLightbox(index);
              }}
              className="focus-ring group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-gold/[0.18] text-left transition-transform duration-300 hover:-translate-y-1"
            >
              <span className={cn("relative block w-full overflow-hidden", ratioClass[item.ratio])}>
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-page/90 via-page/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="font-utility text-xs leading-snug text-heading">
                    {item.caption}
                  </span>
                  <Expand className="size-4 shrink-0 text-gold" aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-body">No photos in this category yet.</p>
        ) : null}
      </div>

      {current && lightbox !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-page/95 p-4 backdrop-blur-md sm:p-8"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery image ${lightbox + 1} of ${filtered.length}: ${current.caption}`}
            className="relative flex w-full max-w-5xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={current.src}
              alt={current.caption}
              className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
            />

            <div className="mt-5 text-center">
              <p className="font-utility text-sm text-heading">{current.caption}</p>
              <p className="mt-1 font-utility text-[10px] uppercase tracking-widest text-gold">
                {lightbox + 1} / {filtered.length}
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="focus-ring absolute -top-2 right-0 grid size-10 place-items-center rounded-full bg-page/80 text-heading transition-colors hover:bg-gold-fill hover:text-on-gold sm:-top-4"
            >
              <X aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="focus-ring absolute left-0 top-[35%] grid size-10 place-items-center rounded-full bg-page/70 text-heading transition-colors hover:bg-gold-fill hover:text-on-gold sm:-left-4"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="focus-ring absolute right-0 top-[35%] grid size-10 place-items-center rounded-full bg-page/70 text-heading transition-colors hover:bg-gold-fill hover:text-on-gold sm:-right-4"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
