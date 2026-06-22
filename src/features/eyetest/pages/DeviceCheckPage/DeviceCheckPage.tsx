import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeTestHeader } from "@/features/eyetest/components/EyeTestHeader/EyeTestHeader";
import { EyeTestProgressDots } from "@/features/eyetest/components/EyeTestProgressDots/EyeTestProgressDots";
import { EyeTestIconIllustration } from "@/features/eyetest/components/EyeTestIconIllustration/EyeTestIconIllustration";
import { WhatsAppButton } from "@/shared/components/WhatsAppButton/WhatsAppButton";

export const DeviceCheckPage = memo(function DeviceCheckPage(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] animate-fadeIn">
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.35s ease-out; }
        .animate-slideUp { animation: slideUp 0.45s ease-out; }
      `}</style>

      <EyeTestHeader
        onBack={() => navigate(-1)}
        onClose={() => navigate("/")}
      />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center animate-slideUp">
          {/* Icon illustration */}
          <div className="mb-10 sm:mb-12">
            <EyeTestIconIllustration />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#05005B] text-center mb-3">
            Wear Your Eyewear
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-500 text-center max-w-xs leading-relaxed mb-12 sm:mb-16">
            Please wear your glasses or contacts (if applicable)
          </p>

          {/* Progress dots */}
          <div className="mb-8 sm:mb-10">
            <EyeTestProgressDots total={5} active={1} />
          </div>

          {/* CTA button */}
          <button
            onClick={() => navigate("/online-eye-test/app")}
            className="w-full max-w-[520px] py-3.5 sm:py-4 px-6 bg-[#05005B] hover:bg-[#0a0a7a] text-white font-semibold rounded-xl text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            Next step
          </button>
        </div>
      </main>

      <WhatsAppButton />
    </div>
  );
});

DeviceCheckPage.displayName = "DeviceCheckPage";
