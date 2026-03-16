import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

/**
 * About page – company story, quality, variety, value, contact summary, and trust
 */
export const AboutPage = memo(function AboutPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container className="max-w-6xl">

          {/* OUR STORY */}
          <section className="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                OUR STORY
              </h2>
              <div className="mt-8 flex justify-center lg:justify-start">
                <div className="h-48 w-48 sm:h-56 sm:w-56 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400" aria-hidden>
                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                We started with a simple belief: everyone deserves clear vision and great style. Founded with that mission, we set out to make quality eyewear accessible without the usual markups.
              </p>
              <p>
                We introduced our own value-focused range so you could get durable frames and reliable lenses at fair prices. Over the years we’ve grown from a small team to a full operation—including our own manufacturing—so we can control quality from start to finish.
              </p>
              <p>
                Today we serve customers across the country with a wide selection of eyeglasses, sunglasses, and more, all backed by the same commitment to value and clarity we started with.
              </p>
            </div>
          </section>

          {/* GREAT QUALITY */}
          <section className="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center border-t border-gray-100">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                GREAT QUALITY
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Precision by design</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We use advanced machinery and processes to ensure every frame meets strict standards. Precision manufacturing means better fit and longer-lasting eyewear.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">People behind the process</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Technology is only part of the story. Our trained team oversees production at every step, so quality and craftsmanship go hand in hand.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="h-56 w-56 sm:h-64 sm:w-64 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-200" aria-hidden>
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </section>

          {/* VARIETY */}
          <section className="py-12 sm:py-16 border-t border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-10">
              VARIETY
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Something for everyone</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We offer a wide range of styles—hundreds of options for men, women, and kids. Most of our collection is designed and made with care, so you can find the right look and fit.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Designed with care</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    From classic shapes to modern trends, we pay attention to detail so every frame is both functional and stylish.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Always evolving</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We refresh our styles regularly so you can keep up with the latest looks without compromising on quality or value.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-wrap gap-4 justify-center lg:justify-end">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 w-32 sm:h-36 sm:w-36 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400"
                    aria-hidden
                  >
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* VALUE FOR MONEY */}
          <section className="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center border-t border-gray-100">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                VALUE FOR MONEY
              </h2>
              <div className="space-y-6">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Great eyewear doesn’t have to cost a fortune. We focus on fair pricing so you get durable frames and reliable lenses without paying for unnecessary markups.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  By designing and manufacturing in-house and selling directly to you, we cut out the middlemen. You get better value and we keep our promise of quality at a sensible price.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="h-48 w-64 sm:h-56 sm:w-72 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-200" aria-hidden>
                <span className="text-4xl sm:text-5xl font-bold tracking-tighter text-amber-300/80">VALUE</span>
              </div>
            </div>
          </section>

          {/* CONTACT US */}
          <section className="py-12 sm:py-16 border-t border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-8">
              CONTACT US
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">Company</p>
                <p className="text-gray-800">Eyewear Co.</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">Email</p>
                <a href="mailto:support@example.com" className="text-teal-600 hover:text-teal-700">support@example.com</a>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">Phone</p>
                <a href="tel:0000000000" className="text-gray-800 hover:text-teal-600">00000 00000</a>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">Address</p>
                <p className="text-gray-800">Plot No. XX, Industrial Area, Phase II, New Delhi – 110020</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">Country</p>
                <p className="text-gray-800">India</p>
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
              >
                Full contact options
                <span aria-hidden>→</span>
              </Link>
            </div>
          </section>

          {/* TRUST */}
          <section className="py-12 sm:py-16 border-t border-gray-200 bg-gray-50 -mx-[48px] px-[48px] sm:-mx-12 sm:px-12 lg:-mx-16 lg:px-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-center mb-10">
              TRUST
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">14-day easy returns</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Not happy with your order? Return or exchange within 14 days in line with our policy. We make it straightforward so you can shop with confidence.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1-year warranty</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our frames are covered by a one-year warranty against manufacturing defects. Quality is at the heart of what we do.
                </p>
              </div>
            </div>
          </section>

        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

AboutPage.displayName = "AboutPage";
