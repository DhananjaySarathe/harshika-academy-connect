# Working in this repo

Harshika Academy — a single-page marketing site for a coaching institute in
Jabalpur. Its one job is to get a parent to tap WhatsApp or call.

## Before you change anything

**All copy and data live in [`src/data/content.ts`](src/data/content.ts).** Phone
numbers, stats, courses, results, gallery photos, testimonials, FAQs and contact
details are typed exports there. Never hardcode copy into a component — the
academy edits that one file, not the JSX.

## Routes

Two routes render the same content from the same data file:

| Route | Theme                                                                                       | File                   |
| ----- | ------------------------------------------------------------------------------------------- | ---------------------- |
| `/`   | Warm off-white with gold accents; dark mode behind the header switch (light is the default) | `src/routes/index.tsx` |
| `/v2` | Readable: warm cream canvas, ink type scale, lime CTAs                                      | `src/routes/v2.tsx`    |

Sections live in `src/components/academy/` (dark) and
`src/components/academy-v2/` (readable), one file per section. Editing content
updates both routes; editing a component affects only its theme.

`/v2` is `noindex` — two indexable copies of the same content would compete.

## Theming `/`

`/` supports light (default) and dark. Both read the same tokens, so **use the
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

`/v2` has its own independent palette and is unaffected by this switch.

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
