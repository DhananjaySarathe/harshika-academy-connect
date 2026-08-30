# Harshika Academy — CRM and Student Portal

**Date:** 2026-08-30
**Status:** Design, approved for spec review

## Problem

Harshika Academy is run by two people. Student records, fee collection and
attendance live in a paper register and in Mohit's head. There is no way for a
parent to see whether their child attended, what they scored, or what is owed
without asking in person.

We want two things sharing one database: an admin CRM the academy runs daily,
and a portal where a student or parent sees their own record.

## Non-goals

Explicitly out of scope. These were considered and cut:

- Enquiry / lead pipeline and demo-class scheduling
- Receipt generation
- Daily homework and study material — content is vacation-only (see below)
- Expense log, staff records, salary, P&L
- Payment gateway integration — fees arrive as cash and UPI; the CRM records
  them, it does not collect them
- SMS or email OTP — costs money, and the audience largely has neither
- Real authentication in v1 (see Security below)

## Build order

Admin screens come before portal screens. The portal only renders things the
admin produces — attendance, marks, notices — so building it first means
guessing at shapes that the admin work would have settled.

Real daily use comes later still, after Supabase and real authentication land
(see Security). The sequence is: admin screens on dummy data → portal screens on
dummy data → Supabase and auth → real records.

### Delivery phases

Each phase is independently reviewable and leaves the app working.

| Phase | Contents |
| --- | --- |
| 1 | Types, `src/data/crm/*` dummy data, `store.ts`, `.theme-admin` tokens |
| 2 | Admin shell and nav, students list and profile, batches |
| 3 | Fees — plan, payment log, pending list, WhatsApp reminder |
| 4 | Attendance marking; tests and marks entry |
| 5 | Notices and vacation material |
| 6 | Portal shell, placeholder login, home, attendance, marks, notices, material |
| 7 | i18n — `en` / `hi` / `hi-Latn` across the portal |

## Architecture

Both surfaces live in the existing TanStack Start app as new route groups. One
codebase, one deploy, one design system, and the full shadcn/Radix set already
installed.

```
src/routes/
  index.tsx          existing marketing site  — untouched
  v2.tsx             existing readable theme  — untouched
  admin/*            new — CRM
  portal/*           new — student and parent
```

### The data seam

Every screen reads and writes through `src/lib/store.ts`. No screen imports a
data file directly.

```
screens  →  src/lib/store.ts  →  src/data/crm/*.ts   (v1: typed objects)
                              →  Supabase client      (v2: same interface)
```

v1 ships with dummy data as typed exported objects, matching the existing
`src/data/content.ts` pattern. When Supabase goes in, `store.ts` is the only
file that changes; no screen is edited. This is the whole reason the seam
exists, so nothing may bypass it.

Dummy data volume: ~15 students, 3 batches, 4 weeks of attendance, 3 tests, a
handful of payments and notices. Enough that every screen looks real, small
enough to delete in one commit.

## Data model

Seven entities.

```ts
type Student = {
  id: string
  name: string
  className: string          // "Class 8"
  school: string
  batchId: string
  parentName: string
  parentPhone: string        // E.164, drives the WhatsApp reminder
  photo: string
  admissionDate: string      // ISO date
  status: "active" | "break" | "left"
  loginId: string            // issued by the academy
  pin: string                // issued by the academy, resettable
  accessSuspended: boolean   // manual override, see Fee gating
  consentGiven: boolean      // DPDP, see Compliance
}

type Batch = {
  id: string
  name: string
  classRange: string         // "Class 6-8"
  subjects: string[]
  days: Weekday[]
  startTime: string          // "16:00"
  endTime: string
}

type FeePlan = {
  studentId: string
  amount: number             // rupees per cycle
  cycle: "monthly" | "quarterly"
  startDate: string
  concession: number         // rupees off per cycle, 0 for none
}

type Payment = {
  id: string
  studentId: string
  date: string
  amount: number
  mode: "cash" | "upi"
  note: string
}

type AttendanceRecord = {
  batchId: string
  date: string
  present: string[]          // student ids
  absent: string[]
}

type Test = {
  id: string
  name: string
  subject: string
  batchId: string
  date: string
  maxMarks: number
}

type Mark = { testId: string; studentId: string; score: number }

type Notice = {
  id: string
  title: string
  body: string
  audience: "all" | { batchId: string }
  postedAt: string
}

type Material = {
  id: string
  title: string
  file: string
  className: string
  activeFrom: string         // vacation window
  activeTo: string
}
```

`Material` carries a date window rather than a published flag. The portal's
material section does not exist outside that window — this is what "content for
vacations only" means concretely, and it means nobody has to remember to turn it
off.

## Screens

### Admin — `/admin/*`

| Route | Purpose |
| --- | --- |
| `/admin` | Today: attendance not yet marked, fees pending, headline counts |
| `/admin/students` | List, search, filter by batch and status |
| `/admin/students/$id` | Profile — fees, attendance, marks, PIN reset |
| `/admin/batches` | Batches and their rosters |
| `/admin/fees` | Pending list, log a payment, WhatsApp reminder |
| `/admin/attendance` | Mark a batch |
| `/admin/tests` | Create a test, enter marks |
| `/admin/notices` | Post an announcement |
| `/admin/material` | Upload vacation material, set the window |

