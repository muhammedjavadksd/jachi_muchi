import { memo, useMemo, useState, useCallback, useRef } from "react";
import { Footer, WhatsAppButton, PromotionHeader, LensSelectionPanel } from "../../components";
import { Container } from "../../components/Container/Container";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/icons";
import { SAMPLE_PRODUCTS } from "../../lib/constants";
import type { ProductDetail } from "../../types";

const PROMOTION_HEADER_HEIGHT = 140;

const SAMPLE_PRODUCT: ProductDetail = {
  id: "1",
  brand: "Lenskart Air",
  name: "Hustlr | Medium",
  description: "Full Rim Rectangle TR 90 & Metal Eyeglasses",
  price: 1400,
  originalPrice: 2000,
  discount: 30,
  rating: 4.5,
  reviews: 2917,
  images: [
    "/category/image.png",
    "/banner/image.png",
    "/category/image.png",
    "/banner/image.png",
    "/category/image.png",
    "/banner/image.png",
  ],
  colors: [
    { colorCode: "#000000", image: "/category/image.png" },
    { colorCode: "#8b4513", image: "/banner/image.png" },
    { colorCode: "#c0c0c0", image: "/category/image.png" },
  ],
  specs: [
    { label: "Product ID", value: "146481" },
    { label: "Model No", value: "AIR OP E13D1" },
    { label: "Frame Size", value: "Medium" },
    { label: "Frame Width", value: "136 mm" },
    { label: "Frame Dimensions", value: "52-18-145" },
    { label: "Frame Color", value: "Black" },
    { label: "Frame Material", value: "TR 90 & Metal" },
    { label: "Frame Type", value: "Full Rim" },
    { label: "Frame Shape", value: "Rectangle" },
    { label: "Collection", value: "Hustlr" },
  ],
  features: ["Light & Durable", "Adjustable Nose Pads", "Sweat Resistant"],
  longDescription:
    "Stylish full rim rectangle eyeglasses made with premium TR 90 & Metal material. Perfect for everyday wear with excellent durability and comfort.",
  offerBadge: "Buy 1 GET 1 FREE",
};

