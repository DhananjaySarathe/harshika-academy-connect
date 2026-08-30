# CRM Foundation and Admin Shell — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the typed data foundation for the Harshika Academy CRM and a browsable admin surface listing students and batches, running entirely on dummy data.

**Architecture:** New `/admin/*` routes inside the existing TanStack Start app. All screens read through an async `store.ts` seam backed by typed dummy objects, so the later Supabase swap touches one file. Domain logic lives in pure, unit-tested modules separate from both the data and the UI.

**Tech Stack:** TanStack Start + TanStack Router (file-based) · React 19 · Tailwind CSS v4 · shadcn/ui + Radix · TanStack Query · date-fns · Vitest · bun

**Covers spec phases 1–2.** Phases 3–7 (fees, attendance, tests, notices, material, portal, i18n) get their own plans once this lands. Spec: `docs/superpowers/specs/2026-08-30-crm-student-portal-design.md`.

## Global Constraints

- Package manager is **bun** (`bun.lock`). Never run `npm install` — it creates a stray `package-lock.json`.
- TypeScript is strict with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`. Array indexing yields `T | undefined` and must be narrowed.
- Prettier: `printWidth` 100, `trailingComma: "all"`. Run `bun run format` before every commit.
- Gate before each commit: `bunx tsc --noEmit` (0 errors) and `bun run lint` (0 errors). Six pre-existing `react-refresh/only-export-components` warnings in `src/components/ui/*` are expected and are not regressions.
- **No screen may import from `src/data/crm/*`.** Screens go through `src/lib/crm/store.ts`. This is the whole point of the seam.
- **Every store function is `async`** even when the dummy implementation could return synchronously.
- Never modify `src/routes/index.tsx`, `src/routes/v2.tsx`, or `src/components/academy*/**`. The marketing site is done.
- `src/routeTree.gen.ts` is generated. Never hand-edit it; it regenerates on `bun run dev` or `bun run build`.
- Both new surfaces render the existing `/` **light** palette, locked light. No new colour values anywhere.
- Dates are ISO `YYYY-MM-DD` strings in data, `Date` objects in logic. Compare at day granularity via `startOfDay`, never as raw instants.

## File Structure

| File | Responsibility |
| --- | --- |
| `vitest.config.ts` | Test runner config with the `@` alias |
| `src/lib/crm/types.ts` | The seven entity types and their unions. No logic. |
| `src/lib/crm/fees.ts` | Billing cycles, balance, `feeStatus`. Pure. |
| `src/lib/crm/attendance.ts` | `attendancePercent`. Pure. |
| `src/lib/crm/material.ts` | `isMaterialActive`. Pure. |
| `src/lib/crm/*.test.ts` | Unit tests for the three pure modules |
| `src/data/crm/*.ts` | Dummy rows, one file per entity. Deleted at Supabase time. |
| `src/lib/crm/store.ts` | The async seam. The only bridge between screens and data. |
| `src/styles.css` | Extend the light-palette selector with `.theme-app` |
| `src/components/admin/AdminShell.tsx` | Nav chrome shared by every admin screen |
| `src/routes/admin/route.tsx` | Layout route — wraps children in `.theme-app` + shell |
| `src/routes/admin/index.tsx` | Dashboard |
| `src/routes/admin/students/index.tsx` | Student list with search and filters |
| `src/routes/admin/students/$id.tsx` | Student profile |
| `src/routes/admin/batches.tsx` | Batches and rosters |

---

### Task 1: Test runner and entity types

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/crm/types.ts`
- Modify: `package.json` (add `test` script and the `vitest` devDependency)

**Interfaces:**
- Consumes: nothing
- Produces: `Weekday`, `StudentStatus`, `FeeCycle`, `PaymentMode`, `FeeStatus`, `NoticeAudience`, `Student`, `Batch`, `FeePlan`, `Payment`, `AttendanceRecord`, `Test`, `Mark`, `Notice`, `Material` — all from `@/lib/crm/types`

- [ ] **Step 1: Install Vitest**

```bash
bun add -d vitest
```

- [ ] **Step 2: Add the test script**

In `package.json`, inside `"scripts"`, after the `"lint"` line:

```json
    "test": "vitest run",
```

- [ ] **Step 3: Create `vitest.config.ts`**

The app's `vite.config.ts` uses the `@lovable.dev/vite-tanstack-config` preset, which bundles plugins that must not run under the test runner. Vitest gets its own config, and resolves `@` by hand so no extra dependency is needed.

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Create `src/lib/crm/types.ts`**

```ts
// Entity types for the CRM and student portal. Shapes are deliberately
// relational — each becomes a Postgres table when Supabase lands, so nothing
// here nests objects that would need a join table later.

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type StudentStatus = "active" | "break" | "left";
export type FeeCycle = "monthly" | "quarterly";
export type PaymentMode = "cash" | "upi";
export type FeeStatus = "paid" | "due" | "overdue";

export type Student = {
  id: string;
  name: string;
  /** Display label such as "Class 8", not a sort key. */
  className: string;
  school: string;
  batchId: string;
  parentName: string;
  /** E.164 — drives the wa.me reminder link, so it must carry the country code. */
  parentPhone: string;
  photo: string;
  admissionDate: string;
  status: StudentStatus;
  loginId: string;
  pin: string;
  /** Manual override that locks vacation material regardless of fee status. */
  accessSuspended: boolean;
  /** DPDP Act 2023 parental consent, captured on the admission form. */
  consentGiven: boolean;
};

export type Batch = {
  id: string;
  name: string;
  classRange: string;
  subjects: string[];
  days: Weekday[];
  /** 24-hour "HH:mm". */
  startTime: string;
  endTime: string;
};

export type FeePlan = {
  studentId: string;
  /** Rupees per cycle, before concession. */
  amount: number;
  cycle: FeeCycle;
  startDate: string;
  /** Rupees off per cycle. 0 when there is no concession. */
  concession: number;
};

export type Payment = {
  id: string;
  studentId: string;
  date: string;
  amount: number;
  mode: PaymentMode;
  note: string;
};

export type AttendanceRecord = {
  batchId: string;
  date: string;
  /** Student ids. A student in neither list was not enrolled that day. */
  present: string[];
  absent: string[];
};

export type Test = {
  id: string;
  name: string;
  subject: string;
  batchId: string;
  date: string;
  maxMarks: number;
};

export type Mark = {
  testId: string;
  studentId: string;
  score: number;
};

export type NoticeAudience = "all" | { batchId: string };

export type Notice = {
  id: string;
  title: string;
  body: string;
  audience: NoticeAudience;
  postedAt: string;
};

