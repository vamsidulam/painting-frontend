import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CategoryStep,
  WorkTypeStep,
  ServiceStep,
  PropertyStep,
  LocationStep,
  SummaryStep,
  PaymentStep,
  BookSlotModal,
  EMPTY_ADDRESS,
  type BookingAddress,
  type BookingService,
  type PropertyType,
  type ServiceCategory,
  type WorkType,
} from "@/components/site/booking";

const STEPS = [
  {
    title: "What type of service?",
    subtitle: "Pick a category to continue.",
  },
  {
    title: "Fresh painting or repainting?",
    subtitle: "Choose the kind of work you need.",
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
    subtitle: "Book your slot now or pay ahead — your choice.",
  },
  {
    title: "Payment",
    subtitle: "Scan, pay, then upload your screenshot.",
  },
];

const TOTAL_STEPS = STEPS.length;

type SavedCustomer = { name: string; email: string; phone: string };

type BookingPrefill = {
  category: ServiceCategory;
  workType: WorkType;
  service: BookingService;
};

export default function BookingPage() {
  useEffect(() => {
    document.title = "PaintBrush";
  }, []);

  const location = useLocation();
  const prefill =
    (location.state as { prefill?: BookingPrefill } | null)?.prefill ?? null;

  const [step, setStep] = useState(prefill ? 3 : 0);
  const [submitted, setSubmitted] = useState(false);

  const [category, setCategory] = useState<ServiceCategory | null>(
    prefill?.category ?? null,
  );
  const [workType, setWorkType] = useState<WorkType | null>(
    prefill?.workType ?? null,
  );
  const [service, setService] = useState<BookingService | null>(
    prefill?.service ?? null,
  );
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [sqft, setSqft] = useState("");
  const [address, setAddress] = useState<BookingAddress>(EMPTY_ADDRESS);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [savedCustomer, setSavedCustomer] = useState<SavedCustomer | null>(
    null,
  );
  const [bookSlotOpen, setBookSlotOpen] = useState(false);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const current = STEPS[step];
  const sqftNumber = Number(sqft) || 0;
  const includesMoney =
    (category?.includesMoney ?? service?.categoryIncludesMoney ?? true) !==
    false;
  const total = includesMoney && service ? sqftNumber * service.cost : 0;

  const goNextStep = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const handleCategoryChange = (next: ServiceCategory) => {
    if (category?.id !== next.id) {
      setService(null);
    }
    setCategory(next);
    setOrderId(null);
    goNextStep();
  };

  const handleWorkTypeChange = (next: WorkType) => {
    if (workType !== next) setService(null);
    setWorkType(next);
    setOrderId(null);
    goNextStep();
  };

  const handleServiceChange = (next: BookingService) => {
    setService(next);
    setOrderId(null);
    goNextStep();
  };

  const handlePropertyChange = (next: PropertyType) => {
    setPropertyType(next);
    setOrderId(null);
    goNextStep();
  };

  const handleContinue = () => {
    if (step === 4) {
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
      goNextStep();
      return;
    }
    goNextStep();
  };

  const resetBooking = () => {
    setStep(0);
    setSubmitted(false);
    setCategory(null);
    setWorkType(null);
    setService(null);
    setPropertyType(null);
    setSqft("");
    setAddress(EMPTY_ADDRESS);
    setOrderId(null);
    setSavedCustomer(null);
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

  const isAutoStep = step === 0 || step === 1 || step === 2 || step === 3;
  const showContinueButton = step === 4;
  const isSlotBookedView = step === 5 && orderId !== null;
  const showBackButton = step > 0 && !isSlotBookedView;

  return (
    <main className="min-h-screen bg-secondary/30">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-6">
            <span className="text-primary font-semibold text-xs uppercase tracking-wider">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <h1 className="mt-1.5 font-display font-bold text-2xl md:text-3xl text-foreground">
              {current.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {current.subtitle}
            </p>
          </div>

          <Progress value={progress} className="mb-6 h-2" />

          <div className="relative bg-card rounded-2xl p-5 md:p-8 shadow-soft border border-border min-h-80">
            {showBackButton && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="absolute top-3 left-3 h-8 px-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
              </Button>
            )}
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
                    <WorkTypeStep
                      value={workType}
                      onChange={handleWorkTypeChange}
                    />
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      Please go back and choose a category first.
                    </div>
                  ))}

                {step === 2 &&
                  (category && workType ? (
                    <ServiceStep
                      category={category}
                      workType={workType}
                      value={service}
                      onChange={handleServiceChange}
                    />
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      Please go back and complete the previous steps.
                    </div>
                  ))}

                {step === 3 && (
                  <PropertyStep
                    value={propertyType}
                    onChange={handlePropertyChange}
                  />
                )}

                {step === 4 && (
                  <LocationStep
                    sqft={sqft}
                    onSqftChange={setSqft}
                    address={address}
                    onAddressChange={setAddress}
                  />
                )}

                {step === 5 &&
                  category &&
                  service &&
                  workType &&
                  propertyType && (
                    <SummaryStep
                      category={category}
                      service={service}
                      workType={workType}
                      propertyType={propertyType}
                      sqft={sqftNumber}
                      address={address}
                      orderId={orderId}
                      includesMoney={includesMoney}
                      onBookSlot={() => setBookSlotOpen(true)}
                      onPayNow={() => goNextStep()}
                      onContinuePayment={() => goNextStep()}
                      onFinish={() => setSubmitted(true)}
                    />
                  )}

                {step === 6 && category && service && propertyType && (
                  <PaymentStep
                    category={category}
                    service={service}
                    propertyType={propertyType}
                    sqft={sqftNumber}
                    address={address}
                    total={total}
                    orderId={orderId}
                    initialCustomer={savedCustomer}
                    onSubmitted={() => setSubmitted(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            {isAutoStep && (
              <div className="text-xs text-muted-foreground self-center">
                Tap an option to continue
              </div>
            )}
            {showContinueButton && (
              <Button
                type="button"
                onClick={handleContinue}
                className="rounded-xl h-11 px-6 font-semibold"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {category && service && workType && propertyType && (
        <BookSlotModal
          open={bookSlotOpen}
          onOpenChange={setBookSlotOpen}
          category={category}
          service={service}
          propertyType={propertyType}
          sqft={sqftNumber}
          total={total}
          address={address}
          onConfirmed={(id, customer) => {
            setOrderId(id);
            setSavedCustomer(customer);
          }}
        />
      )}
    </main>
  );
}
