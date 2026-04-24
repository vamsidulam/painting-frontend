const WHATSAPP_NUMBER = "917899615463";
const DEFAULT_MESSAGE = "Hi, I'm interested in your painting services.";

type Props = {
  phone?: string;
  message?: string;
  side?: "left" | "right";
};

export function FloatingWhatsApp({
  phone = WHATSAPP_NUMBER,
  message = DEFAULT_MESSAGE,
  side = "right",
}: Props) {
  const href = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  const positionClass = side === "left" ? "left-5" : "right-5";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-5 ${positionClass} z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] hover:shadow-[0_12px_36px_-8px_rgba(37,211,102,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 grid place-items-center`}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="relative h-7 w-7"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.93 11.93 0 0012.04 0C5.48 0 .12 5.36.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.64a11.9 11.9 0 005.76 1.46h.01c6.56 0 11.92-5.36 11.92-11.92 0-3.18-1.24-6.18-3.45-8.42zM12.04 21.8h-.01a9.88 9.88 0 01-5.04-1.38l-.36-.21-3.72.97.99-3.62-.23-.37A9.88 9.88 0 012.1 11.92c0-5.46 4.47-9.92 9.94-9.92 2.65 0 5.14 1.03 7.01 2.91a9.84 9.84 0 012.9 7.01c0 5.47-4.45 9.88-9.91 9.88zm5.44-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.07 4.49.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.08-.12-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
