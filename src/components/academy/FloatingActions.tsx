import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/data/content";
import { onViewportChange, useReducedMotion } from "@/hooks/use-motion";

/**
 * The always-on pair, bottom-right: the WhatsApp chat button and back-to-top.
 * Both lift above the enquiry form's submit button while the contact section
 * is on screen, so they never sit on top of it on a phone.
 */
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [overContact, setOverContact] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(
    () =>
      onViewportChange(() => {
        setShowTop(window.scrollY > 600);

        const contact = document.getElementById("contact");
        if (!contact) return;
        const box = contact.getBoundingClientRect();
        setOverContact(box.top < window.innerHeight && box.bottom > 0);
      }),
    [],
  );

  const toTop = () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });

  return (
    <div
      className={cn(
        "fixed right-4 z-[80] flex flex-col items-end gap-3 transition-[bottom] duration-300 sm:right-6",
        overContact ? "bottom-24 sm:bottom-6" : "bottom-4 sm:bottom-6",
      )}
    >
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className={cn(
          "focus-ring grid size-11 place-items-center rounded-full border border-gold/30 bg-page/90 text-gold shadow-lg backdrop-blur transition-all duration-300 hover:border-gold hover:bg-gold-fill hover:text-on-gold",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowUp className="size-5" aria-hidden="true" />
      </button>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Chat with us on WhatsApp"
        className="focus-ring group relative grid h-14 items-center overflow-hidden rounded-full bg-[#25D366] text-white elevate-md transition-[width] duration-300"
      >
        {/* Pulse ring — purely decorative, and stilled under reduced motion. */}
        <span
          aria-hidden="true"
          className="pulse-ring absolute inset-0 rounded-full border-2 border-[#25D366]"
        />
        <span className="relative flex h-14 items-center gap-3 pl-4 pr-4 md:pr-0 md:transition-[padding] md:duration-300 md:group-hover:pr-5">
          <WhatsAppGlyph />
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap font-utility text-sm font-semibold opacity-0 transition-all duration-300 md:inline md:group-hover:max-w-[10rem] md:group-hover:opacity-100">
            Chat with us
          </span>
        </span>
      </a>
    </div>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 fill-current" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.07 2.86 1.22 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.35-1.4a9.83 9.83 0 0 0 4.69 1.19h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.02-5.11-2.88-6.97A9.79 9.79 0 0 0 12.04 2Zm0 17.98h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.86 5.8 2.41a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.19-8.2 8.19Z" />
    </svg>
  );
}
