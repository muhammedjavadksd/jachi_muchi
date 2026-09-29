import { memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND_LOGO_URL } from "@/shared/constants";
import { WhatsAppButton } from "@/shared/components/WhatsAppButton/WhatsAppButton";
import { SEO } from "@/shared/components/SEO/SEO";
import { seoMeta } from "@/shared/constants/seoMeta";

export const OnlineEyeTestPage = memo(function OnlineEyeTestPage(): JSX.Element {
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleProceedOnline = useCallback(() => {
    navigate("/online-eye-test/app");
  }, [navigate]);

  const handleBookHomeTest = useCallback(() => {
    navigate("/home-try-on");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO {...seoMeta.onlineEyeTest} />
      {/* White header bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-center relative">
          <img
            src={BRAND_LOGO_URL}
            alt="Jachi&Muchi"
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8 sm:mb-10">
            Jachi&Muchi Online Vision Screening
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

          {/*
            Scope note. This page used to be served MOI / driving-license meta,
            which misdescribed the page and contradicted the ad that lands here.
            The webcam screening is a self-assessment only — it is not a medical
            examination and it is not MOI-approved, so the page now says so and
            routes anyone who actually needs a licence test to the store page.
          */}
          <p className="mt-8 sm:mt-10 text-xs sm:text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
            This is a vision screening for self-assessment only. It is not a
            medical examination and it is not an MOI-approved test.
          </p>

          <p className="mt-3 text-sm sm:text-base text-gray-700 max-w-md mx-auto">
            Need an eye test for your driving license?{" "}
            <Link
              to="/moi-approved-eye-test-qatar"
              className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2"
            >
              Visit our store.
            </Link>
          </p>
        </div>
      </main>

      <WhatsAppButton />
    </div>
  );
});

OnlineEyeTestPage.displayName = "OnlineEyeTestPage";
