import { memo } from "react";
import { ArrowLeft, X } from "lucide-react";

interface EyeTestHeaderProps {
  onBack: () => void;
  onClose: () => void;
}

export const EyeTestHeader = memo(function EyeTestHeader({ onBack, onClose }: EyeTestHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center relative">
        <button
          onClick={onBack}
          className="absolute left-4 sm:left-6 lg:left-8 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <span className="w-full text-center text-lg sm:text-xl font-bold text-[#05005B] tracking-tight">
          jachimuchi
        </span>

        <button
          onClick={onClose}
          className="absolute right-4 sm:right-6 lg:right-8 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
});

EyeTestHeader.displayName = "EyeTestHeader";
