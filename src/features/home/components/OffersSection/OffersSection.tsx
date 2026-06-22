import { memo, useState, useEffect, useCallback, useRef } from "react";
import { getActiveOffers } from "@/features/offer/services/offerService";
import type { Offer } from "@/features/offer/types";
import { OfferCard } from "@/features/offer/components/OfferCard/OfferCard";

function ShimmerSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row-reverse min-h-[320px] animate-pulse">
      <div className="md:w-[280px] lg:w-[320px] h-52 md:h-auto shrink-0 bg-gray-200" />
      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center gap-3">
        <div className="w-24 h-6 bg-gray-200 rounded-full" />
        <div className="w-3/4 h-7 bg-gray-200 rounded-lg" />
        <div className="w-full h-4 bg-gray-200 rounded" />
        <div className="w-2/3 h-4 bg-gray-200 rounded" />
        <div className="flex gap-2 mt-2">
          <div className="w-32 h-8 bg-gray-200 rounded-xl" />
          <div className="w-24 h-8 bg-gray-200 rounded-xl" />
        </div>
        <div className="w-36 h-6 bg-gray-200 rounded mt-2" />
        <div className="w-28 h-10 bg-gray-200 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export const OffersSection = memo(function OffersSection(): JSX.Element {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getActiveOffers();
      setOffers(data);
      setCurrentSlide(0);
    } catch (err: any) {
      setError(err.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  useEffect(() => {
    if (loading || error || offers.length <= 1 || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading, error, offers.length, isPaused]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  return (
    <section className="relative py-14 md:py-20 bg-white overflow-hidden">

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8">
        {loading && (
          <div className="max-w-[900px] mx-auto space-y-4">
            <ShimmerSkeleton />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-6 py-3 rounded-xl">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={loadOffers} className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && offers.length > 0 && (
          <div
            className="relative max-w-[900px] mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-black/5 border border-gray-100">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {offers.map((offer) => (
                  <div key={offer._id} className="min-w-full">
                    <OfferCard offer={offer} />
                  </div>
                ))}
              </div>
            </div>

            {offers.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all duration-200 z-10 group"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all duration-200 z-10 group"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}

            {offers.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                {offers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="relative group"
                  >
                    <div
                      className={`transition-all duration-500 rounded-full ${
                        index === currentSlide
                          ? "w-10 h-2.5 bg-teal-600"
                          : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && offers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No offers available right now</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for exciting deals!</p>
          </div>
        )}
      </div>
    </section>
  );
});

OffersSection.displayName = "OffersSection";

