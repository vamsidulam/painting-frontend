import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { PaintTypes } from "@/components/site/PaintTypes";
import { Showcase } from "@/components/site/Showcase";
import { ExploreBeyond } from "@/components/site/ExploreBeyond";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Reviews } from "@/components/site/Reviews";
import { Projects } from "@/components/site/Projects";
import { Footer } from "@/components/site/Footer";
import { HomeWelcomeModal } from "@/components/site/HomeWelcomeModal";

export default function HomePage() {
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    document.title = "Brushly";
    const id = setTimeout(() => setWelcomeOpen(true), 600);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      
      <Services />
      <PaintTypes />
      <ExploreBeyond />

      <HorizontalScroll />
      <HowItWorks />
      <Showcase />
      <Projects />
      <Reviews />

      <Footer />

      <HomeWelcomeModal
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
      />
    </main>
  );
}
