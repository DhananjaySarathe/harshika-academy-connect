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
      className="scroll-mt-20 border-y border-line bg-surface px-5 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Inside the academy"
          title="Gallery"
          intro="A glimpse of the calm, focused place where classes actually happen."
        />

        <Reveal delay={100}>
          <div
            role="group"
            aria-label="Filter gallery by category"
            className="no-scrollbar mt-7 flex gap-2 overflow-x-auto pb-1"
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
                  "focus-ring-ink shrink-0 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors",
                  category === item
                    ? "border-ink-1 bg-ink-1 text-canvas"
                    : "border-line bg-surface-2 text-ink-2 hover:border-line-strong",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-7 columns-2 gap-4 lg:columns-3">
          {filtered.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setLightbox(index);
              }}
              className="focus-ring-ink group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-line bg-surface-2 text-left transition-transform duration-300 hover:-translate-y-1"
            >
              <span className={cn("relative block w-full overflow-hidden", ratioClass[item.ratio])}>
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink-1/85 via-ink-1/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-[13px] font-medium leading-snug text-canvas">
                    {item.caption}
                  </span>
                  <Expand className="size-4 shrink-0 text-canvas" aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-ink-3">No photos in this category yet.</p>
        ) : null}
      </div>

      {current && lightbox !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-1/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery image ${lightbox + 1} of ${filtered.length}: ${current.caption}`}
            className="relative flex w-full max-w-4xl flex-col items-center rounded-xl bg-canvas p-4 sm:p-5"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={current.src}
              alt={current.caption}
              className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain"
            />

            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-ink-1">{current.caption}</p>
              <p className="mt-1 text-xs text-ink-3">
                {lightbox + 1} / {filtered.length}
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="focus-ring-ink absolute -top-3 -right-3 grid size-10 place-items-center rounded-full border border-line bg-canvas text-ink-1 shadow-md transition-colors hover:bg-surface"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="focus-ring-ink absolute left-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-canvas/95 text-ink-1 shadow-md transition-colors hover:bg-surface sm:-left-5"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="focus-ring-ink absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-canvas/95 text-ink-1 shadow-md transition-colors hover:bg-surface sm:-right-5"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
