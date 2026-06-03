import { memo, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sun } from "lucide-react";
import { BRAND_LOGO_URL } from "../../lib/constants";
import { WhatsAppButton } from "../../components";

export const BrightnessSetupPage = memo(function BrightnessSetupPage(): JSX.Element {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const directionRef = useRef(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const step = 1.2;
        const next = prev + step * directionRef.current;
        if (next >= 100) {
          directionRef.current = -1;
          return 100;
        }
        if (next <= 0) {
          directionRef.current = 1;
          return 0;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    navigate("/online-eye-test/device-check");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] animate-fadeIn">
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pulseScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .animate-fadeIn { animation: fadeIn 0.35s ease-out; }
        .animate-pulseScale { animation: pulseScale 2.5s ease-in-out infinite; }
        .btn-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .btn-lift:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      `}</style>

      {/* White header bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-center relative">
          <img src={BRAND_LOGO_URL} alt="Lenskart" className="h-8 sm:h-10" />
          <button
            onClick={() => navigate(-1)}
            className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          {/* Brightness icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl flex items-center justify-center mb-10 sm:mb-12 animate-pulseScale">
            <Sun size={32} strokeWidth={1.5} className="text-[#1a2a3a] sm:w-[38px] sm:h-[38px]" />
          </div>

          {/* Slider */}
          <div className="w-full max-w-xs sm:max-w-sm relative mb-8 sm:mb-10">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#1a2a3a] rounded-full transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Slider thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#1a2a3a] rounded-full shadow-sm transition-none"
              style={{ left: `calc(${progress}% - 10px)` }}
            />
          </div>

          {/* Text section */}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2a3a] mb-3 text-center">
            Brightness
          </h2>
          <p className="text-sm sm:text-base text-gray-500 text-center max-w-xs leading-relaxed mb-12 sm:mb-16">
            For the most accurate results, turn your screen brightness to max
          </p>

          {/* Indicator dots */}
          <div className="flex items-center gap-2 mb-8 sm:mb-10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a2a3a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          </div>

          {/* Next step button */}
          <button
            onClick={handleNext}
            className="w-full max-w-xs sm:max-w-sm py-3.5 sm:py-4 px-6 bg-[#1a2a3a] hover:bg-[#2a3a4a] text-white font-semibold rounded-xl text-sm sm:text-base transition-colors btn-lift"
          >
            Next step
          </button>
        </div>
      </main>

      <WhatsAppButton />
    </div>
  );
});

BrightnessSetupPage.displayName = "BrightnessSetupPage";
