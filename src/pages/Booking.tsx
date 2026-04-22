import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CategoryStep,
  ServiceStep,
  PropertyStep,
  LocationStep,
  SummaryStep,
  PaymentStep,
  EMPTY_ADDRESS,
  type BookingAddress,
  type BookingService,
  type PropertyType,
  type ServiceCategory,
} from "@/components/site/booking";

const STEPS = [
  {
    title: "What type of service?",
    subtitle: "Pick interior or exterior to continue.",
  },
  {
    title: "Choose a service",
    subtitle: "Select the service that fits your project.",
  },
  {
    title: "Tell us about your property",
    subtitle: "Which type of space are we painting?",
  },
  {
    title: "Location & area",
    subtitle: "Where is it, and how big is the space?",
  },
  {
    title: "Review your estimate",
    subtitle: "Confirm the details before continuing to payment.",
  },
  {
    title: "Payment",
    subtitle: "Scan, pay, then upload your screenshot to submit.",
  },
];

const TOTAL_STEPS = STEPS.length;

export default function BookingPage() {
  useEffect(() => {
    document.title = "Book a Service — Brushly";
  }, []);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [service, setService] = useState<BookingService | null>(null);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [sqft, setSqft] = useState("");
  const [address, setAddress] = useState<BookingAddress>(EMPTY_ADDRESS);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const current = STEPS[step];
  const sqftNumber = Number(sqft) || 0;
  const total = service ? sqftNumber * service.cost : 0;

  const handleCategoryChange = (next: ServiceCategory) => {
    if (next !== category) setService(null);
    setCategory(next);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const goNext = () => {
    if (step === 0 && !category) {
      toast.error("Please choose a category");
      return;
    }
    if (step === 1 && !service) {
      toast.error("Please choose a service");
      return;
    }
    if (step === 2 && !propertyType) {
      toast.error("Please choose a property type");
      return;
    }
    if (step === 3) {
      if (!sqft || sqftNumber <= 0) {
        toast.error("Enter a valid area in sqft");
        return;
      }
      const missing = (Object.keys(address) as (keyof BookingAddress)[]).filter(
        (k) => !address[k].trim(),
      );
      if (missing.length) {
        toast.error("Please fill all address fields");
        return;
      }
      if (!/^\d{6}$/.test(address.pincode)) {
        toast.error("Pincode must be exactly 6 digits");
        return;
      }
    }

    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };

  const resetBooking = () => {
    setStep(0);
    setSubmitted(false);
    setCategory(null);
    setService(null);
    setPropertyType(null);
    setSqft("");
    setAddress(EMPTY_ADDRESS);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-secondary/30">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-soft text-center"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h1 className="mt-6 font-display font-bold text-3xl md:text-4xl text-foreground">
                Booking submitted!
              </h1>
              <p className="mt-3 text-muted-foreground">
                We've received your request and will verify your payment
                shortly. You'll hear from our team soon on the phone number you
                provided.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl px-6"
                >
                  <Link to="/">Back to home</Link>
                </Button>
                <Button
                  type="button"
                  onClick={resetBooking}
                  className="h-11 rounded-xl px-6 font-semibold"
                >
                  Book another service
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/30">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <h1 className="mt-2 font-display font-bold text-3xl md:text-4xl text-foreground">
              {current.title}
            </h1>
            <p className="mt-2 text-muted-foreground">{current.subtitle}</p>
          </div>

          <Progress value={progress} className="mb-8 h-2" />

          <div className="bg-card rounded-3xl p-6 md:p-10 shadow-soft border border-border min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <CategoryStep
                    value={category}
                    onChange={handleCategoryChange}
                  />
                )}

                {step === 1 &&
                  (category ? (
                    <ServiceStep
                      category={category}
                      value={service}
                      onChange={setService}
                    />
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      Please go back and choose a category first.
                    </div>
                  ))}

                {step === 2 && (
                  <PropertyStep
                    value={propertyType}
                    onChange={setPropertyType}
                  />
                )}

                {step === 3 && (
                  <LocationStep
                    sqft={sqft}
                    onSqftChange={setSqft}
                    address={address}
                    onAddressChange={setAddress}
                  />
                )}

                {step === 4 && category && service && propertyType && (
                  <SummaryStep
                    category={category}
                    service={service}
                    propertyType={propertyType}
                    sqft={sqftNumber}
                    address={address}
                  />
                )}

                {step === 5 && category && service && propertyType && (
                  <PaymentStep
                    category={category}
                    service={service}
                    propertyType={propertyType}
                    sqft={sqftNumber}
                    address={address}
                    total={total}
                    onSubmitted={() => setSubmitted(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={step === 0}
              className="rounded-xl h-12"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < TOTAL_STEPS - 1 && (
              <Button
                type="button"
                onClick={goNext}
                className="rounded-xl h-12 px-8 font-semibold"
              >
                {step === TOTAL_STEPS - 2 ? "Continue to payment" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
