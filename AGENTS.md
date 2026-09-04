# Working in this repo

Harshika Academy — a single-page marketing site for a coaching institute in
Bhairunda, Madhya Pradesh. Its one job is to get a parent to tap WhatsApp or call.

## Before you change anything

**All copy and data live in [`src/data/content.ts`](src/data/content.ts).** Phone
numbers, stats, courses, results, gallery photos, testimonials, FAQs and contact
details are typed exports there. Never hardcode copy into a component — the
academy edits that one file, not the JSX.

## Routes

One route renders the whole site:

| Route | Theme                                                                                       | File                   |
| ----- | ------------------------------------------------------------------------------------------- | ---------------------- |
| `/`   | Warm off-white with gold accents; dark mode behind the header switch (light is the default) | `src/routes/index.tsx` |

Sections live in `src/components/academy/`, one file per section. All copy comes
from `src/data/content.ts`.

## Theming

The site supports light (default) and dark. Both read the same tokens, so **use the
semantic utilities, not raw colours**: `bg-page`, `bg-panel`, `text-heading`,
`text-body`, `text-gold`, `border-gold/NN`, `bg-gold-fill`, `text-on-gold`.

Three rules keep light mode readable:

- `text-gold` for accent text (darkens to `#8A6314` on light). Never use
  `bg-gold-fill` as a text colour, and never use `--gold` as a solid fill.
- `bg-gold-fill` for solid buttons, always paired with `text-on-gold`. Both stay
  fixed across modes.
- `gold-foil` is for large display headings only — its gradient clears the 3:1
  large-text bar, not the 4.5:1 body-text bar.

Tailwind's `shadow-*` colour utilities do not re-resolve when the theme var
changes, so themed elevation uses the `elevate-lg` / `elevate-md` utilities in
`src/styles.css` instead.

## Scroll motion

Three layers, in order of how much they matter:

- **Sticky stack** (`CourseStack.tsx`): the course cards are `position: sticky`
  inside a tall container, each pinning at `--stack-top` plus an 18px step so
  the deck shows a sliver of every card beneath. Pure CSS — do not add JS to
  it. A pinned card taller than `viewport − --stack-top` never shows its
  bottom (the next card covers it first), so the phone layout is compact on
  purpose: keep every card under ~620px at 375×812.
- **Scroll-driven reveals** (`styles.css`, inside `@supports
(animation-timeline: view())`): `.reveal` fades and rises as it enters the
  viewport, on the compositor, no listener. Browsers without support keep the
  JS ticker in `use-motion.ts`. The reduced-motion block switches both off —
  keep it that way.
- **Lenis** (`lib/smooth-scroll.ts`): inertial wheel smoothing. Native scroll
  events still fire, so scroll-spy and the progress bar are untouched. **Never
  call `window.scrollTo` or `scrollIntoView` with `behavior: "smooth"` for a
  window scroll** — two easings fight over one position. Use `scrollWindowTo()`
  from the same module; it routes through Lenis when running and honours the
  target's `scroll-margin-top`. Inner scrollers (the results rail) are fine.

`ink-band` scopes the dark palette to one section regardless of theme; the
course stack uses it so the deck sits on ink in light mode too.

## House rules

- **No fees, prices or payment information anywhere on the page.** Batch timings
  and admission details are handled over WhatsApp.
- Semantic `<section id="...">` matching the nav anchors, alt text on every
  image, `aria-label` on every icon-only button.
- Respect `prefers-reduced-motion`: reveals and count-ups must land on their
  final state instantly.
- Never gate content behind a signal that might not arrive. Scroll reveals start
  hidden, so `src/hooks/use-motion.ts` probes whether animation frames are being
  delivered and shows everything if they are not. There is a `<noscript>`
  fallback too. A blank page is worse than an unanimated one.
- Test at 360px. Nothing may scroll horizontally.

## Checks

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Six `react-refresh/only-export-components` warnings from `src/components/ui/*`
are pre-existing shadcn scaffolding — leave them.