### Portal — `/portal/*`

| Route | Purpose |
| --- | --- |
| `/portal/login` | Student ID + PIN |
| `/portal` | Fee status, month attendance, latest notice |
| `/portal/attendance` | Day by day for the month |
| `/portal/marks` | Scores and a simple progress line |
| `/portal/notices` | All notices for this student |
| `/portal/material` | Only rendered inside an active vacation window |

### The attendance screen decides whether this gets used

Marking a batch must take under 30 seconds on a phone. Pick batch (defaulting to
the one scheduled now), everyone starts Present, tap a name to flip it to
Absent, save. No date picker unless you want a past date, no per-student
submenus, no confirmation dialog. If this screen is slow, the register wins and
the whole project dies.

## Fee gating — soft

A student's own record is never hidden from them.

```
feeStatus(student) → "paid" | "due" | "overdue"
```

Defined against the current cycle, where a cycle's due date is its start date
plus the cycle length:

- `paid` — payments covering this cycle total at least `amount - concession`
- `due` — shortfall exists, and today is no more than 7 days past the due date
  (this includes every day before the due date)
- `overdue` — shortfall exists, and today is more than 7 days past the due date

The 7-day grace between `due` and `overdue` exists so a parent paying a few days
late never trips the material lock. Part payments count toward the total rather
than being ignored, so a student who has paid most of a cycle is `due`, not
`overdue`.

- Fee status, attendance, marks and notices are **always** visible
- Vacation material is locked when status is `overdue` **or**
  `accessSuspended` is set
- A pending balance shows as a banner, not a lockout
- `accessSuspended` is a manual per-student switch in the admin, for genuinely
  long-overdue cases

Rationale: a hard lockout punishes the child for a parent being a few days late,
in a town where the academy knows every family. The relationship cost outweighs
the leverage.

## Theming

The app already scopes themes by class. This adds a third set, following the
existing pattern.

| Surface | Theme | Character |
| --- | --- | --- |
| `/` | gold and ink, light default with dark toggle | existing, untouched |
| `/v2` | `.theme-paper` cream | existing, untouched |
| `/admin` | `.theme-admin` — neutral grey and white | dense rows, tight spacing, built for speed |
| `/portal` | gold and ink, light | warm, spacious, large tap targets |

Admin is deliberately plain. Gold-on-dark fights against data tables and fast
entry; the portal is where the brand belongs.

## Language

Portal only. Admin is English-only.

Three locales, English default:

- `en` — English
- `hi` — Hindi, Devanagari
- `hi-Latn` — Hinglish, Roman script

Hinglish is included because many parents read Roman script faster than
Devanagari.

Implementation is a nested dictionary in `src/lib/i18n.ts` plus a `useT()` hook,
with the choice persisted to `localStorage`. No i18n library — this is roughly
80 strings across six screens, and `react-i18next` would add more bundle weight
than it saves work. The server renders `en`; a non-default choice applies on
hydration. Because English is the default, most visitors see no switch at all.

## Security

**v1 authentication is a placeholder and must be treated as such.**

With dummy data there is no server to authenticate against. Login is a
client-side check against the mock store, which means anyone can read anyone's
record by editing local state. This is acceptable only because the data is
fabricated.

Consequences, which are not negotiable:

- v1 does not deploy to a public URL with real student data behind it
- Real auth and Postgres row-level security land in the same change as Supabase,
  before any real record is entered
- RLS is the enforcement point — a student row is readable only by that student.
  Access control does not live in React

## Compliance

The database holds minors' personal data alongside financial records. Under the
DPDP Act 2023 that needs verifiable parental consent. `Student.consentGiven`
carries it, captured once on the admission form. It is a field, not a feature,
and it is cheaper to add now than to backfill.

## Testing

The repo currently has no test runner; the gate is `tsc --noEmit` and `eslint`.

Add Vitest for pure logic only, where the rules are easy to get subtly wrong and
a mistake is invisible in the UI:

- `feeStatus()` — cycle boundaries, concessions, part payments
- attendance percentage — empty months, a student who joined mid-month
- the vacation window predicate — inclusive bounds, timezone

Screens are not unit tested at this stage. The data is fake, the layouts will
move, and the tests would be rewritten before they caught anything.

## Migration to Supabase

One database serves both surfaces.

1. Translate the seven types into tables; the shapes above are already
   relational
2. Implement `store.ts` against the Supabase client, same interface
3. RLS: admin role reads and writes everything; student role reads only rows
   matching their own id
4. Replace the placeholder login with real Supabase auth on `loginId` + `pin`
5. Delete `src/data/crm/*`

If step 2 requires touching a screen, the seam leaked and that is a bug in v1.

## Risks

| Risk | Mitigation |
| --- | --- |
| Fake auth reaches production with real data | Supabase and RLS ship before the first real record |
| Attendance screen too slow, register wins | Under 30 seconds on a phone is an acceptance criterion, not a goal |
| Data entry never happens, CRM stays empty | Start with fees only; it saves time from day one without needing the rest |
| Supabase free tier pauses after ~7 days idle | Daily use makes this moot; noticeable only during slow build weeks |
