# Harshika Academy Connect

For home page inspiration take above image as inpiration (do not create as it is).. No need of backend in this

PROJECT

Build a single-page (one-scroll) marketing website for Harshika Academy, a local coaching institute in India run by a teacher named Mohit Sarathe. No multi-page routing. Every nav link is an anchor that smooth-scrolls to a section on the same page.

Audience: parents and school students in a small Indian city, mostly on mid-range Android phones on 4G. The page's single job is: convince a parent to tap WhatsApp or call.

Tone: trustworthy, established, warm. Not startup-y. No jargon. Short sentences. Copy should read like a respected local teacher wrote it, not like a SaaS landing page.

DESIGN SYSTEM (follow exactly)

Palette — premium gold on near-black, taken from the institute's existing banner:

Token Hex Use --ink #0B0E14 Page background, deepest sections --ink-soft #141926 Alternating section background, cards --gold #E3B23C Primary accent, buttons, icons --gold-bright #F7DC8A Gradient highlight, hover states --gold-deep #A97C1E Gradient shadow end, borders --paper #FFFFFF Headlines --muted #B9BFCC Body text on dark

Gold headings use a linear gradient --gold-deep → --gold-bright → --gold at 100deg with background-clip: text, exactly like a metallic foil print. Use this on section eyebrows and the one word you want to pop — never on body copy.

Typography:

Display: a heavy condensed grotesque (Anton, or Archivo Black) in ALL CAPS with tight tracking for section titles and the hero. This matches the banner's poster-style lettering.

Body: Inter or Plus Jakarta Sans, 400/500, generous line-height (1.65).

Utility/eyebrow: Inter 600, uppercase, letter-spacing 0.18em, 12px, colour --gold.

Layout & texture:

Max content width 1200px, generous vertical rhythm (96px desktop / 56px mobile between sections).

Thin 1px gold hairline dividers between some sections, at 20% opacity — echoing the gold curve on the banner.

Cards: --ink-soft background, 1px border at rgba(227,178,60,0.18), 16px radius, subtle inner glow on hover.