export type Material = {
  id: string;
  title: string;
  file: string;
  className: string;
  /** Inclusive vacation window. Outside it the portal section does not exist. */
  activeFrom: string;
  activeTo: string;
};
```

- [ ] **Step 5: Verify it compiles**

Run: `bunx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
bun run format
git add vitest.config.ts src/lib/crm/types.ts package.json bun.lock
git commit -m "Add CRM entity types and Vitest"
```

---

### Task 2: Fee logic

**Files:**
- Create: `src/lib/crm/fees.ts`
- Test: `src/lib/crm/fees.test.ts`

**Interfaces:**
- Consumes: `FeeCycle`, `FeePlan`, `FeeStatus`, `Payment` from `@/lib/crm/types`
- Produces:
  - `OVERDUE_GRACE_DAYS: number`
  - `cycleStart(plan: FeePlan, on: Date): Date`
  - `cycleAmount(plan: FeePlan): number`
  - `paidInCycle(plan: FeePlan, payments: Payment[], on: Date): number`
  - `balance(plan: FeePlan, payments: Payment[], on: Date): number`
  - `feeStatus(plan: FeePlan, payments: Payment[], on: Date): FeeStatus`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/crm/fees.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { FeePlan, Payment } from "./types";
import { balance, cycleAmount, cycleStart, feeStatus, paidInCycle } from "./fees";

const plan: FeePlan = {
  studentId: "s1",
  amount: 600,
  cycle: "monthly",
  startDate: "2026-06-01",
  concession: 0,
};

function payment(date: string, amount: number): Payment {
  return { id: `p-${date}-${amount}`, studentId: "s1", date, amount, mode: "cash", note: "" };
}

describe("cycleStart", () => {
  it("returns the plan start when the date is inside the first cycle", () => {
    expect(cycleStart(plan, new Date("2026-06-14"))).toEqual(new Date("2026-06-01T00:00:00"));
  });

  it("walks forward to the cycle containing the date", () => {
    expect(cycleStart(plan, new Date("2026-08-03"))).toEqual(new Date("2026-08-01T00:00:00"));
  });

  it("returns the plan start for a date before the plan begins", () => {
    expect(cycleStart(plan, new Date("2026-05-20"))).toEqual(new Date("2026-06-01T00:00:00"));
  });

  it("steps three months at a time for a quarterly plan", () => {
    const quarterly: FeePlan = { ...plan, cycle: "quarterly" };
    expect(cycleStart(quarterly, new Date("2026-08-30"))).toEqual(
      new Date("2026-06-01T00:00:00"),
    );
    expect(cycleStart(quarterly, new Date("2026-09-02"))).toEqual(
      new Date("2026-09-01T00:00:00"),
    );
  });
});

describe("cycleAmount", () => {
  it("subtracts the concession", () => {
    expect(cycleAmount({ ...plan, concession: 100 })).toBe(500);
  });

  it("never goes negative when the concession exceeds the fee", () => {
    expect(cycleAmount({ ...plan, concession: 900 })).toBe(0);
  });
});

describe("paidInCycle", () => {
  it("counts only payments dated inside the cycle", () => {
    const payments = [payment("2026-05-28", 600), payment("2026-06-05", 400), payment("2026-07-02", 600)];
    expect(paidInCycle(plan, payments, new Date("2026-06-20"))).toBe(400);
  });

  it("sums part payments within one cycle", () => {
    const payments = [payment("2026-06-02", 300), payment("2026-06-19", 200)];
    expect(paidInCycle(plan, payments, new Date("2026-06-25"))).toBe(500);
  });

  it("ignores payments belonging to another student", () => {
    const other: Payment = { ...payment("2026-06-05", 600), studentId: "s2" };
    expect(paidInCycle(plan, [other], new Date("2026-06-20"))).toBe(0);
  });
});

describe("balance", () => {
  it("is the shortfall for the current cycle", () => {
    expect(balance(plan, [payment("2026-06-05", 250)], new Date("2026-06-20"))).toBe(350);
  });

  it("clamps at zero when overpaid", () => {
    expect(balance(plan, [payment("2026-06-05", 900)], new Date("2026-06-20"))).toBe(0);
  });
});

describe("feeStatus", () => {
  it("is paid once the cycle is covered", () => {
    expect(feeStatus(plan, [payment("2026-06-03", 600)], new Date("2026-06-20"))).toBe("paid");
  });

  it("is due inside the grace period", () => {
    expect(feeStatus(plan, [], new Date("2026-06-05"))).toBe("due");
  });

  it("is due on the last day of grace", () => {
    expect(feeStatus(plan, [], new Date("2026-06-08"))).toBe("due");
  });

  it("is overdue once grace has passed", () => {
    expect(feeStatus(plan, [], new Date("2026-06-09"))).toBe("overdue");
  });

  it("is due for a plan that has not started yet", () => {
    expect(feeStatus(plan, [], new Date("2026-05-20"))).toBe("due");
  });

  it("treats a part payment past grace as overdue", () => {
    expect(feeStatus(plan, [payment("2026-06-02", 500)], new Date("2026-06-25"))).toBe("overdue");
  });

  it("is paid when a concession covers the remainder", () => {
    const discounted: FeePlan = { ...plan, concession: 200 };
    expect(feeStatus(discounted, [payment("2026-06-02", 400)], new Date("2026-06-25"))).toBe("paid");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `bun run test src/lib/crm/fees.test.ts`
Expected: FAIL — `Failed to resolve import "./fees"`.

- [ ] **Step 3: Implement `src/lib/crm/fees.ts`**

```ts
import { addMonths, differenceInCalendarDays, isBefore, parseISO, startOfDay } from "date-fns";
import type { FeeCycle, FeePlan, FeeStatus, Payment } from "./types";

const CYCLE_MONTHS: Record<FeeCycle, number> = { monthly: 1, quarterly: 3 };

/** Days after a cycle opens before an unpaid balance is treated as overdue. */
export const OVERDUE_GRACE_DAYS = 7;

/**
 * Start of the billing cycle containing `on`.
 *
 * Fees are paid in advance, so the cycle start is also the due date. Cycles
 * repeat from the plan's start date; this walks forward one cycle at a time
 * rather than doing modular month arithmetic, because month lengths vary and
 * the loop is trivially verifiable. Plans span a few years at most.
 */
export function cycleStart(plan: FeePlan, on: Date): Date {
  const step = CYCLE_MONTHS[plan.cycle];
  const day = startOfDay(on);
  let start = startOfDay(parseISO(plan.startDate));
  if (isBefore(day, start)) return start;
  for (;;) {
    const next = addMonths(start, step);
    if (isBefore(day, next)) return start;
    start = next;
  }
}

/** What one cycle costs after concession. */
export function cycleAmount(plan: FeePlan): number {
  return Math.max(0, plan.amount - plan.concession);
}

/**
 * Payments dated inside the cycle containing `on`.
 *
 * Attribution is by payment date, so a parent paying next month's fees a few
 * days early is credited to the current cycle. Known limitation, documented in
 * the spec, acceptable while the data is fabricated.
 */
export function paidInCycle(plan: FeePlan, payments: Payment[], on: Date): number {
  const start = cycleStart(plan, on);
  const end = addMonths(start, CYCLE_MONTHS[plan.cycle]);
  return payments
    .filter((p) => p.studentId === plan.studentId)
    .filter((p) => {
      const paidOn = startOfDay(parseISO(p.date));
      return !isBefore(paidOn, start) && isBefore(paidOn, end);
    })
    .reduce((total, p) => total + p.amount, 0);
}

/** Outstanding rupees for the current cycle. Never negative. */
export function balance(plan: FeePlan, payments: Payment[], on: Date): number {
  return Math.max(0, cycleAmount(plan) - paidInCycle(plan, payments, on));
}

/**
 * Soft-gate status. Only `overdue` locks vacation material; `due` shows a
 * banner and nothing more. A student's own record is never hidden from them.
 */
