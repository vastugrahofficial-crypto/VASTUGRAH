import { useLocation } from "react-router-dom";

const PHONE = "+9311001071"; // country code + number, no "+", spaces or dashes
const MESSAGE = `Hello Vastugrah
I am interested in your Astrology and Vastu consultation services. Kindly share the details with me.`;
const WHATSAPP_URL = `https://wa.me/9311001071?text=${encodeURIComponent(MESSAGE)}`;

// Pages where the button should NOT appear. Add or remove paths as you like.
const HIDDEN_ON = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  // "/consultation/chat",
  // "/consultation/call",
  // "/ai-astrologer",
];

function WhatsAppLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.19-3.47-8.41ZM12.05 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.63-.24-.37a9.87 9.87 0 0 1-1.52-5.24c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.89-9.89 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

export default function FloatingWhatsApp() {
  const { pathname } = useLocation();

  // Hide on the listed pages (also handles a trailing slash, e.g. "/login/")
  const cleanPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (HIDDEN_ON.includes(cleanPath)) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
      <span className="relative">
        <WhatsAppLogo />
      </span>
    </a>
  );
}