export const ProductDetailPage = memo(function ProductDetailPage(): JSX.Element {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [pincode, setPincode] = useState("");
<<<<<<< HEAD
  const [mobileImageIndex, setMobileImageIndex] = useState(0);

=======
  const [lensPanelOpen, setLensPanelOpen] = useState(false);
  
  /** Refs for product sliders */
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92
  const recentlyViewedRef = useRef<HTMLDivElement>(null);
  const relatedProductsRef = useRef<HTMLDivElement>(null);

  const handlePincodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
  }, []);

  const handleCheckDelivery = useCallback(() => {
    console.log("Checking delivery for pincode:", pincode);
  }, [pincode]);

  const scrollLeft = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.scrollBy({ left: -240, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.scrollBy({ left: 240, behavior: "smooth" });
  }, []);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const handleColorClick = useCallback((index: number) => {
    setSelectedColorIndex(index);
  }, []);

  /** Mobile image carousel nav */
  const handlePrevImage = useCallback(() => {
    setMobileImageIndex((i) => Math.max(0, i - 1));
  }, []);
  const handleNextImage = useCallback(() => {
    setMobileImageIndex((i) => Math.min(SAMPLE_PRODUCT.images.length - 1, i + 1));
  }, []);

  /** Desktop 2x2 image grid */
  const imageGrid = useMemo(() => (
    SAMPLE_PRODUCT.images.slice(0, 4).map((image, index) => (
      <div
        key={index}
        className="relative bg-white border border-gray-200 rounded-lg overflow-hidden"
      >
        <img
          src={image}
          alt={`Product view ${index + 1}`}
          className="w-full aspect-square object-contain p-4"
          loading="lazy"
        />
        {index === 1 && (
          <div className="absolute top-3 right-3 flex items-center justify-center w-14 h-14 bg-white border-2 border-teal-600 rounded-xl cursor-pointer hover:bg-teal-50 transition-colors">
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M21 12a9 9 0 1 0-9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M21 21v-5h-5" />
              </svg>
              <span className="text-teal-600 text-xs font-bold -mt-1">360°</span>
            </div>
          </div>
        )}
      </div>
    ))
  ), []);

  const colorOptions = useMemo(() => (
    SAMPLE_PRODUCT.colors.map((color, index) => (
      <button
        key={index}
        onClick={() => handleColorClick(index)}
        className={`w-8 h-8 border-2 transition-all ${
          selectedColorIndex === index
            ? "border-gray-800 scale-110"
            : "border-gray-200 hover:border-gray-400"
        }`}
        style={{ backgroundColor: color.colorCode, borderRadius: "3px" }}
        aria-label={`Select color ${index + 1}`}
      />
    ))
  ), [selectedColorIndex, handleColorClick]);

  const specsTable = useMemo(() => (
    SAMPLE_PRODUCT.specs.map((spec, index) => (
      <div key={index} className="flex py-2 border-b border-gray-100 last:border-b-0">
        <span className="w-36 sm:w-40 text-gray-500 text-sm shrink-0">{spec.label}</span>
        <span className="text-gray-900 text-sm font-medium">{spec.value}</span>
      </div>
    ))
  ), []);

  const featuresList = useMemo(() => (
    SAMPLE_PRODUCT.features.map((feature, index) => (
      <div key={index} className="flex items-center gap-2">
        <svg className="w-4 h-4 text-teal-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-gray-700">{feature}</span>
      </div>
    ))
  ), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-4 sm:py-6">
        <Container>

          {/* ── Mobile: stacked layout / Desktop: side-by-side ── */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* ── IMAGE SECTION ── */}

            {/* Mobile: single image carousel */}
            <div className="lg:hidden w-full">
              <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={SAMPLE_PRODUCT.images[mobileImageIndex]}
                  alt={`Product view ${mobileImageIndex + 1}`}
                  className="w-full aspect-square object-contain p-6"
                />
                {/* 360 badge on image index 1 */}
                {mobileImageIndex === 1 && (
                  <div className="absolute top-3 right-3 flex items-center justify-center w-12 h-12 bg-white border-2 border-teal-600 rounded-xl">
                    <div className="flex flex-col items-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M21 12a9 9 0 1 0-9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                        <path d="M21 21v-5h-5" />
                      </svg>
                      <span className="text-teal-600 text-xs font-bold -mt-1">360°</span>
                    </div>
                  </div>
                )}
                {/* Prev / Next arrows */}
                {mobileImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
                  >
                    <ChevronLeftIcon width={16} height={16} />
                  </button>
                )}
                {mobileImageIndex < SAMPLE_PRODUCT.images.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
                  >
                    <ChevronRightIcon width={16} height={16} />
                  </button>
                )}
              </div>
              {/* Dot indicators */}
              <div className="flex justify-center gap-1.5 mt-3">
                {SAMPLE_PRODUCT.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMobileImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === mobileImageIndex ? "bg-teal-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: sticky 2x2 grid */}
            <div className="hidden lg:block lg:w-2/3">
              <div className="grid grid-cols-2 gap-3 sticky top-[160px]">
                {imageGrid}
              </div>
            </div>

            {/* ── PRODUCT DETAILS ── */}
            <div className="w-full lg:w-1/3">

              {/* Rating */}
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-1 bg-teal-700 text-white text-xs font-semibold px-2 py-1 rounded">
                  {SAMPLE_PRODUCT.rating}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
                <span className="text-gray-500 text-sm">{SAMPLE_PRODUCT.reviews.toLocaleString()} Reviews</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{SAMPLE_PRODUCT.brand}</h1>
              <h2 className="text-base sm:text-lg text-gray-600 mb-1">{SAMPLE_PRODUCT.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{SAMPLE_PRODUCT.description}</p>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{SAMPLE_PRODUCT.price}</span>
                {SAMPLE_PRODUCT.originalPrice && (
                  <span className="text-lg sm:text-xl text-gray-400 line-through">₹{SAMPLE_PRODUCT.originalPrice}</span>
                )}
                {SAMPLE_PRODUCT.discount && (
                  <span className="text-green-600 font-semibold text-sm sm:text-base">({SAMPLE_PRODUCT.discount}% OFF)</span>
                )}
              </div>

              {/* Color Selection */}
              <div className="mb-5 sm:mb-6">
                <p className="text-sm text-gray-600 mb-3">Select Color</p>
                <div className="flex items-center gap-3">{colorOptions}</div>
              </div>

<<<<<<< HEAD
              {/* CTA Buttons */}
              <button className="w-full py-3 sm:py-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors mb-3 text-sm sm:text-base">
                SELECT LENS
              </button>
              <button className="w-full py-3 sm:py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors mb-4 flex items-center justify-center gap-2 text-sm sm:text-base">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
=======
              {/* Select Lens Button */}
              <button 
                onClick={() => setLensPanelOpen(true)}
                className="w-full py-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors mb-3"
              >
                SELECT LENS
              </button>

              <LensSelectionPanel
                isOpen={lensPanelOpen}
                onClose={() => setLensPanelOpen(false)}
                productId={SAMPLE_PRODUCT.id}
                productName={SAMPLE_PRODUCT.name}
                productPrice={SAMPLE_PRODUCT.price}
              />

              {/* Try On Button */}
              <button className="w-full py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors mb-4 flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> ecdd40ce813f1fe7225e75df122230a08481fe92
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                TRY ON
              </button>

              {/* Offer Badge */}
              {SAMPLE_PRODUCT.offerBadge && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <svg className="w-5 h-5 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-amber-800 text-sm sm:text-base">{SAMPLE_PRODUCT.offerBadge}</span>
                </div>
              )}

              <hr className="border-gray-200 mb-4" />

              {/* Delivery Check */}
              <div className="mb-5 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Check Delivery Options</h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="Enter Pincode"
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    maxLength={6}
                  />
                  <button
                    onClick={handleCheckDelivery}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-teal-600 font-semibold text-sm hover:bg-teal-50 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Check
                  </button>
                </div>
              </div>

              <hr className="border-gray-200 mb-5 sm:mb-6" />

              {/* Specs */}
              <div className="mb-5 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Technical Information</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">{specsTable}</div>
              </div>

              {/* Features */}
              <div className="mb-5 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="flex flex-wrap gap-3 sm:gap-4">{featuresList}</div>
              </div>

              {/* Description */}
              {SAMPLE_PRODUCT.longDescription && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{SAMPLE_PRODUCT.longDescription}</p>
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* Recently Viewed */}
        <section className="py-8 sm:py-10">
          <Container>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recently Viewed Products</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(recentlyViewedRef)}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeftIcon width={16} height={16} />
                </button>
                <button
                  onClick={() => scrollRight(recentlyViewedRef)}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ChevronRightIcon width={16} height={16} />
                </button>
              </div>
            </div>
          </Container>
          <div
            ref={recentlyViewedRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-8 lg:px-12"
          >
            {SAMPLE_PRODUCTS.slice(0, 6).map((product, index) => (
              <div key={index} className="shrink-0 w-[220px] sm:w-[260px] lg:w-[280px]">
                <ProductCard
                  images={product.images}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  rating={product.rating}
                  reviews={product.reviews}
                  colors={product.colors}
                  link={product.link}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section className="py-8 sm:py-10 bg-gray-50">
          <Container>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-4">
                Products Related to {SAMPLE_PRODUCT.brand}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => scrollLeft(relatedProductsRef)}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeftIcon width={16} height={16} />
                </button>
                <button
                  onClick={() => scrollRight(relatedProductsRef)}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ChevronRightIcon width={16} height={16} />
                </button>
              </div>
            </div>
          </Container>
          <div
            ref={relatedProductsRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-8 lg:px-12"
          >
            {SAMPLE_PRODUCTS.slice(0, 6).map((product, index) => (
              <div key={index} className="shrink-0 w-[220px] sm:w-[260px] lg:w-[280px]">
                <ProductCard
                  images={product.images}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  rating={product.rating}
                  reviews={product.reviews}
                  colors={product.colors}
                  link={product.link}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

ProductDetailPage.displayName = "ProductDetailPage";