Signature element: a recurring thin gold arc (a large-radius curved line, like the swoosh separating text from the photo on the institute's banner). Use it once in the hero as a section divider and once behind the faculty photo. Do not repeat it more than twice.

Respect prefers-reduced-motion. All animation is a fade-and-rise on scroll (16px, 500ms, ease-out), staggered. Nothing bouncy, nothing parallax-heavy.

Images: use tasteful placeholder photos (Unsplash) of Indian classrooms, students studying, blackboards, and a male teacher. These will be swapped later, so keep every image in a clearly named component with fixed aspect ratios so replacement is trivial.

SECTION 1 — STICKY NAVIGATION (interactive)

A floating pill-shaped navbar, centred, with a frosted-glass effect (backdrop-blur, semi-transparent --ink, 1px gold border at low opacity) — same shape as the reference screenshot, but gold instead of orange.

Left: the Harshika Academy wordmark. "HARSHIKA" in gold gradient, "ACADEMY" in white, stacked tight, plus a small open-book glyph.

Centre links: Home · About · Courses · Faculty · Results · Gallery · Contact

Right: a solid gold pill button — "WhatsApp Us" — opening https://wa.me/919171164151?text=Hi%2C%20I%20want%20to%20know%20about%20admission%20at%20Harshika%20Academy in a new tab.

Behaviour:

Smooth scroll to each anchor with a scroll offset so headings aren't hidden under the bar.

Scroll-spy: the link for the section currently in view gets a gold underline/glow.

On scroll past 80px, the bar shrinks slightly and its background gets more opaque.

Mobile: collapses to a hamburger that opens a full-screen dark overlay menu with large tappable links; the WhatsApp button stays visible outside the hamburger.

SECTION 2 — HERO (mostly static, one interactive CTA)

Full-viewport-height, split layout. Left = text, right = a photo of the teacher on a dark classroom/blackboard background (mirror the composition of the institute's banner). A soft gold radial glow behind the subject; a dark gradient scrim so the text stays readable if the image is busy.

Copy (use verbatim):

Eyebrow: BUILDING KNOWLEDGE. SHAPING FUTURES.

H1: HARSHIKA ACADEMY — "HARSHIKA" in gold gradient, "ACADEMY" in white, stacked, poster-scale (clamp 48px → 96px).

Sub-line: Concept-first coaching for Classes [FILL] by CTET-qualified faculty.

Three bullets with small gold dot markers:

Small batches, so every student gets attention

Concepts explained until they actually click

Regular tests, honest feedback to parents

Primary CTA: gold pill — "Book a Free Demo Class" → scrolls to Contact.

Secondary CTA: ghost button with gold border — "Call +91 91711 64151" → tel:+919171164151.

Below the fold edge, a thin gold arc divider.

SECTION 3 — TRUST STRIP (interactive: count-up on scroll)

A single horizontal band on --ink-soft with four stats, gold numerals, animated counting up once when scrolled into view (respect reduced-motion — show final value instantly if set).

[FILL]+ Students Taught

[FILL] Years of Teaching

CTET Qualified Faculty

[FILL]% Average Score Improvement

Under it, the banner's own strapline as a static centred line in small caps: QUALITY EDUCATION · STRONG FOUNDATION · BRIGHT FUTURE

SECTION 4 — ABOUT THE ACADEMY (static)

Two columns. Left: a photo collage — one tall classroom image plus one smaller image offset over it, both with thin gold borders. Right: text.

Eyebrow: ABOUT US

H2: A CLASSROOM WHERE DOUBTS ARE WELCOME

2–3 short paragraphs: why the academy was started, the belief that a strong foundation matters more than rote marks, the commitment to small batches and regular parent communication. Write real, plain copy — no filler, no "empowering learners to unlock potential."

Below: the three pillars from the banner as three small cards with gold line-icons:

Expert Guidance — Taught by a CTET-qualified teacher with formal training in education, not part-time tutors.

Concept Clarity — Every topic is taught from the basics up, with doubt-clearing built into each class.

Result Oriented — Weekly tests, tracked progress, and a clear picture shared with parents.

SECTION 5 — COURSES / WHAT WE TEACH (interactive: tabbed)

Eyebrow: WHAT WE TEACH

H2: COURSES & BATCHES

A tab switcher (gold underline slides between tabs) with tabs: [FILL — e.g. Class 6–8 · Class 9–10 · Class 11–12 · Competitive Exams].

Each tab reveals a grid of subject cards. Each card: subject icon, subject name, one line on what's covered, and a small gold tag for batch timing (Morning / Evening).

Do not include any fees, prices, or payment information anywhere on this page. Instead, each tab ends with a single line: For batch timings and admission details, message us on WhatsApp. plus a small inline WhatsApp link.

SECTION 6 — MEET THE FACULTY (static, high trust weight)

Eyebrow: MEET YOUR TEACHER

H2: MOHIT SARATHE

Layout: large portrait on the left inside a rounded frame with the gold arc behind it. Right side:

Qualification row rendered as individual gold-outlined chips: B.A. M.A. PGDCA D.El.Ed.

A prominent badge, gold fill with a graduation-cap icon: CTET QUALIFIED

A short first-person paragraph in his voice about his teaching approach — [FILL or let Lovable draft a placeholder clearly marked as such].

A quiet pull-quote in gold italic: "A student who understands the 'why' never forgets the 'what'."

Design this section so a second and third teacher card could be dropped in later without breaking the layout.

SECTION 7 — HOW ADMISSION WORKS (static, numbered — order matters here)

Eyebrow: GETTING STARTED

H2: THREE STEPS TO JOIN

A horizontal 3-step flow on desktop, vertical stack on mobile, connected by a thin gold line:

Message or call us — Tell us your class and subjects.

Attend a free demo class — Sit in a real batch, no commitment.

Confirm your seat — We share the timetable and you begin.

(Numbers are justified here because this genuinely is a sequence — don't add decorative numbering anywhere else on the page.)

SECTION 8 — RESULTS & TOPPERS (interactive: horizontal scroll/carousel)

Eyebrow: OUR RESULTS

H2: STUDENTS WHO MADE IT COUNT

A horizontally scrollable row of result cards (drag on desktop, swipe on mobile, with gold arrow controls). Each card: student photo, name, class/exam, score or achievement, school name. Use 6 dummy cards.

Keep the data structure simple and obvious in the code — this is a list the owner will edit often.

SECTION 9 — GALLERY (interactive: filters + lightbox — this is the showpiece)

Eyebrow: INSIDE THE ACADEMY

H2: GALLERY

Requirements:

A filter row of gold pill buttons: All · Classroom · Events · Achievements · Facilities. Clicking filters the grid with a smooth layout transition.

A masonry-style grid (varied heights, not a rigid uniform square grid), 3 columns desktop / 2 tablet / 1–2 mobile, 12 dummy images.

Hover: image lifts slightly, gold overlay fades in with a caption and an expand icon.

Click: opens a lightbox modal — dark backdrop with blur, large image, caption, left/right arrows, keyboard arrow-key and Escape support, swipe on mobile, and an image counter (4 / 12).

Lazy-load images below the fold.

Structure the gallery data as a single array of { src, caption, category } objects at the top of the component so images can be swapped in one place.

SECTION 10 — WHAT PARENTS SAY (interactive: slider)

Eyebrow: TESTIMONIALS

H2: WORDS FROM PARENTS & STUDENTS

An auto-playing slider (pauses on hover, dot indicators, gold arrows) showing one large testimonial on desktop and one on mobile. Each: quote in larger body type, a small circular avatar, name, and relation (Parent of Class 9 student). Use 5 realistic-sounding dummy testimonials in plain Indian-English — specific and modest, not gushing.

SECTION 11 — FAQ (interactive: accordion)

Eyebrow: QUESTIONS

H2: BEFORE YOU JOIN

An accordion, one item open at a time, gold plus/minus indicator that rotates. 6 questions covering: batch size, demo class, timings, doubt-clearing sessions, test frequency, and how parents get progress updates. No fee-related question.

SECTION 12 — CONTACT & VISIT US (interactive: form + map)

Eyebrow: GET IN TOUCH

H2: COME SEE THE CLASSROOM

Two-column layout.

Left — contact details, each row with a gold line-icon:

Phone / WhatsApp: +91 91711 64151 — tappable tel: link, plus a separate WhatsApp chip linking to https://wa.me/919171164151

Email: [FILL]

Address (for visits and courier): [FILL — full postal address with PIN code]

Class timings: [FILL]

Small row of social icons: [FILL — Instagram / Facebook / YouTube]

An embedded Google Map (dark-styled to match the palette) with a marker on the academy. Below it, a "Get Directions" ghost button.

Right — enquiry form on an --ink-soft card:

Fields: Student Name, Parent's Name, Phone Number, Class (dropdown), Subject(s) of interest, Message (optional).

Client-side validation with clear, non-apologetic error text under each field (Enter a 10-digit phone number).

Submit button: gold pill, label "Send Enquiry" → on success shows an inline confirmation reading "Enquiry sent. We'll call you within a day." (keep the verb consistent: the button says Send, the toast says Sent.)

Under the form, a secondary line: In a hurry? Message us directly on WhatsApp.

SECTION 13 — FINAL CTA BAND (static)

A full-width band with a subtle gold gradient wash over --ink, the arc motif faintly visible.

H2: SEATS FILL FAST. TALK TO US TODAY.

One line: Book a free demo class and see how we teach before you decide.

Two buttons: gold "WhatsApp Us" and ghost "Call Now".

SECTION 14 — FOOTER (static)

Three columns on --ink, separated from the page by a gold hairline:

Column 1: logo lockup + the tagline Building Knowledge. Shaping Futures. + a one-line description.

Column 2: the same anchor links as the nav.

Column 3: address, phone, email, social icons.

Bottom bar: © 2026 Harshika Academy. All rights reserved. and, on the right, Quality Education · Strong Foundation · Bright Future.

GLOBAL / ALWAYS-ON

Floating WhatsApp button, bottom-right, above all content, on every scroll position. Green WhatsApp brand circle with a soft shadow and a gentle pulse ring; on desktop it expands on hover to show Chat with us. Links to the pre-filled wa.me URL. On mobile, ensure it never covers the form's submit button — nudge it up when the contact section is in view.

Scroll-progress indicator: a 2px gold line at the very top of the viewport showing read progress.

Back-to-top arrow that appears after 600px of scroll.

TECHNICAL REQUIREMENTS

React + Tailwind + shadcn/ui, single page, section components in separate files (Hero.tsx, Gallery.tsx, etc.) so each is easy to edit later.

All editable content (stats, courses, results, testimonials, FAQs, gallery items, contact details) lives in a single src/data/content.ts file as typed arrays/objects — not hardcoded inside JSX. This matters: the owner will edit this file, not the components.

Fully responsive: 360px → 1920px. Test the 360px case; nothing should overflow horizontally.

Accessibility: semantic <section> elements with ids matching nav anchors, visible gold keyboard focus rings, alt text on every image, ARIA labels on icon-only buttons, accordion and lightbox keyboard-operable.

Performance: lazy-load below-fold images, use next-gen formats, keep total animation work light.

SEO: page title Harshika Academy — Coaching Classes in [FILL city] | Mohit Sarathe, meta description, Open Graph tags, and LocalBusiness + EducationalOrganization JSON-LD schema with the phone number and address.

DO NOT

Do not create additional pages or routes.

Do not add any pricing, fees, packages, or payment sections.

Do not use purple/blue tech gradients, glassmorphism beyond the nav pill, or emoji as icons.

Do not use lorem ipsum — write real placeholder copy in the tone described above.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d623a0f9-3b9e-46f9-8d13-e824398911ca).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
