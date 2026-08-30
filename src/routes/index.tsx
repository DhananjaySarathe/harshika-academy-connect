import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/academy/About";
import { Admission } from "@/components/academy/Admission";
import { Contact } from "@/components/academy/Contact";
import { Courses } from "@/components/academy/Courses";
import { Faculty } from "@/components/academy/Faculty";
import { Faq } from "@/components/academy/Faq";
import { FinalCta } from "@/components/academy/FinalCta";
import { FloatingActions } from "@/components/academy/FloatingActions";
import { Footer } from "@/components/academy/Footer";
import { Gallery } from "@/components/academy/Gallery";
import { Header } from "@/components/academy/Header";
import { Hero } from "@/components/academy/Hero";
import { Results } from "@/components/academy/Results";
import { ScrollProgress } from "@/components/academy/ScrollProgress";
import { Testimonials } from "@/components/academy/Testimonials";
import { TrustStrip } from "@/components/academy/TrustStrip";
import { academy, faqs, seo } from "@/data/content";

/**
 * LocalBusiness + EducationalOrganization, plus the FAQ block so the questions
 * can surface in search results. Kept in one @graph so the two business types
 * describe the same entity rather than two separate ones.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": "#harshika-academy",
      name: academy.name,
      description: seo.description,
      slogan: academy.tagline,
      telephone: academy.phoneE164,
      email: academy.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: academy.addressLine,
        addressLocality: academy.locality,
        addressRegion: academy.region,
        postalCode: academy.postalCode,
        addressCountry: academy.country,
      },
      areaServed: academy.city,
      openingHours: academy.openingHours,
      sameAs: academy.social.map((item) => item.href),
      employee: {
        "@type": "Person",
        name: "Mohit Sarathe",
        jobTitle: "Faculty Head",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      {
        name: "keywords",
        content: `coaching classes ${academy.city}, tuition ${academy.city}, CBSE coaching, Class 10 tuition, Class 12 tuition, ${academy.name}`,
      },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:site_name", content: academy.name },
      { property: "og:image", content: "/assets/og-cover.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: `${academy.name} — Mohit Sarathe, CTET-qualified faculty head`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seo.title },
      { name: "twitter:description", content: seo.description },
      { name: "twitter:image", content: "/assets/og-cover.jpg" },
      { name: "geo.placename", content: `${academy.locality}, ${academy.region}` },
      { name: "theme-color", content: "#FCFAF6" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
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
    </>
  );
}
