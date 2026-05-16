import { lazy, Suspense, useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PromotionHeader, LoadingSkeleton, Footer, WhatsAppButton, BottomNav } from "./components";
import { NavTab } from "./components/BottomNav/BottomNav";
import { HEADER_SPACER_HEIGHT, FREE_CHECKUP } from "./lib/constants";
import { TopCategories } from "./components/TopCategories/TopCategories";
import { api } from "./api/axios";
import { getBanners } from "./api/banner";
import { getCollections } from "./api/collection";
import { getBrands, type BrandItem } from "./api/brand";
import { OffersSection } from "./components/OffersSection/OffersSection";
import { useAuth } from "./context/AuthContext";
import { useLoginModal } from "./context/LoginModalContext";
import { useWishlist } from "./context/WishlistContext";
import { fetchUserCoupons, type UserCoupon } from "./lib/couponApi";
import { getImageUrl } from "./lib/image";

/** Lazy loaded components */
const HeroSlider = lazy(() => import("./components/HeroSlider/HeroSlider").then(m => ({ default: m.HeroSlider })));
const SecondaryBannerCarousel = lazy(() => import("./components/SecondaryBannerCarousel/SecondaryBannerCarousel").then(m => ({ default: m.SecondaryBannerCarousel })));
const Campaign = lazy(() => import("./components/Campaign/Campaign").then(m => ({ default: m.Campaign })));
const ShapeSection = lazy(() => import("./components/ShapeSection/ShapeSection").then(m => ({ default: m.ShapeSection })));
const NearbyServices = lazy(() => import("./components/NearbyServices/NearbyServices").then(m => ({ default: m.NearbyServices })));
const GridSection = lazy(() => import("./components/GridSection/GridSection").then(m => ({ default: m.GridSection })));
const EyeCheckupFeatures = lazy(() => import("./components/EyeCheckupStores/EyeCheckupFeatures").then(m => ({ default: m.EyeCheckupFeatures })));
const FeaturedGrid = lazy(() => import("./components/FeaturedGrid/FeaturedGrid").then(m => ({ default: m.FeaturedGrid })));

export default function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [orderCount] = useState(2);
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);
  const [categories, setCategories] = useState<any[]>([]);

  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [promoBanners, setPromoBanners] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const { isAuthenticated } = useAuth();
  const { open: openWishlist } = useWishlist();
  const { open: openLogin } = useLoginModal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      openLogin();
      navigate("/", { replace: true });
    }
  }, [searchParams, openLogin, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = sessionStorage.getItem("redirectAfterLogin");
      if (redirect) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirect, { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const handleTabChange = useCallback((tab: NavTab) => {
    if (tab === "wishlist") {
      if (isAuthenticated) {
        openWishlist();
      } else {
        navigate("/wishlist");
      }
      return;
    }
    setActiveTab(tab);
  }, [openWishlist, isAuthenticated, navigate]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
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

    // --- FETCH BRANDS ---
    getBrands()
      .then((data) => {
        setBrands(data || []);
      })
      .catch(() => setBrands([]));

    // --- FETCH USER COUPONS (only if authenticated) ---
    if (isAuthenticated) {
      fetchUserCoupons()
        .then((coupons) => setUserCoupons(coupons))
        .catch(() => setUserCoupons([]));
    }

  }, [isAuthenticated]);

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

  const formattedBrands = brands
    .filter((b: any) => b.isActive)
    .map((brand: any) => ({
      title: brand.name,
      image: getImageUrl(brand.logo) || "https://placehold.co/400x300?text=Brand",
      link: `/search?brand=${brand._id}`,
    }));

  return (
    <div className="w-full flex flex-col bg-white min-h-screen font-sans">
      {/* Promotion Header */}
      <PromotionHeader />

      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      <main className="flex-1 pb-20 md:pb-0">
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
          <OffersSection userCoupons={userCoupons} />
        </Suspense>

        {/* First Promotional Banner (placed above Top Categories / Hustlr Club) */}
        <Suspense fallback={<LoadingSkeleton />}>
          {promoBanners.length > 0 && promoBanners[0] && (
            <Campaign key={promoBanners[0]._id || 'promo-0'} image={promoBanners[0].image} link={promoBanners[0].redirectUrl || "#"} />
          )}
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

        {/* Nearby Stores & Services */}
        <Suspense fallback={<LoadingSkeleton />}>
          <NearbyServices />
        </Suspense>

        {/* Collections from backend (dynamic) */}
        {collections
          .filter((col) => col.isActive && col.layout !== 'hidden' && (col.productIds?.length > 0)).map((col) => {
            const maxItems = col.layout === 'featured' ? 5 : 6;
            const previewProducts = (col.productIds || []).slice(0, maxItems);
            const formattedItems = previewProducts.map((prod: any) => ({
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
                  {(col.productIds || []).length > maxItems && (
                    <div className="flex justify-center mt-6">
                      <a
                        href={`/search?collection=${col.slug}`}
                        className="px-8 py-2.5 border-2 border-teal-600 text-teal-700 font-semibold rounded-full hover:bg-teal-50 transition-colors text-sm"
                      >
                        View All
                      </a>
                    </div>
                  )}
                </Suspense>
              </div>
            );
          })}

        {/* Second Promotional Banner (after Collections) */}
        <Suspense fallback={<LoadingSkeleton />}>
          {promoBanners.length > 1 && promoBanners[1] && (
            <Campaign key={promoBanners[1]._id || 'promo-1'} image={promoBanners[1].image} link={promoBanners[1].redirectUrl || "#"} />
          )}
        </Suspense>



        {/* Our Brands + Free Eye Checkup */}
        <div className="px-4 space-y-8 mt-8">
          <GridSection
            title="Our Brands"
            columns={3}
            items={formattedBrands}
          />
          {/* <GridSection title="Get a FREE Eye Check Up" columns={3} items={FREE_CHECKUP} /> */}
        </div>

        {/* Remaining Promotional Banners (bottom of page) */}
        <Suspense fallback={<LoadingSkeleton />}>
          {promoBanners.length > 2 && (
            promoBanners.slice(2).map((promo, index) => (
              <Campaign key={promo._id || `promo-${index + 2}`} image={promo.image} link={promo.redirectUrl || "#"} />
            ))
          )}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Bottom Navigation (Lenskart-style) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        orderCount={orderCount}
      />
    </div>
  );
}