export function feeStatus(plan: FeePlan, payments: Payment[], on: Date): FeeStatus {
  if (balance(plan, payments, on) === 0) return "paid";
  const daysIntoCycle = differenceInCalendarDays(startOfDay(on), cycleStart(plan, on));
  return daysIntoCycle > OVERDUE_GRACE_DAYS ? "overdue" : "due";
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `bun run test src/lib/crm/fees.test.ts`
Expected: PASS, 18 tests.

- [ ] **Step 5: Commit**

```bash
bun run format
git add src/lib/crm/fees.ts src/lib/crm/fees.test.ts
git commit -m "Add fee cycle and status logic"
```

---

### Task 3: Attendance and vacation-window logic

**Files:**
- Create: `src/lib/crm/attendance.ts`
- Create: `src/lib/crm/material.ts`
- Test: `src/lib/crm/attendance.test.ts`
- Test: `src/lib/crm/material.test.ts`

**Interfaces:**
- Consumes: `AttendanceRecord`, `Material` from `@/lib/crm/types`
- Produces:
  - `attendancePercent(records: AttendanceRecord[], studentId: string, from: Date, to: Date): number | null`
  - `isMaterialActive(material: Material, on: Date): boolean`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/crm/attendance.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { AttendanceRecord } from "./types";
import { attendancePercent } from "./attendance";

function session(date: string, present: string[], absent: string[]): AttendanceRecord {
  return { batchId: "b1", date, present, absent };
}

const june = { from: new Date("2026-06-01"), to: new Date("2026-06-30") };

describe("attendancePercent", () => {
  it("returns the percentage of sessions attended", () => {
    const records = [
      session("2026-06-02", ["s1"], ["s2"]),
      session("2026-06-03", ["s1"], ["s2"]),
      session("2026-06-04", ["s2"], ["s1"]),
      session("2026-06-05", ["s1"], ["s2"]),
    ];
    expect(attendancePercent(records, "s1", june.from, june.to)).toBe(75);
  });

  it("returns null when the student appears in no session", () => {
    const records = [session("2026-06-02", ["s2"], ["s3"])];
    expect(attendancePercent(records, "s1", june.from, june.to)).toBeNull();
  });

  it("returns null for an empty register", () => {
    expect(attendancePercent([], "s1", june.from, june.to)).toBeNull();
  });

  it("ignores sessions before the student joined", () => {
    const records = [
      session("2026-06-02", ["s2"], []),
      session("2026-06-20", ["s1"], []),
      session("2026-06-21", ["s1"], []),
    ];
    expect(attendancePercent(records, "s1", june.from, june.to)).toBe(100);
  });

  it("includes sessions on both range boundaries", () => {
    const records = [
      session("2026-06-01", ["s1"], []),
      session("2026-06-30", [], ["s1"]),
    ];
    expect(attendancePercent(records, "s1", june.from, june.to)).toBe(50);
  });

  it("excludes sessions outside the range", () => {
    const records = [
      session("2026-05-31", [], ["s1"]),
      session("2026-06-10", ["s1"], []),
      session("2026-07-01", [], ["s1"]),
    ];
    expect(attendancePercent(records, "s1", june.from, june.to)).toBe(100);
  });

  it("rounds to the nearest whole percent", () => {
    const records = [
      session("2026-06-02", ["s1"], []),
      session("2026-06-03", ["s1"], []),
      session("2026-06-04", [], ["s1"]),
    ];
    expect(attendancePercent(records, "s1", june.from, june.to)).toBe(67);
  });
});
```

Create `src/lib/crm/material.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Material } from "./types";
import { isMaterialActive } from "./material";

const summer: Material = {
  id: "m1",
  title: "Summer practice set",
  file: "/material/summer.pdf",
  className: "Class 8",
  activeFrom: "2026-05-01",
  activeTo: "2026-06-30",
};

