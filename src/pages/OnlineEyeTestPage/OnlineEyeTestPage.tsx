import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND_LOGO_URL } from "../../lib/constants";
import { WhatsAppButton } from "../../components";

export const OnlineEyeTestPage = memo(function OnlineEyeTestPage(): JSX.Element {
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleProceedOnline = useCallback(() => {
    navigate("/online-eye-test/app");
  }, [navigate]);

  const handleBookHomeTest = useCallback(() => {
    navigate("/home-eye-test");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* White header bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-center relative">
          <img
            src={BRAND_LOGO_URL}
            alt="Lenskart"
            className="h-8 sm:h-10"
          />
          <button
            onClick={handleClose}
            className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L2 16M2 2L16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
        <div className="w-full max-w-lg mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-10 sm:mb-12 lg:mb-14">
            Lenskart Online Vision Screening
          </h1>

          <div className="flex flex-col items-center gap-4 sm:gap-5">
            <button
              onClick={handleProceedOnline}
              className="w-full max-w-md py-3.5 sm:py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm sm:text-base transition-colors"
            >
              Proceed with online eye test
            </button>

            <div className="flex items-center gap-4 w-full max-w-md">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <button
              onClick={handleBookHomeTest}
              className="w-full max-w-md py-3.5 sm:py-4 px-6 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white text-sm sm:text-base transition-colors"
            >
              Book home eye test
            </button>
          </div>
        </div>
      </main>

      <WhatsAppButton />
    </div>
  );
});

OnlineEyeTestPage.displayName = "OnlineEyeTestPage";
