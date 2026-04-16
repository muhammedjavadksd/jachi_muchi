import { lazy, Suspense, useMemo } from "react";
import { PromotionHeader, LoadingSkeleton, Footer, WhatsAppButton } from "./components";
import { EYEGLASS_SHAPES, HEADER_SPACER_HEIGHT, EXCLUSIVE_ITEMS, PREMIUM_EYEWEAR, FREE_CHECKUP } from "./lib/constants";
import { TopCategories } from "./components/TopCategories/TopCategories";

/** Lazy loaded components for code splitting and faster initial load */
const HeroSlider = lazy(() => import("./components/HeroSlider/HeroSlider").then(m => ({ default: m.HeroSlider })));
const SecondaryBannerCarousel = lazy(() => import("./components/SecondaryBannerCarousel/SecondaryBannerCarousel").then(m => ({ default: m.SecondaryBannerCarousel })));
const Campaign = lazy(() => import("./components/Campaign/Campaign").then(m => ({ default: m.Campaign })));
const ShapeSection = lazy(() => import("./components/ShapeSection/ShapeSection").then(m => ({ default: m.ShapeSection })));
const NearbyServices = lazy(() => import("./components/NearbyServices/NearbyServices").then(m => ({ default: m.NearbyServices })));
const GridSection = lazy(() => import("./components/GridSection/GridSection").then(m => ({ default: m.GridSection })));
const FeaturedGrid = lazy(() => import("./components/FeaturedGrid/FeaturedGrid").then(m => ({ default: m.FeaturedGrid })));

/**
 * Main application component
 * Assembles all page sections for the homepage
 * Uses lazy loading for below-the-fold content
 */
export default function App(): JSX.Element {
  /** Memoize spacer style to prevent recalculation */
  const spacerStyle = useMemo(() => ({ 
    height: `${HEADER_SPACER_HEIGHT}px` 
  }), []);

  return (
    <div className="w-full flex flex-col">
      {/* Fixed Header - Not lazy loaded as it's always visible */}
      <PromotionHeader />

      {/* Spacer - exactly matches header height to push content below */}
      <div style={spacerStyle} />

      {/* Lazy loaded sections with Suspense */}
      <Suspense fallback={<LoadingSkeleton />}>
        {/* Hero Slider - Edge to Edge */}
        <div className="w-full">
          <HeroSlider />
        </div>
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Secondary horizontal banners */}
        <SecondaryBannerCarousel />
      </Suspense>

      {/* Top Categories */}
      <TopCategories />

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Campaign Banner */}
        <Campaign image="/campign/image.png" link="/campaign" />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Shape Section - Eyeglasses */}
        <ShapeSection
          title="Get the perfect shape - Eyeglasses"
          shape="circle"
          items={EYEGLASS_SHAPES}
        />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        {/* Nearby Stores & Services */}
        <NearbyServices />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Shape Section - Sunglasses */}
        <ShapeSection
          title="Get the perfect shape - Sunglasses"
          shape="circle"
          items={EYEGLASS_SHAPES}
        />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Exclusively at Lenskart */}
        <GridSection
          title="Exclusively at Lenskart"
          columns={3}
          items={EXCLUSIVE_ITEMS}
        />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Campaign Banner 2 */}
        <Campaign image="/campign/2.png" link="/campaign/2" />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Our Brands */}
        <GridSection
          title="Our Brands"
          columns={3}
          items={EXCLUSIVE_ITEMS}
        />
      </Suspense>

      

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Premium Eyewear */}
        <FeaturedGrid
          title="Premium Eyewear"
          items={PREMIUM_EYEWEAR}
        />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        {/* Our Brands */}
        <GridSection
          title="Get a FREE Eye Check Up"
          columns={3}
          items={FREE_CHECKUP}
        />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        <Campaign image="/campign/4.png" link="/campaign/3" />
        <Campaign image="/campign/5.png" link="/campaign/4" />
      </Suspense>

      {/* Footer - Not lazy loaded as it's always visible at bottom */}
      <Footer />

      {/* Fixed Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
