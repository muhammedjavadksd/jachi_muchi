import { lazy, Suspense, useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PromotionHeader, Footer, BottomNav, CenterFocusCarousel } from "@/components";
import { LoadingSkeleton } from "@/shared/components/LoadingSkeleton/LoadingSkeleton";
import { WhatsAppButton } from "@/shared/components/WhatsAppButton/WhatsAppButton";
import { NavTab } from "@/app/layouts";
import { FREE_CHECKUP, NEARBY_SERVICES_ORDER_SPLIT } from "@/features/home/constants";

const HEADER_SPACER_HEIGHT = 110;
import { TopCategories } from "@/features/home/components/TopCategories/TopCategories";
import { OfferCarousel } from "@/features/home/components/OfferCarousel/OfferCarousel";
import { api } from "@/shared/lib/axios";
import { getBanners } from "@/features/home/api/bannerApi";
import { isBannerVisible } from "@/shared/utils/banner";
import { getCollections } from "@/features/collections/api/collectionApi";
import { getBrands } from "@/features/product/api/brandApi";
import type { BrandItem } from "@/features/product/types";
import { BrandsSection } from "@/features/home/components/BrandsSection/BrandsSection";
import { useAuth, useLoginModal } from "@/features/auth/hooks";
import { useWishlist } from "@/features/wishlist/hooks";

const HeroSlider = lazy(() => import("@/features/home/components/HeroSlider/HeroSlider").then(m => ({ default: m.HeroSlider })));
const Campaign = lazy(() => import("@/features/home/components/Campaign/Campaign").then(m => ({ default: m.Campaign })));
const ShapeSection = lazy(() => import("@/features/home/components/ShapeSection/ShapeSection").then(m => ({ default: m.ShapeSection })));
const NearbyServices = lazy(() => import("@/features/home/components/NearbyServices/NearbyServices").then(m => ({ default: m.NearbyServices })));
const GridSection = lazy(() => import("@/features/home/components/GridSection/GridSection").then(m => ({ default: m.GridSection })));
const FeaturedGrid = lazy(() => import("@/features/home/components/FeaturedGrid/FeaturedGrid").then(m => ({ default: m.FeaturedGrid })));
const PremiumEyewear = lazy(() => import("@/features/home/components/PremiumEyewear/PremiumEyewear").then(m => ({ default: m.PremiumEyewear })));
const BeMoreBanner = lazy(() => import("@/features/home/components/BeMoreBanner/BeMoreBanner").then(m => ({ default: m.BeMoreBanner })));

export function HomePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [orderCount] = useState(2);
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);
  const [categories, setCategories] = useState<any[]>([]);

  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [promoBanners, setPromoBanners] = useState<any[]>([]);
  const [bannersLoaded, setBannersLoaded] = useState(false);
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

  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        setCategories((res.data?.data?.categories || []).filter((c: any) => c.isActive));
      })
      .catch(() => setCategories([]));

    getBanners().then((allBanners) => {
      const now = Date.now();
      const visible = allBanners.filter((b) => isBannerVisible(b, now));

      const homepage = visible
        .filter((b) => b.type === "homepage")
        .sort((a, b) => a.position - b.position);

      const promotional = visible
        .filter((b) => b.type === "promotional")
        .sort((a, b) => a.position - b.position);

      setHeroBanners(homepage);
      setPromoBanners(promotional);
      setBannersLoaded(true);
    });

    getCollections()
      .then((cols) => {
        setCollections(cols || []);
      })
      .catch(() => setCollections([]));

    getBrands()
      .then((data) => {
        setBrands(data || []);
      })
      .catch(() => setBrands([]));

  }, [isAuthenticated]);


  return (
    <div className="w-full flex flex-col bg-white min-h-screen font-sans overflow-x-hidden">
      <PromotionHeader />

      <div style={spacerStyle} />

      <main className="flex-1 pb-20 md:pb-0">

        <Suspense fallback={<LoadingSkeleton />}>
          {!bannersLoaded ? (
            <div className="h-62.5 bg-gray-100 animate-pulse" />
          ) : heroBanners.length > 0 ? (
            <HeroSlider banners={heroBanners} />
          ) : null}        </Suspense>

        <TopCategories />

        <Suspense fallback={<LoadingSkeleton />}>
          <PremiumEyewear maxHomepageOrder={NEARBY_SERVICES_ORDER_SPLIT} />
        </Suspense>

        <CenterFocusCarousel />

        <OfferCarousel />

        {categories.filter((c) => c.isActive && c.shapes?.length > 0).map((category) => (
          <Suspense key={category._id} fallback={<LoadingSkeleton />}>
            <ShapeSection
              title={category.name}
              shape="circle"
              categorySlug={category.slug}
              items={category.shapes.map((shape: any) => ({
                label: shape.name,
                image: shape.image || "https://placehold.co/200x200?text=Shape",
              }))}
            />
          </Suspense>
        ))}

        {/* <div className="mx-4 mb-8 bg-gradient-to-r from-indigo-950 via-blue-950 to-indigo-950 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 flex items-center gap-5 text-white">
            <div className="flex-1">
              <div className="uppercase text-amber-400 text-xs font-bold tracking-[2px] mb-1">hustlr CLUB</div>
              <p className="text-lg leading-tight font-medium">
                Scan your face and get your <span className="font-bold">first Hustlr frame for FREE</span>!
              </p>
              <p className="text-sm mt-2 opacity-90">Limited spots till 19th April</p>

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

            <div className="w-28 h-28 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="24" r="8" />
                <circle cx="36" cy="24" r="8" />
                <path d="M20 24h8" />
                <path d="M4 24h0M44 24h0" />
              </svg>
            </div>
          </div>
        </div> */}

        <Suspense fallback={<LoadingSkeleton />}>
          <NearbyServices />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <PremiumEyewear minHomepageOrder={NEARBY_SERVICES_ORDER_SPLIT} />
        </Suspense>

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

        <Suspense fallback={<LoadingSkeleton />}>
          {promoBanners.length > 1 && promoBanners[1] && (
            <Campaign key={promoBanners[1]._id || 'promo-1'} image={promoBanners[1].image} link={promoBanners[1].redirectUrl || "#"} />
          )}
        </Suspense>

        <BrandsSection brands={brands} />

        <GridSection title="Get a FREE Eye Check Up" columns={3} items={FREE_CHECKUP} />

        <Suspense fallback={<LoadingSkeleton />}>
          <BeMoreBanner />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          {promoBanners.length > 2 && (
            promoBanners.slice(2).map((promo, index) => (
              <Campaign key={promo._id || `promo-${index + 2}`} image={promo.image} link={promo.redirectUrl || "#"} />
            ))
          )}
        </Suspense>
      </main>

      <Footer />

      <WhatsAppButton />

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        orderCount={orderCount}
      />
    </div>
  );
}

