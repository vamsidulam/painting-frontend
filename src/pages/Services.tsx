import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Services } from "@/components/site/Services";
import texture from "@/assets/texture-1.jpg";

export default function ServicesPage() {
  useEffect(() => {
    document.title = "PaintBrush";
  }, []);

  return (
    <main className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${texture})` }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-background/80 backdrop-blur-[1px]"
      />
      <Navbar />
      <Services />
      <Footer />
    </main>
  );
}