describe("isMaterialActive", () => {
  it("is active in the middle of the window", () => {
    expect(isMaterialActive(summer, new Date("2026-05-20"))).toBe(true);
  });

  it("is active on the first day", () => {
    expect(isMaterialActive(summer, new Date("2026-05-01"))).toBe(true);
  });

  it("is active for the whole of the last day", () => {
    expect(isMaterialActive(summer, new Date("2026-06-30T23:30:00"))).toBe(true);
  });

  it("is inactive the day before it opens", () => {
    expect(isMaterialActive(summer, new Date("2026-04-30"))).toBe(false);
  });

  it("is inactive the day after it closes", () => {
    expect(isMaterialActive(summer, new Date("2026-07-01"))).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `bun run test src/lib/crm/attendance.test.ts src/lib/crm/material.test.ts`
Expected: FAIL — both imports unresolved.

- [ ] **Step 3: Implement `src/lib/crm/attendance.ts`**

```ts
import { isBefore, parseISO, startOfDay } from "date-fns";
import type { AttendanceRecord } from "./types";

/**
 * Sessions inside the range where this student was recorded either present or
 * absent. A student missing from both lists was not enrolled that day, which is
 * different from being absent.
 */
function sessionsFor(
  records: AttendanceRecord[],
  studentId: string,
  from: Date,
  to: Date,
): AttendanceRecord[] {
  const lo = startOfDay(from);
  const hi = startOfDay(to);
  return records.filter((record) => {
    const day = startOfDay(parseISO(record.date));
    if (isBefore(day, lo) || isBefore(hi, day)) return false;
    return record.present.includes(studentId) || record.absent.includes(studentId);
  });
}

/**
 * Percent of recorded sessions attended, or null when there were none.
 *
 * Null and 0 are deliberately different. A student who joined last week has no
 * sessions behind them, and showing a parent "0% attendance" would be a lie.
 * Callers render the null case as "no classes yet".
 */
export function attendancePercent(
  records: AttendanceRecord[],
  studentId: string,
  from: Date,
  to: Date,
): number | null {
  const sessions = sessionsFor(records, studentId, from, to);
  if (sessions.length === 0) return null;
  const present = sessions.filter((record) => record.present.includes(studentId)).length;
  return Math.round((present / sessions.length) * 100);
}
```

- [ ] **Step 4: Implement `src/lib/crm/material.ts`**

```ts
import { isBefore, parseISO, startOfDay } from "date-fns";
import type { Material } from "./types";

/**
 * Whether a vacation window is open on `on`. Both ends inclusive.
 *
 * Compared at day granularity on purpose: an `activeTo` of "2026-06-30" parses
 * to midnight, so an instant comparison would hide the material for the whole
 * of its final day.
 */
export function isMaterialActive(material: Material, on: Date): boolean {
  const day = startOfDay(on);
  const from = startOfDay(parseISO(material.activeFrom));
  const to = startOfDay(parseISO(material.activeTo));
  return !isBefore(day, from) && !isBefore(to, day);
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `bun run test`
Expected: PASS — all three test files, 30 tests total.

- [ ] **Step 6: Commit**

```bash
bun run format
git add src/lib/crm/attendance.ts src/lib/crm/attendance.test.ts src/lib/crm/material.ts src/lib/crm/material.test.ts
git commit -m "Add attendance percentage and vacation window logic"
```

---

### Task 4: Dummy data

**Files:**
- Create: `src/data/crm/batches.ts`
- Create: `src/data/crm/students.ts`
- Create: `src/data/crm/fees.ts`
- Create: `src/data/crm/attendance.ts`
- Create: `src/data/crm/tests.ts`
- Create: `src/data/crm/notices.ts`
- Create: `src/data/crm/material.ts`

**Interfaces:**
- Consumes: every type from `@/lib/crm/types`
- Produces: `batches`, `students`, `feePlans`, `payments`, `attendanceRecords`, `tests`, `marks`, `notices`, `materials` — mutable arrays, imported **only** by `src/lib/crm/store.ts`

Fabricated data. Names are invented; nothing here corresponds to a real student. Dates sit in mid-2026 so that with a system clock of 2026-08-30 the fee statuses show a realistic mix of paid, due and overdue.

- [ ] **Step 1: Create `src/data/crm/batches.ts`**

```ts
import type { Batch } from "@/lib/crm/types";

export const batches: Batch[] = [
  {
    id: "b-navodaya",
    name: "Navodaya Preparation",
    classRange: "Class 5",
    subjects: ["Mental Ability", "Arithmetic", "Language"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "07:00",
    endTime: "08:30",
  },
  {
    id: "b-middle",
    name: "Middle School Evening",
    classRange: "Class 6-8",
    subjects: ["Maths", "Science", "English"],
    days: ["Mon", "Wed", "Fri"],
    startTime: "16:00",
    endTime: "18:00",
  },
  {
    id: "b-board",
    name: "Board Batch",
    classRange: "Class 9-10",
    subjects: ["Maths", "Science", "Social Science", "English"],
    days: ["Mon", "Tue", "Wed", "Thu", "Sat"],
    startTime: "18:00",
    endTime: "20:00",
  },
];
```

- [ ] **Step 2: Create `src/data/crm/students.ts`**

Fifteen students spread across the three batches. `photo` is empty everywhere — the UI falls back to initials, so no placeholder image files are needed.

```ts
import type { Student } from "@/lib/crm/types";

/** Keeps the fifteen rows below readable; every student shares these defaults. */
function student(
  id: string,
  name: string,
  className: string,
  batchId: string,
  school: string,
  parentName: string,
  parentPhone: string,
  admissionDate: string,
  overrides: Partial<Student> = {},
): Student {
  return {
    id,
    name,
    className,
    school,
    batchId,
    parentName,
    parentPhone,
    photo: "",
    admissionDate,
    status: "active",
    loginId: id.toUpperCase().replace("-", ""),
    pin: "1234",
    accessSuspended: false,
    consentGiven: true,
    ...overrides,
  };
}

export const students: Student[] = [
  student("s-01", "Aditi Rathore", "Class 5", "b-navodaya", "Govt. Primary School", "Ramesh Rathore", "+919876500001", "2026-04-08"),
  student("s-02", "Kunal Vishwakarma", "Class 5", "b-navodaya", "Saraswati Shishu Mandir", "Dinesh Vishwakarma", "+919876500002", "2026-04-10"),
  student("s-03", "Payal Ahirwar", "Class 5", "b-navodaya", "Govt. Primary School", "Suresh Ahirwar", "+919876500003", "2026-04-15"),
  student("s-04", "Harsh Patel", "Class 5", "b-navodaya", "Adarsh Vidyalaya", "Manoj Patel", "+919876500004", "2026-05-02"),
  student("s-05", "Sneha Yadav", "Class 6", "b-middle", "Saraswati Shishu Mandir", "Rajkumar Yadav", "+919876500005", "2026-04-06"),
  student("s-06", "Aryan Malviya", "Class 7", "b-middle", "Govt. Middle School", "Prakash Malviya", "+919876500006", "2026-04-06"),
  student("s-07", "Nisha Thakur", "Class 7", "b-middle", "Adarsh Vidyalaya", "Devendra Thakur", "+919876500007", "2026-04-20"),
  student("s-08", "Ritik Sen", "Class 8", "b-middle", "Govt. Middle School", "Ashok Sen", "+919876500008", "2026-04-06"),
  student("s-09", "Khushi Jain", "Class 8", "b-middle", "Saraswati Shishu Mandir", "Vinod Jain", "+919876500009", "2026-06-01"),
  student("s-10", "Sahil Kushwaha", "Class 8", "b-middle", "Govt. Middle School", "Ramkishan Kushwaha", "+919876500010", "2026-04-06", { status: "break" }),
  student("s-11", "Anjali Sarathe", "Class 9", "b-board", "Govt. High School", "Mukesh Sarathe", "+919876500011", "2026-04-05"),
  student("s-12", "Deepak Lodhi", "Class 9", "b-board", "Adarsh Vidyalaya", "Santosh Lodhi", "+919876500012", "2026-04-05"),
  student("s-13", "Pooja Raikwar", "Class 10", "b-board", "Govt. High School", "Jagdish Raikwar", "+919876500013", "2026-04-05"),
  student("s-14", "Vivek Chouhan", "Class 10", "b-board", "Govt. High School", "Narendra Chouhan", "+919876500014", "2026-04-12", { accessSuspended: true }),
  student("s-15", "Meena Bai", "Class 10", "b-board", "Adarsh Vidyalaya", "Kailash Prajapati", "+919876500015", "2026-04-05", { consentGiven: false }),
];
```

- [ ] **Step 3: Create `src/data/crm/fees.ts`**

Plans start on each student's admission date so `cycleStart` has something realistic to walk. Payments are deliberately uneven, giving a mix of statuses on 2026-08-30.

```ts
import type { FeePlan, Payment } from "@/lib/crm/types";

export const feePlans: FeePlan[] = [
  { studentId: "s-01", amount: 700, cycle: "monthly", startDate: "2026-04-08", concession: 0 },
  { studentId: "s-02", amount: 700, cycle: "monthly", startDate: "2026-04-10", concession: 0 },
  { studentId: "s-03", amount: 700, cycle: "monthly", startDate: "2026-04-15", concession: 200 },
  { studentId: "s-04", amount: 700, cycle: "monthly", startDate: "2026-05-02", concession: 0 },
  { studentId: "s-05", amount: 600, cycle: "monthly", startDate: "2026-04-06", concession: 0 },
  { studentId: "s-06", amount: 600, cycle: "monthly", startDate: "2026-04-06", concession: 0 },
  { studentId: "s-07", amount: 600, cycle: "monthly", startDate: "2026-04-20", concession: 100 },
  { studentId: "s-08", amount: 600, cycle: "monthly", startDate: "2026-04-06", concession: 0 },
  { studentId: "s-09", amount: 600, cycle: "monthly", startDate: "2026-06-01", concession: 0 },
  { studentId: "s-10", amount: 600, cycle: "monthly", startDate: "2026-04-06", concession: 0 },
  { studentId: "s-11", amount: 900, cycle: "monthly", startDate: "2026-04-05", concession: 0 },
  { studentId: "s-12", amount: 900, cycle: "quarterly", startDate: "2026-04-05", concession: 0 },
  { studentId: "s-13", amount: 900, cycle: "monthly", startDate: "2026-04-05", concession: 0 },
  { studentId: "s-14", amount: 900, cycle: "monthly", startDate: "2026-04-12", concession: 0 },
  { studentId: "s-15", amount: 900, cycle: "monthly", startDate: "2026-04-05", concession: 300 },
];

let seq = 0;
function pay(studentId: string, date: string, amount: number, mode: Payment["mode"]): Payment {
  seq += 1;
  return { id: `pay-${String(seq).padStart(3, "0")}`, studentId, date, amount, mode, note: "" };
}

export const payments: Payment[] = [
  pay("s-01", "2026-08-09", 700, "upi"),
  pay("s-02", "2026-08-11", 700, "cash"),
  pay("s-03", "2026-08-16", 500, "cash"),
  pay("s-04", "2026-08-03", 700, "upi"),
  pay("s-05", "2026-08-07", 600, "upi"),
  pay("s-06", "2026-08-06", 300, "cash"),
  pay("s-07", "2026-08-21", 500, "upi"),
  pay("s-08", "2026-07-08", 600, "cash"),
  pay("s-09", "2026-08-02", 600, "upi"),
  pay("s-11", "2026-08-06", 900, "upi"),
  pay("s-12", "2026-07-04", 900, "cash"),
  pay("s-13", "2026-08-05", 400, "cash"),
  pay("s-15", "2026-08-05", 600, "upi"),
];
```

- [ ] **Step 4: Create `src/data/crm/attendance.ts`**

Four weeks of August sessions, generated so the file stays short and the roster stays consistent with `students.ts`.

```ts
import type { AttendanceRecord } from "@/lib/crm/types";

const roster: Record<string, string[]> = {
  "b-navodaya": ["s-01", "s-02", "s-03", "s-04"],
  "b-middle": ["s-05", "s-06", "s-07", "s-08", "s-09"],
  "b-board": ["s-11", "s-12", "s-13", "s-14", "s-15"],
};

/** Dates each batch actually met during August 2026. */
const sessionDates: Record<string, string[]> = {
  "b-navodaya": ["2026-08-03", "2026-08-05", "2026-08-07", "2026-08-10", "2026-08-12", "2026-08-14", "2026-08-17", "2026-08-19", "2026-08-21", "2026-08-24", "2026-08-26", "2026-08-28"],
  "b-middle": ["2026-08-03", "2026-08-05", "2026-08-07", "2026-08-10", "2026-08-12", "2026-08-14", "2026-08-17", "2026-08-19", "2026-08-21", "2026-08-24"],
  "b-board": ["2026-08-04", "2026-08-06", "2026-08-08", "2026-08-11", "2026-08-13", "2026-08-18", "2026-08-20", "2026-08-25", "2026-08-27"],
};

/**
 * Absences keyed by "batchId|date". Everyone else present. Spread thinly so the
 * percentages land between roughly 70% and 100% rather than all at 100.
 */
const absences: Record<string, string[]> = {
  "b-navodaya|2026-08-05": ["s-03"],
  "b-navodaya|2026-08-12": ["s-02", "s-04"],
  "b-navodaya|2026-08-21": ["s-03"],
  "b-navodaya|2026-08-26": ["s-01"],
  "b-middle|2026-08-05": ["s-06"],
  "b-middle|2026-08-07": ["s-06", "s-08"],
  "b-middle|2026-08-14": ["s-07"],
  "b-middle|2026-08-19": ["s-06"],
  "b-middle|2026-08-24": ["s-08"],
  "b-board|2026-08-06": ["s-14"],
  "b-board|2026-08-13": ["s-12", "s-15"],
  "b-board|2026-08-20": ["s-14"],
  "b-board|2026-08-27": ["s-13"],
};

function build(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  for (const [batchId, dates] of Object.entries(sessionDates)) {
    const enrolled = roster[batchId] ?? [];
    for (const date of dates) {
      const absent = absences[`${batchId}|${date}`] ?? [];
      records.push({
        batchId,
        date,
        present: enrolled.filter((id) => !absent.includes(id)),
        absent: [...absent],
      });
    }
  }
  return records;
}

export const attendanceRecords: AttendanceRecord[] = build();
```

Note: `s-10` is on a break and appears in no roster, so `attendancePercent` returns `null` for them. That is the intended null path, exercised by the UI.

- [ ] **Step 5: Create `src/data/crm/tests.ts`**

```ts
import type { Mark, Test } from "@/lib/crm/types";

export const tests: Test[] = [
  { id: "t-01", name: "Weekly Test 3", subject: "Maths", batchId: "b-middle", date: "2026-08-08", maxMarks: 25 },
  { id: "t-02", name: "Weekly Test 4", subject: "Science", batchId: "b-middle", date: "2026-08-22", maxMarks: 25 },
  { id: "t-03", name: "Unit Test 1", subject: "Maths", batchId: "b-board", date: "2026-08-18", maxMarks: 50 },
];

export const marks: Mark[] = [
  { testId: "t-01", studentId: "s-05", score: 21 },
  { testId: "t-01", studentId: "s-06", score: 14 },
  { testId: "t-01", studentId: "s-07", score: 19 },
  { testId: "t-01", studentId: "s-08", score: 23 },
  { testId: "t-01", studentId: "s-09", score: 17 },
  { testId: "t-02", studentId: "s-05", score: 23 },
  { testId: "t-02", studentId: "s-06", score: 17 },
  { testId: "t-02", studentId: "s-07", score: 18 },
  { testId: "t-02", studentId: "s-08", score: 24 },
  { testId: "t-02", studentId: "s-09", score: 20 },
  { testId: "t-03", studentId: "s-11", score: 41 },
  { testId: "t-03", studentId: "s-12", score: 33 },
  { testId: "t-03", studentId: "s-13", score: 46 },
  { testId: "t-03", studentId: "s-14", score: 28 },
  { testId: "t-03", studentId: "s-15", score: 37 },
];
```

- [ ] **Step 6: Create `src/data/crm/notices.ts`**

```ts
import type { Notice } from "@/lib/crm/types";

export const notices: Notice[] = [
  {
    id: "n-01",
    title: "Independence Day holiday",
    body: "The academy will remain closed on 15 August. Classes resume as usual on 17 August.",
    audience: "all",
    postedAt: "2026-08-12",
  },
  {
    id: "n-02",
    title: "Unit Test 1 on 18 August",
    body: "Maths Unit Test 1 covers chapters 1 to 4. Bring your own geometry box.",
    audience: { batchId: "b-board" },
    postedAt: "2026-08-11",
  },
  {
    id: "n-03",
    title: "Navodaya form filling",
    body: "Parents of Class 5 students, please bring the caste and residence certificates this week.",
    audience: { batchId: "b-navodaya" },
    postedAt: "2026-08-19",
  },
];
```

- [ ] **Step 7: Create `src/data/crm/material.ts`**

One window already closed and one still open, so both branches of `isMaterialActive` are visible in the UI.

```ts
import type { Material } from "@/lib/crm/types";

export const materials: Material[] = [
  {
    id: "m-01",
    title: "Summer practice set — Maths",
    file: "/material/summer-maths.pdf",
    className: "Class 8",
    activeFrom: "2026-05-01",
    activeTo: "2026-06-30",
  },
  {
    id: "m-02",
    title: "Navodaya mock paper 1",
    file: "/material/navodaya-mock-1.pdf",
    className: "Class 5",
    activeFrom: "2026-08-15",
    activeTo: "2026-09-15",
  },
];
```

- [ ] **Step 8: Verify types**

Run: `bunx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 9: Commit**

```bash
bun run format
git add src/data/crm
git commit -m "Add CRM dummy data"
```

---

### Task 5: The store seam

**Files:**
- Create: `src/lib/crm/store.ts`

**Interfaces:**
- Consumes: every array from `src/data/crm/*`, plus `feeStatus` and `balance` from `./fees` and `attendancePercent` from `./attendance`
- Produces, all `async`:
  - `listBatches(): Promise<Batch[]>`
  - `getBatch(id: string): Promise<Batch | null>`
  - `listStudents(): Promise<Student[]>`
  - `getStudent(id: string): Promise<Student | null>`
  - `listStudentsInBatch(batchId: string): Promise<Student[]>`
  - `getFeePlan(studentId: string): Promise<FeePlan | null>`
  - `listPayments(studentId: string): Promise<Payment[]>`
  - `getFeeSummary(studentId: string, on?: Date): Promise<FeeSummary | null>`
  - `getAttendanceSummary(studentId: string, from: Date, to: Date): Promise<number | null>`
  - `listMarksForStudent(studentId: string): Promise<StudentMark[]>`
  - `listNoticesForStudent(studentId: string): Promise<Notice[]>`
  - and the exported types `FeeSummary` and `StudentMark`

- [ ] **Step 1: Create `src/lib/crm/store.ts`**

```ts
// The only bridge between screens and stored data.
//
// Every function is async even though the dummy arrays could be returned
// synchronously. Supabase is async; if screens consumed sync values here, the
// migration would rewrite every component and this seam would have bought
// nothing. When Postgres lands, only the bodies below change.
//
// Screens must never import from src/data/crm/* directly.

import { attendanceRecords } from "@/data/crm/attendance";
import { batches } from "@/data/crm/batches";
import { feePlans, payments } from "@/data/crm/fees";
import { notices } from "@/data/crm/notices";
import { marks, tests } from "@/data/crm/tests";
import { students } from "@/data/crm/students";
import { attendancePercent } from "./attendance";
import { balance, feeStatus } from "./fees";
import type {
  Batch,
  FeePlan,
  FeeStatus,
  Notice,
  Payment,
  Student,
} from "./types";

export type FeeSummary = {
  plan: FeePlan;
  status: FeeStatus;
  /** Outstanding rupees for the current cycle. */
  balance: number;
};

export type StudentMark = {
  testId: string;
  testName: string;
  subject: string;
  date: string;
  score: number;
  maxMarks: number;
};

export async function listBatches(): Promise<Batch[]> {
  return [...batches];
}

export async function getBatch(id: string): Promise<Batch | null> {
  return batches.find((b) => b.id === id) ?? null;
}

export async function listStudents(): Promise<Student[]> {
  return [...students];
}

export async function getStudent(id: string): Promise<Student | null> {
  return students.find((s) => s.id === id) ?? null;
}

export async function listStudentsInBatch(batchId: string): Promise<Student[]> {
  return students.filter((s) => s.batchId === batchId);
}

export async function getFeePlan(studentId: string): Promise<FeePlan | null> {
  return feePlans.find((p) => p.studentId === studentId) ?? null;
}

export async function listPayments(studentId: string): Promise<Payment[]> {
  return payments
    .filter((p) => p.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Null when the student has no fee plan on record. */
export async function getFeeSummary(
  studentId: string,
  on: Date = new Date(),
): Promise<FeeSummary | null> {
  const plan = feePlans.find((p) => p.studentId === studentId);
  if (!plan) return null;
  return {
    plan,
    status: feeStatus(plan, payments, on),
    balance: balance(plan, payments, on),
  };
}

/** Null when no sessions were recorded for this student in the range. */
export async function getAttendanceSummary(
  studentId: string,
  from: Date,
  to: Date,
): Promise<number | null> {
  return attendancePercent(attendanceRecords, studentId, from, to);
}

export async function listMarksForStudent(studentId: string): Promise<StudentMark[]> {
  return marks
    .filter((m) => m.studentId === studentId)
    .flatMap((m) => {
      const test = tests.find((t) => t.id === m.testId);
      if (!test) return [];
      return [
        {
          testId: test.id,
          testName: test.name,
          subject: test.subject,
          date: test.date,
          score: m.score,
          maxMarks: test.maxMarks,
        },
      ];
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function listNoticesForStudent(studentId: string): Promise<Notice[]> {
  const student = students.find((s) => s.id === studentId);
  if (!student) return [];
  return notices
    .filter((n) => n.audience === "all" || n.audience.batchId === student.batchId)
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}
```

`flatMap` returning `[]` for a missing test is how an orphan mark is dropped without an unsafe non-null assertion — `noUncheckedIndexedAccess` makes `find` return `Test | undefined`, and this satisfies it cleanly.

- [ ] **Step 2: Verify types and lint**

Run: `bunx tsc --noEmit && bun run lint`
Expected: 0 errors from both.

- [ ] **Step 3: Commit**

```bash
bun run format
git add src/lib/crm/store.ts
git commit -m "Add async store seam over CRM dummy data"
```

---

### Task 6: Lock the admin and portal surfaces to the light palette

**Files:**
- Modify: `src/styles.css` (the `:root:not([data-theme="dark"])` selector at line 132, and the `body:has(.theme-paper)` rule at line 315)

**Interfaces:**
- Consumes: nothing
- Produces: a `.theme-app` class that renders the `/` light palette regardless of the global dark toggle

- [ ] **Step 1: Extend the light-palette selector**

In `src/styles.css`, find:

```css
:root:not([data-theme="dark"]) {
  color-scheme: light;
```

Replace those two lines with:

```css
/* The `/` light palette. `.theme-app` opts a subtree into it unconditionally,
   which is how /admin and /portal stay light even for a visitor who toggled
   dark mode on the marketing site. Extend this selector — never copy the block
   — so the two can never drift. Custom properties inherit from the nearest
   declaring ancestor, so the wrapper beats :root inside its own subtree. */
:root:not([data-theme="dark"]),
.theme-app {
  color-scheme: light;
```

Leave every declaration in the block untouched. This matters beyond the brand
colours: the block also declares the shadcn tokens (`--background`, `--card`,
`--primary`, `--border`, `--ring`) that admin's tables, dialogs and selects
depend on.

- [ ] **Step 2: Add the body background rule**

Directly after the existing `body:has(.theme-paper)` rule, add:

```css
body:has(.theme-app) {
  background-color: var(--page);
  color: var(--body);
}
```

- [ ] **Step 3: Verify the compiled CSS carries the new selector**

```bash
bun run build 2>&1 | tail -5
grep -ro "\.theme-app" .output/public/_build/assets/*.css | head -3
```

Expected: the build succeeds and `.theme-app` appears at least once.

- [ ] **Step 4: Commit**

```bash
bun run format
git add src/styles.css
git commit -m "Add .theme-app to lock admin and portal to the light palette"
```

---

### Task 7: Admin shell and layout route

**Files:**
- Create: `src/components/admin/AdminShell.tsx`
- Create: `src/routes/admin/route.tsx`
- Create: `src/routes/admin/index.tsx`

**Interfaces:**
- Consumes: `listStudents`, `listBatches` from `@/lib/crm/store`
- Produces: `AdminShell` (default export, props `{ children: ReactNode }`); the `/admin` layout route that wraps all admin children

TanStack Router derives routes from the filesystem and regenerates `src/routeTree.gen.ts` on dev/build. `route.tsx` inside a directory becomes that directory's layout.

- [ ] **Step 1: Create `src/components/admin/AdminShell.tsx`**

```tsx
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { GraduationCap, LayoutDashboard, Users } from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/batches", label: "Batches", icon: GraduationCap },
] as const;

/**
 * Chrome for every admin screen. Admin shares the portal's palette and is
 * distinguished by density instead: tight rows, compact controls, and a nav
 * that collapses to a bottom bar on a phone, since Mohit marks attendance
 * standing in the classroom.
 */
export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="theme-app min-h-screen bg-page text-body antialiased">
      <header className="border-b border-[color:var(--border)] bg-panel">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="focus-ring rounded font-display text-lg text-heading">
            Harshika Admin
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/admin" }}
                activeProps={{ className: "bg-gold-fill text-on-gold" }}
                inactiveProps={{ className: "text-body hover:bg-page" }}
                className="focus-ring flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium"
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:pb-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-[color:var(--border)] bg-panel sm:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/admin" }}
            activeProps={{ className: "text-gold" }}
            inactiveProps={{ className: "text-body" }}
            className="focus-ring flex flex-1 flex-col items-center gap-1 py-2 text-xs"
          >
            <Icon aria-hidden className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/routes/admin/route.tsx`**

```tsx
import { Outlet, createFileRoute } from "@tanstack/react-router";
import AdminShell from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Admin · Harshika Academy" },
      // v1 auth is a placeholder; keep every admin URL out of search results.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
```

- [ ] **Step 3: Create `src/routes/admin/index.tsx`**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listBatches, listStudents } from "@/lib/crm/store";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const students = useQuery({ queryKey: ["students"], queryFn: listStudents });
  const batches = useQuery({ queryKey: ["batches"], queryFn: listBatches });

  const active = students.data?.filter((s) => s.status === "active").length ?? 0;

  return (
    <div>
      <h1 className="font-display text-2xl text-heading">Dashboard</h1>
      <p className="mt-1 text-sm text-body">
        Fees, attendance and tests arrive in the next phases.
      </p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Active students" value={students.isPending ? "—" : String(active)} />
        <Stat
          label="On the register"
          value={students.isPending ? "—" : String(students.data?.length ?? 0)}
        />
        <Stat
          label="Batches"
          value={batches.isPending ? "—" : String(batches.data?.length ?? 0)}
        />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-panel p-4">
      <dt className="text-sm text-body">{label}</dt>
      <dd className="mt-1 font-display text-3xl text-heading">{value}</dd>
    </div>
  );
}
```

- [ ] **Step 4: Verify the route renders**

```bash
bun run dev
```

Visit `/admin` on the dev server URL that `bun run dev` prints. Expected: cream background, "Harshika Admin" header, three stat cards reading 14, 15 and 3. Confirm the header nav is visible at desktop width and replaced by a bottom bar under 640px. Stop the dev server when done.

- [ ] **Step 5: Verify types and lint**

Run: `bunx tsc --noEmit && bun run lint`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
bun run format
git add src/components/admin/AdminShell.tsx src/routes/admin src/routeTree.gen.ts
git commit -m "Add admin shell, layout route and dashboard"
```

---

### Task 8: Student list

**Files:**
- Create: `src/routes/admin/students/index.tsx`

**Interfaces:**
- Consumes: `listStudents`, `listBatches` from `@/lib/crm/store`; `Student` from `@/lib/crm/types`
- Produces: the `/admin/students` route

- [ ] **Step 1: Create `src/routes/admin/students/index.tsx`**

```tsx
import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listBatches, listStudents } from "@/lib/crm/store";
import type { Student, StudentStatus } from "@/lib/crm/types";

export const Route = createFileRoute("/admin/students/")({ component: StudentList });

const STATUS_LABEL: Record<StudentStatus, string> = {
  active: "Active",
  break: "On break",
  left: "Left",
};

function StudentList() {
  const students = useQuery({ queryKey: ["students"], queryFn: listStudents });
  const batches = useQuery({ queryKey: ["batches"], queryFn: listBatches });
  const [search, setSearch] = useState("");
  const [batchId, setBatchId] = useState("");

  const batchName = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of batches.data ?? []) map.set(b.id, b.name);
    return map;
  }, [batches.data]);

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (students.data ?? []).filter((s) => {
      if (batchId && s.batchId !== batchId) return false;
      if (!needle) return true;
      return (
        s.name.toLowerCase().includes(needle) ||
        s.parentName.toLowerCase().includes(needle) ||
        s.className.toLowerCase().includes(needle)
      );
    });
  }, [students.data, search, batchId]);

  return (
    <div>
      <h1 className="font-display text-2xl text-heading">Students</h1>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Search students</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, parent or class"
            className="focus-ring w-full rounded-md border border-[color:var(--border)] bg-panel px-3 py-2 text-sm text-heading placeholder:text-body/60"
          />
        </label>
        <label>
          <span className="sr-only">Filter by batch</span>
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="focus-ring w-full rounded-md border border-[color:var(--border)] bg-panel px-3 py-2 text-sm text-heading sm:w-56"
          >
            <option value="">All batches</option>
            {(batches.data ?? []).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {students.isPending ? (
        <p className="mt-6 text-sm text-body">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-body">No students match that search.</p>
      ) : (
        <>
          <p className="mt-4 text-sm text-body">
            {rows.length} of {students.data?.length ?? 0} students
          </p>
          <ul className="mt-2 divide-y divide-[color:var(--border)] rounded-lg border border-[color:var(--border)] bg-panel">
            {rows.map((s) => (
              <li key={s.id}>
                <Link
                  to="/admin/students/$id"
                  params={{ id: s.id }}
                  className="focus-ring flex items-center gap-3 px-4 py-3 hover:bg-page"
                >
                  <Initials name={s.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-heading">{s.name}</span>
                    <span className="block truncate text-sm text-body">
                      {s.className} · {batchName.get(s.batchId) ?? "No batch"}
                    </span>
                  </span>
                  {s.status !== "active" && (
                    <span className="shrink-0 rounded-full bg-page px-2 py-0.5 text-xs text-body">
                      {STATUS_LABEL[s.status]}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/** Photos are empty in v1, so the roster leads with initials rather than a grey box. */
function Initials({ name }: { name: Student["name"] }) {
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-fill text-sm font-semibold text-on-gold"
    >
      {letters}
    </span>
  );
}
```

- [ ] **Step 2: Verify it renders**

```bash
bun run dev
```

Visit `/admin/students` on the dev server URL. Expected: 15 rows; typing "yadav" narrows to Sneha Yadav; selecting "Board Batch" narrows to 5; Sahil Kushwaha shows an "On break" chip. Stop the server.

- [ ] **Step 3: Verify types and lint**

Run: `bunx tsc --noEmit && bun run lint`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
bun run format
git add src/routes/admin/students/index.tsx src/routeTree.gen.ts
git commit -m "Add admin student list with search and batch filter"
```

---

### Task 9: Student profile

**Files:**
- Create: `src/routes/admin/students/$id.tsx`

**Interfaces:**
- Consumes: `getStudent`, `getBatch`, `getFeeSummary`, `getAttendanceSummary`, `listMarksForStudent`, `listPayments` from `@/lib/crm/store`
- Produces: the `/admin/students/$id` route

- [ ] **Step 1: Create `src/routes/admin/students/$id.tsx`**

```tsx
import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import {
  getAttendanceSummary,
  getBatch,
  getFeeSummary,
  getStudent,
  listMarksForStudent,
  listPayments,
} from "@/lib/crm/store";
import type { FeeStatus } from "@/lib/crm/types";

export const Route = createFileRoute("/admin/students/$id")({ component: StudentProfile });

const FEE_LABEL: Record<FeeStatus, string> = {
  paid: "Paid",
  due: "Due",
  overdue: "Overdue",
};

const FEE_CLASS: Record<FeeStatus, string> = {
  paid: "bg-page text-body",
  due: "bg-gold-fill text-on-gold",
  overdue: "bg-[color:var(--danger)] text-white",
};

function StudentProfile() {
  const { id } = Route.useParams();
  const now = new Date();

  const student = useQuery({ queryKey: ["student", id], queryFn: () => getStudent(id) });
  const fees = useQuery({ queryKey: ["fees", id], queryFn: () => getFeeSummary(id) });
  const payments = useQuery({ queryKey: ["payments", id], queryFn: () => listPayments(id) });
  const marks = useQuery({ queryKey: ["marks", id], queryFn: () => listMarksForStudent(id) });
  const attendance = useQuery({
    queryKey: ["attendance", id],
    queryFn: () => getAttendanceSummary(id, startOfMonth(now), endOfMonth(now)),
  });
  const batch = useQuery({
    queryKey: ["batch", student.data?.batchId],
    queryFn: () => getBatch(student.data?.batchId ?? ""),
    enabled: Boolean(student.data?.batchId),
  });

  if (student.isPending) return <p className="text-sm text-body">Loading…</p>;
  if (!student.data) return <p className="text-sm text-body">No student with that id.</p>;

  const s = student.data;

  return (
    <div>
      <h1 className="font-display text-2xl text-heading">{s.name}</h1>
      <p className="mt-1 text-sm text-body">
        {s.className} · {batch.data?.name ?? "No batch"} · {s.school}
      </p>

      {!s.consentGiven && (
        <p className="mt-3 rounded-md border border-[color:var(--danger)] px-3 py-2 text-sm text-heading">
          Parental consent not recorded. Collect it before this student appears anywhere public.
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card label="Fees this cycle">
          {fees.data ? (
            <span className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-sm font-medium ${FEE_CLASS[fees.data.status]}`}
              >
                {FEE_LABEL[fees.data.status]}
              </span>
              {fees.data.balance > 0 && (
                <span className="text-sm text-body">₹{fees.data.balance} outstanding</span>
              )}
            </span>
          ) : (
            <span className="text-sm text-body">No fee plan</span>
          )}
        </Card>

        <Card label="Attendance this month">
          <span className="font-display text-2xl text-heading">
            {attendance.data === null ? "No classes yet" : `${attendance.data ?? "—"}%`}
          </span>
        </Card>

        <Card label="Login">
          <span className="text-sm text-heading">
            ID {s.loginId} · PIN {s.pin}
          </span>
          {s.accessSuspended && (
            <span className="mt-1 block text-sm text-body">Portal access suspended</span>
          )}
        </Card>
      </div>

      <Section title="Parent">
        <p className="text-sm text-heading">{s.parentName}</p>
        <a href={`tel:${s.parentPhone}`} className="focus-ring text-sm text-gold underline">
          {s.parentPhone}
        </a>
      </Section>

      <Section title="Recent payments">
        {payments.data && payments.data.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {payments.data.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span className="text-body">{format(parseISO(p.date), "d MMM yyyy")}</span>
                <span className="text-heading">
                  ₹{p.amount} · {p.mode.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-body">No payments recorded.</p>
        )}
      </Section>

      <Section title="Test marks">
        {marks.data && marks.data.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {marks.data.map((m) => (
              <li key={m.testId} className="flex justify-between">
                <span className="text-body">
                  {m.testName} · {m.subject}
                </span>
                <span className="text-heading">
                  {m.score}/{m.maxMarks}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-body">No tests recorded.</p>
        )}
      </Section>
    </div>
  );
}

function Card({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-panel p-4">
      <p className="text-sm text-body">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="font-display text-lg text-heading">{title}</h2>
      <div className="mt-2 rounded-lg border border-[color:var(--border)] bg-panel p-4">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it renders**

```bash
bun run dev
```

Check three students specifically, because each exercises a different branch:
- `/admin/students/s-01` — paid fees, an attendance percentage, no marks
- `/admin/students/s-10` — on break, attendance reads "No classes yet" (the null path)
- `/admin/students/s-15` — consent warning banner, concession applied

Stop the server.

- [ ] **Step 3: Verify types and lint**

Run: `bunx tsc --noEmit && bun run lint`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
bun run format
git add src/routes/admin/students/\$id.tsx src/routeTree.gen.ts
git commit -m "Add admin student profile"
```

---

### Task 10: Batches

**Files:**
- Create: `src/routes/admin/batches.tsx`

**Interfaces:**
- Consumes: `listBatches`, `listStudents` from `@/lib/crm/store`
- Produces: the `/admin/batches` route

- [ ] **Step 1: Create `src/routes/admin/batches.tsx`**

```tsx
import { useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listBatches, listStudents } from "@/lib/crm/store";
import type { Student } from "@/lib/crm/types";

export const Route = createFileRoute("/admin/batches")({ component: Batches });

function Batches() {
  const batches = useQuery({ queryKey: ["batches"], queryFn: listBatches });
  const students = useQuery({ queryKey: ["students"], queryFn: listStudents });

  const roster = useMemo(() => {
    const map = new Map<string, Student[]>();
    for (const s of students.data ?? []) {
      const list = map.get(s.batchId) ?? [];
      list.push(s);
      map.set(s.batchId, list);
    }
    return map;
  }, [students.data]);

  if (batches.isPending) return <p className="text-sm text-body">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-heading">Batches</h1>

      <div className="mt-4 space-y-4">
        {(batches.data ?? []).map((b) => {
          const members = roster.get(b.id) ?? [];
          return (
            <section
              key={b.id}
              className="rounded-lg border border-[color:var(--border)] bg-panel p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg text-heading">{b.name}</h2>
                <p className="text-sm text-body">
                  {b.classRange} · {b.days.join(", ")} · {b.startTime}–{b.endTime}
                </p>
              </div>

              <p className="mt-1 text-sm text-body">{b.subjects.join(" · ")}</p>

              <p className="mt-3 text-sm text-body">
                {members.length} {members.length === 1 ? "student" : "students"}
              </p>

              {members.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {members.map((s) => (
                    <li key={s.id}>
                      <Link
                        to="/admin/students/$id"
                        params={{ id: s.id }}
                        className="focus-ring inline-block rounded-full bg-page px-3 py-1 text-sm text-heading hover:bg-gold-fill hover:text-on-gold"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it renders**

```bash
bun run dev
```

Visit `/admin/batches` on the dev server URL. Expected: three batch cards with 4, 6 and 5 students; every name links through to its profile. Stop the server.

- [ ] **Step 3: Full gate**

Run: `bunx tsc --noEmit && bun run lint && bun run test && bun run build`
Expected: 0 type errors, 0 lint errors, 30 tests passing, build succeeds.

- [ ] **Step 4: Commit**

```bash
bun run format
git add src/routes/admin/batches.tsx src/routeTree.gen.ts
git commit -m "Add admin batches view with rosters"
```

---

## Done when

- `/admin`, `/admin/students`, `/admin/students/$id` and `/admin/batches` all render on the light palette, including for a visitor who has dark mode stored from the marketing site
- 30 unit tests pass across fees, attendance and material
- No file under `src/routes/admin/**` or `src/components/admin/**` imports from `src/data/crm/*`
- `src/routes/index.tsx`, `src/routes/v2.tsx` and `src/components/academy*/**` are untouched
- `bunx tsc --noEmit`, `bun run lint`, `bun run test` and `bun run build` all pass

## Deferred to later plans

Phases 3–7 from the spec: fee payment logging and the pending list, attendance marking, tests and marks entry, notices, vacation material, the whole student portal, and i18n. Supabase and real authentication follow those, and must land before any real student record is entered.
