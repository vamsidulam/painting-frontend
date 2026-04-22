import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Building2, Briefcase, Wrench, Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Services } from "@/components/site/Services";

const services = [
  {
    icon: Home,
    title: "Interior Painting",
    desc: "Transform any room with premium low-VOC paints and a flawless finish.",
    price: "From $299",
    features: ["Color consultation", "Furniture protection", "2-coat application", "Cleanup included"],
    color: "from-primary to-primary-glow",
  },
  {
    icon: Building2,
    title: "Exterior Painting",
    desc: "Weather-resistant finishes that protect and beautify for years.",
    price: "From $899",
    features: ["Power wash & prep", "Premium exterior paint", "Trim & detail work", "5-year warranty"],
    color: "from-accent to-accent-glow",
  },
  {
    icon: Briefcase,
    title: "Commercial Painting",
    desc: "Offices, retail and industrial spaces — minimal downtime, maximum impact.",
    price: "Custom quote",
    features: ["After-hours work", "Brand color matching", "Large team capacity", "Insurance covered"],
    color: "from-primary-glow to-accent",
  },
  {
    icon: Wrench,
    title: "Wall Repair",
    desc: "Patch, sand, and prime damaged walls so your new paint looks perfect.",
    price: "From $99",
    features: ["Crack & hole repair", "Drywall patching", "Sanding & priming", "Texture matching"],
    color: "from-accent-glow to-primary",
  },
];

export default function ServicesPage() {
  useEffect(() => {
    document.title = "Services — Brushly";
  }, []);

  return (
    <main>
      <Navbar />
    

<Services/>
      
      <Footer />
    </main>
  );
}
