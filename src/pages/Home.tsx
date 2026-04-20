import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Reviews } from "@/components/site/Reviews";
import { Projects } from "@/components/site/Projects";
import { CTASection } from "@/components/site/CTASection";
import { Footer } from "@/components/site/Footer";

export default function HomePage() {
  useEffect(() => {
    document.title = "Brushly";
  }, []);

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Services />
      <HorizontalScroll />
      <HowItWorks />
      <Projects />
      <Reviews />
      
      <Footer />
    </main>
  );
}
