import { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { PromotionHeader, LoadingSkeleton, Footer, WhatsAppButton, BottomNav } from "./components";
import { NavTab } from "./components/BottomNav/BottomNav";
import { HEADER_SPACER_HEIGHT, EXCLUSIVE_ITEMS, PREMIUM_EYEWEAR, FREE_CHECKUP } from "./lib/constants";
import { TopCategories } from "./components/TopCategories/TopCategories";
import { api } from "./api/axios";
import { getBanners } from "./api/banner";
import { OffersSection } from "./components/OffersSection/OffersSection";

/** Lazy loaded components */
const HeroSlider = lazy(() => import("./components/HeroSlider/HeroSlider").then(m => ({ default: m.HeroSlider })));
const SecondaryBannerCarousel = lazy(() => import("./components/SecondaryBannerCarousel/SecondaryBannerCarousel").then(m => ({ default: m.SecondaryBannerCarousel })));
const Campaign = lazy(() => import("./components/Campaign/Campaign").then(m => ({ default: m.Campaign })));
const ShapeSection = lazy(() => import("./components/ShapeSection/ShapeSection").then(m => ({ default: m.ShapeSection })));
const NearbyServices = lazy(() => import("./components/NearbyServices/NearbyServices").then(m => ({ default: m.NearbyServices })));
const GridSection = lazy(() => import("./components/GridSection/GridSection").then(m => ({ default: m.GridSection })));
const FeaturedGrid = lazy(() => import("./components/FeaturedGrid/FeaturedGrid").then(m => ({ default: m.FeaturedGrid })));

export default function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [orderCount] = useState(2);
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);
  const [categories, setCategories] = useState<any[]>([]);

  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [promoBanners, setPromoBanners] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        setCategories(res.data?.data?.categories || []);
      })
      .catch(() => setCategories([]));

    // --- FETCH BANNERS ---
    getBanners().then((allBanners) => {
      // Filter out inactive banners
      const activeBanners = allBanners.filter((b: any) => b.isActive);

      // Separate them by type and sort by position
      const homepage = activeBanners
        .filter((b: any) => b.type === "homepage")
        .sort((a: any, b: any) => a.position - b.position);

      const promotional = activeBanners
        .filter((b: any) => b.type === "promotional")
        .sort((a: any, b: any) => a.position - b.position);

      setHeroBanners(homepage);
      setPromoBanners(promotional);
    });

    // --- FETCH COLLECTIONS ---
    getCollections()
      .then((cols) => {
        setCollections(cols || []);
      })
      .catch(() => setCollections([]));
  }, []);

  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        setCategories(res.data?.data?.categories || []);
      })
      .catch(() => setCategories([]));
  }, []);

  // Fake countdown for Hustlr Club (like in screenshot)
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 8, minutes: 51, seconds: 44 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col bg-white min-h-screen font-sans">
      {/* Promotion Header */}
      <PromotionHeader />

      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      <main className="flex-1 pb-20">
        {/* Hero Slider */}
        <Suspense fallback={<LoadingSkeleton />}>
          {heroBanners.length > 0 ? (
            <HeroSlider banners={heroBanners} />
          ) : (
            <div className="h-[250px] bg-gray-100 animate-pulse flex items-center justify-center">Loading Banners...</div>
          )}        </Suspense>

        {/* Secondary Offers */}
        <Suspense fallback={<LoadingSkeleton />}>
          <SecondaryBannerCarousel />
        </Suspense>

        {/* Offers For You Section */}
        <Suspense fallback={<LoadingSkeleton />}>
          <OffersSection />
        </Suspense>

        {/* Top Categories */}
        <div className="px-4 pt-6 pb-8">
          <TopCategories />
        </div>

        {/* Hustlr Club Banner - Made to match your screenshot */}
        <div className="mx-4 mb-8 bg-gradient-to-r from-indigo-950 via-blue-950 to-indigo-950 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 flex items-center gap-5 text-white">
            <div className="flex-1">
              <div className="uppercase text-amber-400 text-xs font-bold tracking-[2px] mb-1">hustlr CLUB</div>
              <p className="text-lg leading-tight font-medium">
                Scan your face and get your <span className="font-bold">first Hustlr frame for FREE</span>!
              </p>
              <p className="text-sm mt-2 opacity-90">Limited spots till 19th April</p>

              {/* Countdown */}
              <div className="flex gap-2 mt-4 text-sm">
                <div className="bg-white/10 px-3 py-1 rounded-xl text-center">
                  {timeLeft.days}d
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-xl text-center">
                  {timeLeft.hours}h
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-xl text-center">
                  {timeLeft.minutes}m
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-xl text-center">
                  {timeLeft.seconds}s
                </div>
              </div>

              <button className="mt-5 bg-white text-indigo-950 px-8 py-3 rounded-full font-semibold text-sm shadow-md hover:bg-gray-100 transition">
                Unlock my Hustlr
              </button>
            </div>

            {/* Right side image/avatar area */}
            <div className="w-28 h-28 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="24" r="8" />
                <circle cx="36" cy="24" r="8" />
                <path d="M20 24h8" />
                <path d="M4 24h0M44 24h0" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dynamic Category Shape Sections */}
        {categories.filter((c) => c.isActive).map((category) => (
          <Suspense key={category._id} fallback={<LoadingSkeleton />}>
            <ShapeSection
              title={category.name}
              shape="circle"
              categorySlug={category.slug}
              items={(category.shapes || []).map((shape: any) => ({
                label: shape.name,
                image: shape.image || "https://placehold.co/200x200?text=Shape",
              }))}
            />
          </Suspense>
        ))}

        {/* Nearby Services */}
        <Suspense fallback={<LoadingSkeleton />}>
          <NearbyServices />
        </Suspense>

        {/* Collections from backend (dynamic) */}
        {collections
          .filter((col) => col.isActive && (col.productIds?.length > 0))
          .map((col) => {
            const formattedItems = (col.productIds || []).map((prod: any) => ({
              title: prod.name,
              image: prod.images?.length > 0 ? prod.images[0] : "https://placehold.co/400x300?text=No+Image",
              link: '/product/' + prod._id,
            }));

            return (
              <div key={col._id} className="px-4 mt-8">
                <Suspense fallback={<LoadingSkeleton />}>
                  {col.layout === 'featured' ? (
                    <FeaturedGrid title={col.name} items={formattedItems} />
                  ) : (
                    <GridSection title={col.name} columns={3} items={formattedItems} />
                  )}
                </Suspense>
              </div>
            );
          })}

        {/* Campaign Banners */}
        <Suspense fallback={<LoadingSkeleton />}>
          {promoBanners.map((promo, index) => (
            <Campaign key={promo._id || index} image={promo.image} link={promo.redirectUrl || "#"} />
          ))}
        </Suspense>



        {/* Our Brands + Free Eye Checkup */}
        <div className="px-4 space-y-8 mt-8">
          <GridSection title="Our Brands" columns={3} items={EXCLUSIVE_ITEMS} />
          <GridSection title="Get a FREE Eye Check Up" columns={3} items={FREE_CHECKUP} />
        </div>

        {/* Extra Campaign Banners */}
        <Suspense fallback={<LoadingSkeleton />}>
          {promoBanners.slice(2).map((promo, index) => (
            <Campaign key={promo._id || index} image={promo.image} link={promo.redirectUrl || "#"} />
          ))}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Bottom Navigation (Lenskart-style) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        orderCount={orderCount}
      />
    </div>
  );
}