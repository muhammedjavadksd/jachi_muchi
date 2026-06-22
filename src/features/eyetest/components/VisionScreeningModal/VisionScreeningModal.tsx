import { memo, useEffect, useCallback, useRef } from "react";
import { BRAND_LOGO_URL } from "@/shared/constants";

interface VisionScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedOnline: () => void;
  onBookHomeTest: () => void;
}

export const VisionScreeningModal = memo(function VisionScreeningModal({
  isOpen,
  onClose,
  onProceedOnline,
  onBookHomeTest,
}: VisionScreeningModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        const firstButton = modalRef.current?.querySelector<HTMLElement>("button");
        firstButton?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vision-screening-heading"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 animate-fadeScale"
        style={{ animation: "fadeScale 0.25s ease-out" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src={BRAND_LOGO_URL}
            alt="Jachi&Muchi"
            className="h-10 sm:h-12 mb-6"
          />

          <h1
            id="vision-screening-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-8"
          >
            Jachi&Muchi Online Vision Screening
          </h1>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={onProceedOnline}
              className="w-full py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base"
            >
              Proceed with online eye test
            </button>
            <button
              onClick={onBookHomeTest}
              className="w-full py-3 px-6 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-colors text-sm sm:text-base"
            >
              Book home eye test
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeScale {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
});

VisionScreeningModal.displayName = "VisionScreeningModal";
