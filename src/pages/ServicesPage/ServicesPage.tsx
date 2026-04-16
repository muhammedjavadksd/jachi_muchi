import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

const PLACEHOLDER_IMAGE = "/category/image.png";

const SERVICE_SECTIONS: {
  id: string;
  title: string;
  highlight?: string;
  description: string;
  link: string;
  imageFirst: boolean;
}[] = [
  {
    id: "customer-guarantees",
    title: "Customer Guarantees",
    highlight: "1-YEAR FREE WARRANTY",
    description:
      "We stand behind the quality of our frames and lenses. Our warranty covers manufacturing defects so you can shop with confidence. Our team is here to help with any concerns.",
    link: "/warranty",
    imageFirst: true,
  },
  {
    id: "lens-guide",
    title: "Lens Guide",
    description:
      "Learn about lens types, materials, and coatings. From single vision to progressives, blue-light filter to anti-reflective—find the right lens for your lifestyle and prescription.",
    link: "/faq",
    imageFirst: false,
  },
  {
    id: "care",
    title: "Care+",
    description:
      "Get more from your eyewear with our care programme. Enjoy benefits like priority support, lens care tips, and exclusive offers. Designed to keep your glasses in great shape.",
    link: "/account",
    imageFirst: true,
  },
  {
    id: "lens-replacement",
    title: "Lens Replacement",
    highlight: "Replacement lenses from ₹999",
    description:
      "Need new lenses in your current frame? We offer lens replacement for most frames. Choose from a range of options and get your glasses updated quickly and affordably.",
    link: "/contact",
    imageFirst: false,
  },
  {
    id: "snap",
    title: "SNAP Series",
    description:
      "Discover our SNAP series—versatile frames that adapt to your look. Perfect for those who want one frame that works for multiple occasions.",
    link: "/collections",
    imageFirst: true,
  },
  {
    id: "shops",
    title: "Shops",
    description:
      "Visit us in store for a personalised fitting, expert advice, and to try on frames. Find your nearest location and experience our full range of services.",
    link: "/store-locator",
    imageFirst: false,
  },
  {
    id: "staff",
    title: "Staff",
    description:
      "Our trained staff are here to help you find the perfect fit and style. From frame selection to adjustments, we’re committed to making your experience smooth and enjoyable.",
    link: "/contact",
    imageFirst: true,
  },
];

/**
 * Services page – hero plus alternating image/text blocks with READ MORE
 */
export const ServicesPage = memo(function ServicesPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container className="max-w-6xl">
          {/* Breadcrumb */}
          <nav className="py-3 sm:py-4 text-xs sm:text-sm text-gray-500 border-b border-gray-100" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 sm:gap-2">
              <li>
                <Link to="/" className="hover:text-teal-600 transition-colors">
                  Homepage
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-gray-900 font-medium" aria-current="page">
                Services
              </li>
            </ol>
          </nav>

          {/* Hero section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center py-8 sm:py-10 lg:py-16">
            <div className="order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Services
              </h1>
              <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
                From expert fittings and warranty support to lens guides and care programmes, we offer a full range of services to keep your vision clear and your glasses in great shape.
              </p>
              <Link
                to="#customer-guarantees"
                className="inline-flex items-center gap-2 mt-4 sm:mt-6 text-sm sm:text-base text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                Read more
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="order-1 lg:order-2 aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
              <img
                src={PLACEHOLDER_IMAGE}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* Service blocks – alternating image / text */}
          {SERVICE_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center py-8 sm:py-10 lg:py-16 border-t border-gray-100"
            >
              {section.imageFirst ? (
                <>
                  <div className="aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={PLACEHOLDER_IMAGE}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                      {section.title}
                    </h2>
                    {section.highlight && (
                      <p className="mt-2 text-red-600 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                        {section.highlight}
                      </p>
                    )}
                    <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                      {section.description}
                    </p>
                    <Link
                      to={section.link}
                      className="inline-flex items-center gap-2 mt-4 sm:mt-5 text-sm sm:text-base text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                    >
                      Read more
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                      {section.title}
                    </h2>
                    {section.highlight && (
                      <p className="mt-2 text-red-600 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                        {section.highlight}
                      </p>
                    )}
                    <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                      {section.description}
                    </p>
                    <Link
                      to={section.link}
                      className="inline-flex items-center gap-2 mt-4 sm:mt-5 text-sm sm:text-base text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                    >
                      Read more
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                  <div className="aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={PLACEHOLDER_IMAGE}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              )}
            </section>
          ))}
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

ServicesPage.displayName = "ServicesPage";
