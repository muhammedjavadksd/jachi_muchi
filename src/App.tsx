import { lazy, Suspense } from "react";
import { Header, LoadingSkeleton, Footer, WhatsAppButton, BottomNav } from "./components";
import { useScroll } from "./hooks";
import { EYEGLASS_SHAPES, EXCLUSIVE_ITEMS, PREMIUM_EYEWEAR, FREE_CHECKUP } from "./lib/constants";

/** Lazy loaded components for code splitting */
const HeroSlider = lazy(() => import("./components/HeroSlider/HeroSlider").then(m => ({ default: m.HeroSlider })));
const SecondaryBannerCarousel = lazy(() => import("./components/SecondaryBannerCarousel/SecondaryBannerCarousel").then(m => ({ default: m.SecondaryBannerCarousel })));
const TopCategories = lazy(() => import("./components/TopCategories/TopCategories").then(m => ({ default: m.TopCategories })));
const Campaign = lazy(() => import("./components/Campaign/Campaign").then(m => ({ default: m.Campaign })));
const ShapeSection = lazy(() => import("./components/ShapeSection/ShapeSection").then(m => ({ default: m.ShapeSection })));
const NearbyServices = lazy(() => import("./components/NearbyServices/NearbyServices").then(m => ({ default: m.NearbyServices })));
const GridSection = lazy(() => import("./components/GridSection/GridSection").then(m => ({ default: m.GridSection })));
const FeaturedGrid = lazy(() => import("./components/FeaturedGrid/FeaturedGrid").then(m => ({ default: m.FeaturedGrid })));

/**
 * Main application component
 * Assembles all page sections for the homepage
 */
export default function App(): JSX.Element {
  const isScrolled = useScroll();

  return (
    <div className="w-full flex flex-col min-h-screen pb-16 lg:pb-0">
      {/* Fixed Header */}
      <Header isScrolled={isScrolled} />

      {/* Spacer for header (promo + navbar) */}
      <div className="h-[76px] sm:h-[80px]" />

      {/* Hero Slider */}
      <Suspense fallback={<LoadingSkeleton />}>
        <HeroSlider />
      </Suspense>

      {/* Secondary Banners */}
      <Suspense fallback={<LoadingSkeleton />}>
        <SecondaryBannerCarousel />
      </Suspense>

      {/* Top Categories */}
      <Suspense fallback={<LoadingSkeleton />}>
        <TopCategories />
      </Suspense>

      {/* Campaign Banner */}
      <Suspense fallback={<LoadingSkeleton />}>
        <Campaign image="/campign/image.png" link="/campaign" />
      </Suspense>

      {/* Shape Section - Eyeglasses */}
      <Suspense fallback={<LoadingSkeleton />}>
        <ShapeSection
          title="Get the perfect shape - Eyeglasses"
          shape="circle"
          items={EYEGLASS_SHAPES}
        />
      </Suspense>
      
      {/* Nearby Services */}
      <Suspense fallback={<LoadingSkeleton />}>
        <NearbyServices />
      </Suspense>

      {/* Shape Section - Sunglasses */}
      <Suspense fallback={<LoadingSkeleton />}>
        <ShapeSection
          title="Get the perfect shape - Sunglasses"
          shape="circle"
          items={EYEGLASS_SHAPES}
        />
      </Suspense>

      {/* Exclusively at Lenskart */}
      <Suspense fallback={<LoadingSkeleton />}>
        <GridSection
          title="Exclusively at Lenskart"
          columns={3}
          items={EXCLUSIVE_ITEMS}
        />
      </Suspense>

      {/* Campaign Banner 2 */}
      <Suspense fallback={<LoadingSkeleton />}>
        <Campaign image="/campign/2.png" link="/campaign/2" />
      </Suspense>

      {/* Our Brands */}
      <Suspense fallback={<LoadingSkeleton />}>
        <GridSection
          title="Our Brands"
          columns={3}
          items={EXCLUSIVE_ITEMS}
        />
      </Suspense>

      {/* Premium Eyewear */}
      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturedGrid
          title="Premium Eyewear"
          items={PREMIUM_EYEWEAR}
        />
      </Suspense>

      {/* Free Eye Check Up */}
      <Suspense fallback={<LoadingSkeleton />}>
        <GridSection
          title="Get a FREE Eye Check Up"
          columns={3}
          items={FREE_CHECKUP}
        />
      </Suspense>

      {/* Campaign Banners */}
      <Suspense fallback={<LoadingSkeleton />}>
        <Campaign image="/campign/4.png" link="/campaign/3" />
        <Campaign image="/campign/5.png" link="/campaign/4" />
      </Suspense>

      {/* Footer */}
      <Footer />

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
