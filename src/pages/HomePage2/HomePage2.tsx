import { useMemo } from "react";
import { Link } from "react-router-dom";
import { HeaderHome2, Footer, WhatsAppButton, Container, HEADER_HOME2_SPACER_HEIGHT } from "../../components";
import { useScroll } from "../../hooks";
import {
  TOP_CATEGORIES,
  EYEGLASS_SHAPES,
  SUNGLASS_SHAPES,
  NEARBY_SERVICES,
  PREMIUM_EYEWEAR,
  HERO_BANNER_IMAGES,
} from "../../lib/constants";

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

      {/* ——— 1. Editorial hero ——— */}
      <section className="w-full bg-stone-900 text-white">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh]">
          <div className="flex-1 flex flex-col justify-center py-10 sm:py-14 lg:py-24 lg:pr-16">
            <p className="text-amber-400/90 text-xs sm:text-sm uppercase tracking-[0.3em] mb-3 sm:mb-4">
              Eyewear for everyone
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
              See the world
              <br />
              <span className="text-stone-300">clearly.</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-stone-400 text-base sm:text-lg max-w-md">
              Glasses and sunglasses that fit your style. Shop frames, try at home, or visit a store.
            </p>
            <div className="mt-7 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/search"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-amber-500 text-stone-900 font-semibold text-sm sm:text-base hover:bg-amber-400 transition-colors"
              >
                Shop all
              </Link>
              <Link
                to="/try-at-home"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-stone-600 text-white font-semibold text-sm sm:text-base hover:bg-stone-800 transition-colors"
              >
                Try at home
              </Link>
            </div>
          </div>
          <div className="flex-1 relative hidden lg:block">
            <img
              src={HERO_BANNER_IMAGES[0]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-left"
            />
          </div>
        </div>
      </section>

      {/* ——— 2. Category pills ——— */}
      <section className="w-full py-8 sm:py-12 lg:py-16 border-b border-stone-200">
        <Container>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-4 sm:mb-6">
            Shop by type
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {TOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border-2 border-stone-300 text-stone-700 font-medium text-sm sm:text-base hover:border-amber-500 hover:bg-amber-50 hover:text-stone-900 transition-colors"
              >
                {cat.label}
                {cat.badge && (
                  <span className="ml-1.5 text-amber-600 text-xs sm:text-sm">{cat.badge}</span>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 3. Shape grid ——— */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
        <Container>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 mb-2">
            Find your shape
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mb-6 sm:mb-10">
            Eyeglasses and sunglasses in the shape that suits you.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[...EYEGLASS_SHAPES.slice(0, 4), ...SUNGLASS_SHAPES.slice(0, 4)].map((item, i) => (
              <Link
                key={`${item.label}-${i}`}
                to={item.link}
                className="group relative block aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white font-semibold text-xs sm:text-sm">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 4. Trust strip ——— */}
      <section className="w-full py-10 sm:py-12 bg-stone-100 border-y border-stone-200">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {[
              { title: "Free shipping", sub: "On orders above ₹499" },
              { title: "1-year warranty", sub: "On frames" },
              { title: "14-day returns", sub: "Easy exchange" },
              { title: "Expert support", sub: "Call or chat" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-500/20 text-amber-700 items-center justify-center text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  —
                </div>
                <h3 className="font-semibold text-stone-900 text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-0.5 sm:mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 5. Full-bleed feature banner ——— */}
      <section className="w-full">
        <Link
          to={PREMIUM_EYEWEAR[0]?.link ?? "/collections"}
          className="block relative w-full overflow-hidden bg-stone-800"
          style={{ aspectRatio: "16/7", minHeight: "180px" }}
        >
          <img
            src={PREMIUM_EYEWEAR[0]?.image ?? HERO_BANNER_IMAGES[0]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-stone-900/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
            <p className="text-amber-400/90 text-xs sm:text-sm uppercase tracking-[0.2em] mb-1 sm:mb-2">
              Premium
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {PREMIUM_EYEWEAR[0]?.title ?? "Premium Eyewear"}
            </h2>
            <span className="mt-3 sm:mt-4 inline-block text-white/90 font-medium underline underline-offset-4 text-sm sm:text-base">
              Explore →
            </span>
          </div>
        </Link>
      </section>

      {/* ——— 6. Explore tiles ——— */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
        <Container>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 mb-6 sm:mb-10">
            Experience more
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {NEARBY_SERVICES.slice(0, 2).map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="group relative block rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100"
                style={{ aspectRatio: "2/1", minHeight: "160px" }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/40" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {service.title}
                  </h3>
                  <span className="mt-1 sm:mt-2 text-amber-300 font-medium text-xs sm:text-sm">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 7. Brand strip ——— */}
      <section className="w-full py-8 sm:py-12 border-t border-stone-200 bg-stone-50">
        <Container>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-4 sm:mb-6">
            Brands we love
          </p>
          <div className="flex flex-wrap gap-x-5 sm:gap-x-8 gap-y-2 sm:gap-y-3">
            {PREMIUM_EYEWEAR.map((brand) => (
              <Link
                key={brand.title}
                to={brand.link}
                className="text-sm sm:text-base text-stone-700 font-medium hover:text-amber-700 transition-colors"
              >
                {brand.title}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 8. Bottom CTA ——— */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-stone-900 text-white">
        <Container className="text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Book a free eye check
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base max-w-lg mx-auto px-4">
            Get your eyes tested at home or at a store near you. Quick, easy, and free.
          </p>
          <Link
            to="/try-at-home"
            className="inline-block mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-amber-500 text-stone-900 font-semibold text-sm sm:text-base hover:bg-amber-400 transition-colors"
          >
            Get started
          </Link>
        </Container>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}