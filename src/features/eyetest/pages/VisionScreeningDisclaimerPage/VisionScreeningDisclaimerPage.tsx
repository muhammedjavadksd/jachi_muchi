import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { BRAND_LOGO_URL } from "@/shared/constants";
import { WhatsAppButton } from "@/shared/components/WhatsAppButton/WhatsAppButton";

export const VisionScreeningDisclaimerPage = memo(function VisionScreeningDisclaimerPage(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] animate-fadeIn">
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.35s ease-out; }
      `}</style>

      {/* White header bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-center relative">
          <img src={BRAND_LOGO_URL} alt="Jachi&Muchi" className="h-8 sm:h-10" />
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
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <div className="w-full max-w-lg">
          <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-[#1a2a3a] leading-tight mb-5 sm:mb-6">
            Please read and accept before you start.
          </h1>

          <p className="text-[15px] sm:text-base text-[#6b7280] leading-relaxed mb-3">
            This online vision screening test is for preliminary self-assessment purposes only and does not replace a comprehensive eye examination by a licensed optometrist or ophthalmologist. The results provided are not a medical diagnosis. If you experience any vision problems, eye discomfort, or have concerns about your eye health, please consult a qualified eye care professional. By proceeding, you acknowledge that this screening is not a substitute for a professional eye exam.
          </p>

          <p className="text-[15px] sm:text-base text-[#9ca3af] leading-relaxed mb-8 sm:mb-10">
            Make sure your zoom is 100% for accurate results.
          </p>

          <button
            onClick={() => navigate("/online-eye-test/instructions")}
            className="w-full py-3.5 sm:py-4 px-6 bg-[#1a2a3a] hover:bg-[#2a3a4a] text-white font-semibold rounded-xl text-sm sm:text-base transition-colors"
          >
            I agree
          </button>
        </div>
      </main>

      <WhatsAppButton />
    </div>
  );
});

VisionScreeningDisclaimerPage.displayName = "VisionScreeningDisclaimerPage";
