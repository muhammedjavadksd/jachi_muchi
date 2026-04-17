import { lazy, Suspense, useMemo } from "react";
import { Header, LoadingSkeleton, Footer, WhatsAppButton, BottomNav } from "./components";
import { useScroll } from "./hooks";
import {
EYEGLASS_SHAPES,
EXCLUSIVE_ITEMS,
PREMIUM_EYEWEAR,
FREE_CHECKUP,
HEADER_SPACER_HEIGHT
} from "./lib/constants";

import { TopCategories } from "./components/TopCategories/TopCategories";

/** Lazy loaded components */
const HeroSlider = lazy(() => import("./components/HeroSlider/HeroSlider").then(m => ({ default: m.HeroSlider })));
const SecondaryBannerCarousel = lazy(() => import("./components/SecondaryBannerCarousel/SecondaryBannerCarousel").then(m => ({ default: m.SecondaryBannerCarousel })));
const Campaign = lazy(() => import("./components/Campaign/Campaign").then(m => ({ default: m.Campaign })));

export default function App(): JSX.Element {
const isScrolled = useScroll();

const spacerStyle = useMemo(() => ({
height: `${HEADER_SPACER_HEIGHT}px`
}), []);

return ( <div className="w-full flex flex-col min-h-screen pb-16 lg:pb-0">

```
  {/* Header */}
  <Header isScrolled={isScrolled} />

  {/* Spacer */}
  <div style={spacerStyle} />

  {/* Hero */}
  <Suspense fallback={<LoadingSkeleton />}>
    <div className="w-full">
      <HeroSlider />
    </div>
  </Suspense>

  {/* Secondary banners */}
  <Suspense fallback={<LoadingSkeleton />}>
    <SecondaryBannerCarousel />
  </Suspense>

  {/* Top Categories */}
  <TopCategories />

  {/* Campaign */}
  <Suspense fallback={<LoadingSkeleton />}>
    <Campaign image="/campign/image.png" link="/campaign" />
  </Suspense>

  {/* Footer */}
  <Footer />

  {/* Bottom Nav */}
  <BottomNav />

  {/* WhatsApp */}
  <WhatsAppButton />

</div>
```

);
}
