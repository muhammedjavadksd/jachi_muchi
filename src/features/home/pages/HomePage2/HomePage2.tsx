import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, Container } from "@/shared/components";
import { HeaderHome2, HEADER_HOME2_SPACER_HEIGHT } from "@/app/layouts";
import { useScroll } from "@/shared/hooks";
import {
  TOP_CATEGORIES,
  EYEGLASS_SHAPES,
  SUNGLASS_SHAPES,
  NEARBY_SERVICES,
  PREMIUM_EYEWEAR,
  HERO_BANNER_IMAGES,
} from "@/features/home/constants";

/**
 * Home 2 – Modern Editorial Layout (Fully Responsive)
 */
export function HomePage2(): JSX.Element {
  const isScrolled = useScroll();

  const spacerStyle = useMemo(
    () => ({ height: `${HEADER_HOME2_SPACER_HEIGHT}px` }),
    []
  );

  return (
    <div className="w-full flex flex-col min-h-screen bg-stone-50">
      <HeaderHome2 isScrolled={isScrolled} />
      <div style={spacerStyle} />

      {/* 1. Editorial Hero */}
      <section className="w-full bg-stone-900 text-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row min-h-[85vh] lg:min-h-[80vh] items-center">
            {/* Left Content */}
            <div className="flex-1 flex flex-col justify-center py-16 lg:py-24 lg:pr-16 z-10">
              <p className="text-amber-400 text-sm uppercase tracking-[0.125em] mb-4 font-medium">
                Eyewear for everyone
              </p>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
                See the world<br />
                <span className="text-stone-300">clearly.</span>
              </h1>

              <p className="mt-6 text-stone-400 text-lg max-w-md">
                Glasses and sunglasses that fit your style. Shop frames, try at home, or visit a store near you.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/search"
                  className="px-10 py-4 rounded-full bg-amber-500 text-stone-900 font-semibold text-base hover:bg-amber-400 active:scale-95 transition-all text-center"
                >
                  Shop All Frames
                </Link>
                <Link
                  to="/try-at-home"
                  className="px-10 py-4 rounded-full border-2 border-stone-600 text-white font-semibold hover:bg-stone-800 active:scale-95 transition-all text-center"
                >
                  Try at Home
                </Link>
              </div>
            </div>

            {/* Right Image - Hidden on mobile, shown on lg+ */}
            <div className="flex-1 relative hidden lg:block h-[85vh] lg:h-auto">
              <img
                src={HERO_BANNER_IMAGES[0]}
                alt="Premium eyewear"
                className="absolute inset-0 w-full h-full object-cover object-center lg:object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 via-stone-900/30 to-transparent lg:hidden" />
            </div>
          </div>
        </div>

        {/* Mobile Hero Image Overlay */}
        <div className="lg:hidden absolute inset-0 -z-10">
          <img
            src={HERO_BANNER_IMAGES[0]}
            alt=""
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent" />
        </div>
      </section>

      {/* 2. Category Pills */}
      <section className="w-full py-12 sm:py-16 border-b border-stone-200 bg-white">
        <Container>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-6 px-1">
            SHOP BY TYPE
          </p>
          <div className="flex flex-wrap gap-3">
            {TOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="px-6 py-3 rounded-full border-2 border-stone-300 text-stone-700 font-medium hover:border-amber-500 hover:bg-amber-50 hover:text-stone-900 transition-all active:scale-95 whitespace-nowrap"
              >
                {cat.label}
                {cat.badge && (
                  <span className="ml-2 text-amber-600 font-semibold">{cat.badge}</span>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Find Your Shape - Bento Grid */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <Container>
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Find your shape
            </h2>
            <p className="text-stone-600 mt-2 text-lg">
              Eyeglasses and sunglasses that suit your face perfectly.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...EYEGLASS_SHAPES.slice(0, 4), ...SUNGLASS_SHAPES.slice(0, 4)].map((item, i) => (
              <Link
                key={`${item.label}-${i}`}
                to={item.link ?? "/"}
                className="group relative block aspect-[4/5] rounded-3xl overflow-hidden shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-white font-semibold text-lg tracking-tight block">
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Trust Strip */}
      <section className="w-full py-12 bg-stone-100">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { title: "Free shipping", sub: "On orders above QAR 499" },
              { title: "1-year warranty", sub: "On all frames" },
              { title: "14-day returns", sub: "Hassle-free exchange" },
              { title: "Expert support", sub: "Call or chat anytime" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl mb-5">
                  ✓
                </div>
                <h3 className="font-semibold text-stone-900 text-lg">{item.title}</h3>
                <p className="text-stone-600 text-sm mt-2 leading-tight">{item.sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Full-bleed Premium Banner */}
      <section className="w-full">
        <Link
          to={PREMIUM_EYEWEAR[0]?.link ?? "/collections"}
          className="block relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden"
        >
          <img
            src={PREMIUM_EYEWEAR[0]?.image ?? HERO_BANNER_IMAGES[0]}
            alt="Premium Collection"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-amber-400 text-sm uppercase tracking-[0.125em] mb-3">Premium Collection</p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-lg">
              {PREMIUM_EYEWEAR[0]?.title ?? "Timeless Craftsmanship"}
            </h2>
            <span className="mt-6 inline-flex items-center gap-2 text-white text-lg font-medium hover:underline">
              Explore Collection →
            </span>
          </div>
        </Link>
      </section>

      {/* 6. Experience More - Explore Tiles */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <Container>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-10">Experience more</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {NEARBY_SERVICES.slice(0, 2).map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="group relative block rounded-3xl overflow-hidden aspect-video md:aspect-[16/9] shadow-sm"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                  <p className="text-amber-300 mt-2 text-sm font-medium inline-flex items-center gap-2">
                    Learn more <span className="text-base">→</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. Brands We Love */}
      <section className="w-full py-12 bg-stone-50 border-t border-stone-200">
        <Container>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-6">Brands we love</p>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {PREMIUM_EYEWEAR.map((brand) => (
              <Link
                key={brand.title}
                to={brand.link}
                className="text-stone-700 font-medium hover:text-amber-700 transition-colors text-lg"
              >
                {brand.title}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. Bottom CTA */}
      <section className="w-full py-16 sm:py-20 bg-stone-900 text-white">
        <Container className="text-center max-w-lg mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Book a free eye check
          </h2>
          <p className="mt-4 text-stone-400 text-lg">
            Get your eyes tested at home or at a store near you. Quick, easy, and completely free.
          </p>
          <Link
            to="/try-at-home"
            className="mt-8 inline-block px-10 py-4 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 active:scale-95 transition-all"
          >
            Get Started Free
          </Link>
        </Container>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

