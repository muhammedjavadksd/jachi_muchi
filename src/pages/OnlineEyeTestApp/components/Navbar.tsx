import { memo } from "react";
import { ArrowLeft, X } from "lucide-react";

interface NavbarProps {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  onClose: () => void;
  showBack?: boolean;
}

export const Navbar = memo(function Navbar({ step, totalSteps, onBack, onClose, showBack }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center relative">
        {showBack && onBack ? (
          <button onClick={onBack} className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500" aria-label="Go back">
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
        ) : <div className="absolute left-4 w-9 h-9" />}

        <div className="flex-1 text-center">
          <span className="font-bold text-[#05005B] text-base sm:text-lg tracking-tight">Online Eye Test</span>
          <span className="ml-2 text-xs sm:text-sm text-gray-400">Step {step} of {totalSteps}</span>
        </div>

        <button onClick={onClose} className="absolute right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500" aria-label="Close">
          <X size={20} strokeWidth={2} />
        </button>
      </div>
    </nav>
  );
});
