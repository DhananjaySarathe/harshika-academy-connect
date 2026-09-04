// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Nitro's default target here is `cloudflare-module`, which emits a Worker
 * bundle plus `.output/` — a layout Vercel cannot serve, which is why the
 * Vercel deployment returned 404. On Vercel we ask for the `vercel` preset
 * instead; it writes `.vercel/output` in Build Output API form, which Vercel
 * picks up with no project settings at all.
 *
 * Keyed off Vercel's own `VERCEL` env var rather than hardcoded, so:
 *   - Vercel builds target Vercel,
 *   - local `vite build` still emits `.output/` as the README describes,
 *   - anyone deploying to Cloudflare keeps the Worker build,
 *   - Lovable is unaffected either way (its sandbox forces `cloudflare-module`
 *     over whatever is set here).
 */
// tsconfig sets noPropertyAccessFromIndexSignature, hence the bracket access.
const nitro = process.env["VERCEL"] ? { preset: "vercel" } : undefined;

export default defineConfig({
  ...(nitro ? { nitro } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
