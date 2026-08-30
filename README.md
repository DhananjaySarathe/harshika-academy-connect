# Harshika Academy.

Single-page marketing site for Harshika Academy, a coaching institute in
Jabalpur run by Mohit Sarathe. One scroll, no internal routing — every nav link
is an anchor to a section on the same page.

The page has one job: convince a parent to tap WhatsApp or call. The audience is
parents and school students on mid-range Android phones over 4G, so it is built
to stay fast and legible on a small screen.

## Running it

Requires Node 20+. The repo uses [Bun](https://bun.sh) (`bun.lock`), but npm
works fine.

```bash
bun install && bun run dev
```

| Command           | What it does                      |
| ----------------- | --------------------------------- |
| `bun run dev`     | Dev server with HMR               |
| `bun run build`   | Production build into `.output/`  |
| `bun run preview` | Currently broken — see note below |
| `bun run lint`    | ESLint + Prettier                 |
| `bun run format`  | Rewrite files with Prettier       |

`bun run preview` does not work in this template: the build targets Cloudflare
Workers and emits to `.output/`, while Vite's preview server looks for
`dist/server/server.js`. Use `bun run dev` locally, or deploy the build with
`npx nitro deploy --prebuilt`.

Typecheck with `npx tsc --noEmit`. The TypeScript config is strict, including
`noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.

## Editing the site

**Everything the academy needs to change lives in
[`src/data/content.ts`](src/data/content.ts)** — phone number, WhatsApp link,
address, timings, stats, courses and batches, faculty, results, gallery photos,
testimonials and FAQs. They are typed exports, so a wrong shape fails the build
rather than silently breaking a section.

Swapping a photo means replacing a URL in that file. Every image sits in a
fixed aspect-ratio box, so a replacement of any dimensions will not shift the
layout.

## The two themes

Both routes render the same sections from the same data.

| Route | Theme                                                                                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`   | Gold on near-black. Anton display caps, metallic gold-foil headings, a recurring gold arc. Ships a **dark/light switch** — dark is the default. |
| `/v2` | The readable variant. Warm cream canvas, an ink type scale, sentence-case headings, lime reserved for primary buttons.                          |

`/v2` is marked `noindex` so the two copies do not compete in search.

Section components are one file each, in `src/components/academy/` and
`src/components/academy-v2/`.

## Design system — `/`

The tokens below flip between the two modes. The switch lives in the header (and
in the mobile menu), the choice is remembered in `localStorage`, and an inline
script in `<head>` stamps it before first paint so there is no flash of the
wrong theme on reload.

| Token           | Dark      | Light          | Use                                |
| --------------- | --------- | -------------- | ---------------------------------- |
| `--page`        | `#0B0E14` | `#FCFAF6`      | Page background                    |
| `--panel`       | `#141926` | `#F4EFE4`      | Alternating sections, cards        |
| `--heading`     | `#FFFFFF` | `#12151C`      | Headlines                          |
| `--body`        | `#B9BFCC` | `#4A5060`      | Body text                          |
| `--gold`        | `#E3B23C` | `#8A6314`      | Accent **text**, borders, tints    |
| `--gold-bright` | `#F7DC8A` | `#7D5810`      | Secondary accent text, hover       |
| `--gold-deep`   | `#A97C1E` | `#5E410B`      | Deep accent                        |
| `--gold-fill`   | `#E3B23C` | `#E3B23C`      | Solid button fill — bright in both |
| `--on-gold`     | `#0B0E14` | `#0B0E14`      | Text on a gold fill — dark in both |
| `--foil-a/b/c`  | gold ramp | dark-gold ramp | `gold-foil` gradient stops only    |

Three splits make the light mode work, and they are easy to undo by accident:

- **`--gold` is the readable accent, `--gold-fill` is the button.** Brand gold on
  white is 1.9:1, so accent _text_ darkens to `#8A6314` (5.2:1) while button
  fills stay bright with near-black `--on-gold` on top (9.8:1).
- **`--on-gold` never flips.** It sits on a gold fill in both modes.
- **`--foil-*` is separate from `--gold-bright`** so the foil gradient can be
  retuned for light without dragging readable text colour with it. The foil is
  only ever used on large display headings, where the 3:1 large-text bar applies.

Display type is Anton in all caps; body is Plus Jakarta Sans at 1.65 line
height; eyebrows are Inter 600, uppercase, `0.18em` tracking.

## Design system — `/v2`

| Token                       | Hex                   | Use                          |
| --------------------------- | --------------------- | ---------------------------- |
| `--canvas`                  | `#F7F3EF`             | Page background              |
| `--surface` / `--surface-2` | `#FBF7F2` / `#FEFCF9` | Sections, cards              |
| `--line` / `--line-strong`  | `#E1DAD0` / `#B8AC9A` | Borders                      |
| `--ink-1` → `--ink-4`       | `#0F0F0C` → `#A8A296` | Headings → placeholders      |
| `--lime`                    | `#C6F25C`             | Primary CTA fill only        |
| `--lime-strong`             | `#9FCC2B`             | Hover, active, small accents |

Accent restraint is what makes this variant readable: lime only ever appears as
a fill. It reaches 1.7:1 on cream, so it is never text and never a focus ring —
an emphasised word gets a highlighter stroke behind it instead, and icons stay
neutral ink.

## Conventions

- **No fees, prices or payment information anywhere on the page.** Batch timings
  and admission details go through WhatsApp.
- Accessibility: semantic sections with ids matching the nav, visible focus
  rings, alt text on every image, ARIA labels on icon-only buttons, and a
  keyboard-operable accordion, tab set and gallery lightbox.
- Motion: fade-and-rise on scroll, 16px over 500ms, staggered. Under
  `prefers-reduced-motion` everything lands on its final state instantly.
- Responsive from 360px to 1920px with no horizontal scroll.
- The enquiry form is client-side only — it validates and confirms inline. There
  is no backend; wire a real endpoint into `onSubmit` in
  `src/components/academy/Contact.tsx` when one exists.

## Stack

TanStack Start (SSR) · React 19 · Tailwind CSS v4 · shadcn/ui · TypeScript ·
Vite · Nitro
