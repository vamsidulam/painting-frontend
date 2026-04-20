import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Building2, Briefcase, Wrench,
  Building, Castle, Store,
  MapPin, Upload, Check, ArrowRight, ArrowLeft, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Painter — Brushly" },
      { name: "description", content: "Book professional painters in 60 seconds. Get an instant quote and pick your date." },
      { property: "og:title", content: "Book a Painter — Brushly" },
      { property: "og:description", content: "Book professional painters in 60 seconds." },
    ],
  }),
  component: BookingPage,
});

const services = [
  { id: "interior", label: "Interior", icon: Home, base: 3 },
  { id: "exterior", label: "Exterior", icon: Building2, base: 5 },
  { id: "commercial", label: "Commercial", icon: Briefcase, base: 6 },
  { id: "repair", label: "Wall Repair", icon: Wrench, base: 2 },
];

const properties = [
  { id: "apartment", label: "Apartment", icon: Building },
  { id: "villa", label: "Villa", icon: Castle },
  { id: "office", label: "Office", icon: Store },
];

function BookingPage() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [property, setProperty] = useState<string | null>(null);
  const [area, setArea] = useState(800);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  const basePrice = services.find((s) => s.id === service)?.base ?? 3;
  const price = Math.round(area * basePrice + 199);
  const days = Math.max(1, Math.round(area / 400));

  const next = () => {
    if (step === 0 && !service) return toast.error("Pick a service");
    if (step === 1 && !property) return toast.error("Pick a property type");
    if (step === 3 && !location) return toast.error("Add a location");
    setStep((s) => Math.min(totalSteps - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list].slice(0, 6));
  };

  const confirm = () => {
    toast.success("Booking confirmed! We'll be in touch within an hour.", {
      description: `${service} • ${property} • $${price.toLocaleString()}`,
    });
  };

  return (
    <main className="min-h-screen bg-secondary/30">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Step {step + 1} of {totalSteps}
            </span>
            <h1 className="mt-2 font-display font-bold text-3xl md:text-4xl text-foreground">
              {step === 0 && "What do you need painted?"}
              {step === 1 && "Tell us about your property"}
              {step === 2 && "How much area?"}
              {step === 3 && "Project details"}
              {step === 4 && "Your instant quote"}
              {step === 5 && "All set!"}
            </h1>
          </div>

          <Progress value={progress} className="mb-10 h-2" />

          <div className="bg-card rounded-3xl p-8 md:p-10 shadow-soft border border-border min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setService(s.id)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 ${
                          service === s.id
                            ? "border-accent bg-accent/5 shadow-accent-glow"
                            : "border-border bg-background hover:border-primary/30"
                        }`}
                      >
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          service === s.id ? "gradient-accent" : "bg-muted"
                        }`}>
                          <s.icon className={`h-6 w-6 ${service === s.id ? "text-accent-foreground" : "text-foreground"}`} />
                        </div>
                        <div className="mt-4 font-semibold text-lg">{s.label}</div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {properties.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setProperty(p.id)}
                        className={`p-6 rounded-2xl border-2 text-center transition-all hover:-translate-y-1 ${
                          property === p.id
                            ? "border-accent bg-accent/5 shadow-accent-glow"
                            : "border-border bg-background hover:border-primary/30"
                        }`}
                      >
                        <p.icon className={`h-10 w-10 mx-auto ${property === p.id ? "text-accent" : "text-muted-foreground"}`} />
                        <div className="mt-3 font-semibold">{p.label}</div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="text-center">
                      <div className="font-display font-bold text-6xl text-gradient">{area}</div>
                      <div className="text-muted-foreground">sq ft</div>
                    </div>
                    <Slider
                      value={[area]}
                      min={100}
                      max={5000}
                      step={50}
                      onValueChange={(v) => setArea(v[0])}
                      className="mt-10"
                    />
                    <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                      <span>100 sq ft</span>
                      <span>5000 sq ft</span>
                    </div>
                    <Input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value) || 100)}
                      className="mt-8 rounded-xl text-center text-lg h-14"
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-accent" /> Location
                      </label>
                      <Input
                        placeholder="123 Main St, Brooklyn, NY"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="rounded-xl h-12"
                      />
                      <div className="mt-3 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border flex items-center justify-center text-muted-foreground text-sm">
                        <MapPin className="h-5 w-5 mr-2 text-accent" /> Map preview
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
                      <Textarea
                        placeholder="Tell us about colors, walls to paint, special requests..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">Photos (optional)</label>
                      <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer bg-muted/30">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">
                          Click or drag images here
                        </span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
                      </label>
                      {files.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {files.map((f, i) => (
                            <div key={i} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">
                              {f.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-1.5 text-sm font-medium">
                      <Sparkles className="h-4 w-4" /> Instant estimate
                    </div>
                    <div className="mt-6 font-display font-bold text-7xl text-gradient">
                      ${price.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground mt-2">All-in price • taxes included</div>

                    <div className="mt-8 grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-muted/50">
                        <div className="text-xs text-muted-foreground">Service</div>
                        <div className="font-semibold capitalize">{service}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/50">
                        <div className="text-xs text-muted-foreground">Property</div>
                        <div className="font-semibold capitalize">{property}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/50">
                        <div className="text-xs text-muted-foreground">Timeline</div>
                        <div className="font-semibold">{days} day{days > 1 ? "s" : ""}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="h-24 w-24 mx-auto rounded-full gradient-accent flex items-center justify-center shadow-accent-glow animate-pulse-glow">
                      <Check className="h-12 w-12 text-accent-foreground" />
                    </div>
                    <h3 className="mt-6 font-display font-bold text-3xl">Booking Confirmed!</h3>
                    <p className="mt-2 text-muted-foreground">
                      A specialist will call you within 1 hour to schedule.
                    </p>
                    <Link to="/dashboard">
                      <Button className="mt-8 rounded-xl gradient-primary text-primary-foreground shadow-glow">
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < 5 && (
            <div className="mt-6 flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={back}
                disabled={step === 0}
                className="rounded-xl h-12"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step === 4 ? (
                <Button
                  onClick={() => { confirm(); next(); }}
                  className="rounded-xl gradient-accent text-accent-foreground shadow-accent-glow h-12 px-8"
                >
                  Confirm Booking <Check className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={next}
                  className="rounded-xl gradient-primary text-primary-foreground shadow-glow h-12 px-8"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
