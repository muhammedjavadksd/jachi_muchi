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

/**
 * Home 2 – Completely different UI: editorial hero, pill categories,
 * bento shapes, trust strip, full-bleed feature, explore tiles, brand strip.
 * No shared section components with the main home.
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

      {/* ——— 1. Editorial hero (split, dark) ——— */}
      <section className="w-full bg-stone-900 text-white">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 flex flex-col lg:flex-row min-h-[85vh] lg:min-h-[75vh]">
          <div className="flex-1 flex flex-col justify-center py-16 lg:py-24 lg:pr-16">
            <p className="text-amber-400/90 text-sm uppercase tracking-[0.3em] mb-4">
              Eyewear for everyone
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
              See the world
              <br />
              <span className="text-stone-300">clearly.</span>
            </h1>
            <p className="mt-6 text-stone-400 text-lg max-w-md">
              Glasses and sunglasses that fit your style. Shop frames, try at home, or visit a store.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/search"
                className="inline-block px-8 py-4 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
              >
                Shop all
              </Link>
              <Link
                to="/try-at-home"
                className="inline-block px-8 py-4 rounded-full border border-stone-600 text-white font-semibold hover:bg-stone-800 transition-colors"
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

      {/* ——— 2. Category pills (horizontal, no images) ——— */}
      <section className="w-full py-12 sm:py-16 border-b border-stone-200">
        <Container>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-6">
            Shop by type
          </p>
          <div className="flex flex-wrap gap-3">
            {TOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="px-5 py-2.5 rounded-full border-2 border-stone-300 text-stone-700 font-medium hover:border-amber-500 hover:bg-amber-50 hover:text-stone-900 transition-colors"
              >
                {cat.label}
                {cat.badge && (
                  <span className="ml-2 text-amber-600 text-sm">{cat.badge}</span>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 3. Bento shape grid (eyeglasses + sunglasses) ——— */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            Find your shape
          </h2>
          <p className="text-stone-600 mb-10">
            Eyeglasses and sunglasses in the shape that suits you.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...EYEGLASS_SHAPES.slice(0, 4), ...SUNGLASS_SHAPES.slice(0, 4)].map((item, i) => (
              <Link
                key={`${item.label}-${i}`}
                to={item.link}
                className="group relative block aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white font-semibold text-sm">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 4. Trust strip (icons + text, no images) ——— */}
      <section className="w-full py-12 bg-stone-100 border-y border-stone-200">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { title: "Free shipping", sub: "On orders above ₹499" },
              { title: "1-year warranty", sub: "On frames" },
              { title: "14-day returns", sub: "Easy exchange" },
              { title: "Expert support", sub: "Call or chat" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex h-12 w-12 rounded-full bg-amber-500/20 text-amber-700 items-center justify-center text-xl font-bold mb-3">
                  —
                </div>
                <h3 className="font-semibold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-600 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 5. Full-bleed feature (one big banner) ——— */}
      <section className="w-full py-0">
        <Link
          to={PREMIUM_EYEWEAR[0]?.link ?? "/collections"}
          className="block relative w-full aspect-[21/9] min-h-[280px] overflow-hidden bg-stone-800"
        >
          <img
            src={PREMIUM_EYEWEAR[0]?.image ?? HERO_BANNER_IMAGES[0]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-stone-900/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-amber-400/90 text-sm uppercase tracking-[0.2em] mb-2">
              Premium
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {PREMIUM_EYEWEAR[0]?.title ?? "Premium Eyewear"}
            </h2>
            <span className="mt-4 inline-block text-white/90 font-medium underline underline-offset-4">
              Explore →
            </span>
          </div>
        </Link>
      </section>

      {/* ——— 6. Explore tiles (2 large cards) ——— */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-10">
            Experience more
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {NEARBY_SERVICES.slice(0, 2).map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="group relative block rounded-2xl overflow-hidden bg-stone-100 aspect-[2/1] min-h-[200px]"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/40" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white">
                    {service.title}
                  </h3>
                  <span className="mt-2 text-amber-300 font-medium text-sm">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 7. Brand strip (text links) ——— */}
      <section className="w-full py-12 border-t border-stone-200 bg-stone-50">
        <Container>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-6">
            Brands we love
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {PREMIUM_EYEWEAR.map((brand) => (
              <Link
                key={brand.title}
                to={brand.link}
                className="text-stone-700 font-medium hover:text-amber-700 transition-colors"
              >
                {brand.title}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— 8. Bottom CTA ——— */}
      <section className="w-full py-16 sm:py-20 bg-stone-900 text-white">
        <Container className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Book a free eye check
          </h2>
          <p className="mt-3 text-stone-400 max-w-lg mx-auto">
            Get your eyes tested at home or at a store near you. Quick, easy, and free.
          </p>
          <Link
            to="/try-at-home"
            className="inline-block mt-8 px-8 py-4 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
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
