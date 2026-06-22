import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStoreCount } from "@/features/store/api/storeApi";

export const EyeCheckupFeatures: React.FC = () => {
  const [storeCount, setStoreCount] = useState<number | null>(null);

  useEffect(() => {
    getStoreCount().then(setStoreCount).catch(() => setStoreCount(null));
  }, []);

  return (
    <section className="w-full bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Get a FREE Eye Check Up</h2>
            <p className="text-gray-600 mt-1">Visit our stores for expert eye testing and personalized vision care.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/stores"
            className="group block rounded-3xl overflow-hidden relative bg-white border border-gray-100 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1"
            aria-label="Visit Your Nearest Store"
          >
            <div className="relative h-56 md:h-64 w-full overflow-hidden">
              <img
                src="https://static5.lenskart.com/media/uploads/Store-Eye-Test-5X6desktop-18-12.png"
                alt="Visit Your Nearest Store"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow">Visit Your Nearest Store</h3>
                  <p className="mt-2 text-sm text-white/90">
                    {storeCount !== null
                      ? `Explore our ${storeCount}+ stores for a free eye test.`
                      : "Book a free eye test at our premium stores."}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <span className="inline-flex rounded-full bg-white text-teal-700 px-4 py-2 font-semibold hover:bg-white/90">Explore Stores</span>
              </div>
            </div>
          </Link>

          <div className="group block rounded-3xl overflow-hidden relative bg-white border border-gray-100 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1">
            <div className="relative h-56 md:h-64 w-full overflow-hidden">
              <img
                src="https://placehold.co/1200x800?text=Schedule+Eye+Test+at+Home"
                alt="Schedule Eye Test at Home"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow">Schedule Eye Test at Home</h3>
                  <p className="mt-2 text-sm text-white/90">Our experts will visit your home for eye testing.</p>
                </div>
                <div className="ml-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12h18" />
                      <path d="M12 3v18" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button disabled aria-disabled className="inline-flex items-center rounded-full bg-white/10 text-white px-4 py-2 font-semibold opacity-90 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EyeCheckupFeatures;
