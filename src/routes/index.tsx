import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Reviews } from "@/components/site/Reviews";
import { Projects } from "@/components/site/Projects";
import { CTASection } from "@/components/site/CTASection";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brushly — Book Professional Painters Near You" },
      {
        name: "description",
        content: "Affordable, fast & trusted painting services. Get a free instant quote in 60 seconds and transform your space.",
      },
      { property: "og:title", content: "Brushly — Book Professional Painters Near You" },
      {
        property: "og:description",
        content: "Affordable, fast & trusted painting services. Free instant quote.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Services />
      <HorizontalScroll />
      <HowItWorks />
      <Projects />
      <Reviews />
      <CTASection />
      <Footer />
    </main>
  );
}
