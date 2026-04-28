import { Phone } from "lucide-react";

const PHONE_NUMBER = "917899615463";

type Props = {
  phone?: string;
  side?: "left" | "right";
};

export function FloatingPhone({ phone = PHONE_NUMBER, side = "right" }: Props) {
  const href = `tel:+${phone.replace(/\D/g, "")}`;
  const positionClass = side === "left" ? "left-5" : "right-5";

  return (
    <a
      href={href}
      aria-label="Call us"
      className={`fixed bottom-24 ${positionClass} z-50 h-14 w-14 rounded-full bg-blue-600 text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] hover:shadow-[0_12px_36px_-8px_rgba(37,99,235,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 grid place-items-center`}
    >
      <span className="absolute inset-0 rounded-full bg-blue-600 opacity-60 animate-ping" />
      <Phone className="relative h-6 w-6" aria-hidden="true" />
    </a>
  );
}
