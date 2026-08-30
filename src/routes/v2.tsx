import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/academy-v2/About";
import { Admission } from "@/components/academy-v2/Admission";
import { Contact } from "@/components/academy-v2/Contact";
import { Courses } from "@/components/academy-v2/Courses";
import { Faculty } from "@/components/academy-v2/Faculty";
import { Faq } from "@/components/academy-v2/Faq";
import { FinalCta } from "@/components/academy-v2/FinalCta";
import { FloatingActions } from "@/components/academy-v2/FloatingActions";
import { Footer } from "@/components/academy-v2/Footer";
import { Gallery } from "@/components/academy-v2/Gallery";
import { Header } from "@/components/academy-v2/Header";
import { Hero } from "@/components/academy-v2/Hero";
import { Results } from "@/components/academy-v2/Results";
import { ScrollProgress } from "@/components/academy-v2/ScrollProgress";
import { Testimonials } from "@/components/academy-v2/Testimonials";
import { TrustStrip } from "@/components/academy-v2/TrustStrip";
import { seo } from "@/data/content";

/**
 * /v2 — the same page and the same interactions as "/", rendered in the
 * readable QuickAds theme: warm cream canvas, ink type scale, lime reserved
 * for primary CTAs. Both routes read the same src/data/content.ts, so editing
 * content updates them together.
 *
 * Not indexed: it is an alternate presentation of the same content, and two
 * indexable copies would compete with each other in search.
 */
export const Route = createFileRoute("/v2")({
  head: () => ({
    meta: [
      { title: `${seo.title} — readable theme` },
      { name: "description", content: seo.description },
      { name: "robots", content: "noindex, follow" },
      { name: "theme-color", content: "#F7F3EF" },
    ],
  }),
  component: HomePageV2,
});

function HomePageV2() {
  return (
    // theme-paper flips the page background off the dark default (see styles.css).
    <div className="theme-paper min-h-screen bg-canvas text-ink-2 antialiased">
      <ScrollProgress />
      <Header />

      <main>
        <Hero />
        <TrustStrip />
        <About />
        <Courses />
        <Faculty />
        <Admission />
        <Results />
        <Gallery />
        <Testimonials />
        <Faq />
        <Contact />
        <FinalCta />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
