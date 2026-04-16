import { memo, useMemo, useState, useCallback, useRef } from "react";
import { Footer, WhatsAppButton, PromotionHeader, LensSelectionPanel } from "../../components";
import { Container } from "../../components/Container/Container";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/icons";
import { SAMPLE_PRODUCTS } from "../../lib/constants";
import type { ProductDetail } from "../../types";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Sample product data - in real app this would come from API/props */
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
  features: [
    "Light & Durable",
    "Adjustable Nose Pads",
    "Sweat Resistant",
  ],
  longDescription: "Stylish full rim rectangle eyeglasses made with premium TR 90 & Metal material. Perfect for everyday wear with excellent durability and comfort.",
  offerBadge: "Buy 1 GET 1 FREE",
};

/**
 * Product Detail Page
 * Displays full product information with image gallery, specs, and purchase options
 */
export const ProductDetailPage = memo(function ProductDetailPage(): JSX.Element {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [pincode, setPincode] = useState("");
  const [lensPanelOpen, setLensPanelOpen] = useState(false);
  
  /** Refs for product sliders */
  const recentlyViewedRef = useRef<HTMLDivElement>(null);
  const relatedProductsRef = useRef<HTMLDivElement>(null);

  /** Handle pincode input change */
  const handlePincodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
  }, []);

  /** Handle check delivery */
  const handleCheckDelivery = useCallback(() => {
    console.log("Checking delivery for pincode:", pincode);
    // Delivery check logic here
  }, [pincode]);

  /** Scroll slider left */
  const scrollLeft = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  }, []);

  /** Scroll slider right */
  const scrollRight = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  }, []);

  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Handle color selection */
  const handleColorClick = useCallback((index: number) => {
    setSelectedColorIndex(index);
  }, []);

  /** Memoize image grid - 2x2 layout */
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
        {/* 360° Badge on second image */}
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

  /** Memoize color options */
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
        style={{
          backgroundColor: color.colorCode,
          borderRadius: "3px"
        }}
        aria-label={`Select color ${index + 1}`}
      />
    ))
  ), [selectedColorIndex, handleColorClick]);

  /** Memoize specs table */
  const specsTable = useMemo(() => (
    SAMPLE_PRODUCT.specs.map((spec, index) => (
      <div key={index} className="flex py-2 border-b border-gray-100 last:border-b-0">
        <span className="w-40 text-gray-500 text-sm">{spec.label}</span>
        <span className="text-gray-900 text-sm font-medium">{spec.value}</span>
      </div>
    ))
  ), []);

  /** Memoize features list */
  const featuresList = useMemo(() => (
    SAMPLE_PRODUCT.features.map((feature, index) => (
      <div key={index} className="flex items-center gap-2">
        <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-gray-700">{feature}</span>
      </div>
    ))
  ), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Promotion Header */}
      <PromotionHeader />
      
      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-6">
        <Container>
          <div className="flex gap-8">
            {/* Left: Image Gallery - 2x2 Grid (2/3 width) */}
            <div className="w-2/3">
              <div className="grid grid-cols-2 gap-3 sticky top-[160px]">
                {imageGrid}
              </div>
            </div>

            {/* Right: Product Details (1/3 width) */}
            <div className="w-1/3">
              {/* Brand and Rating */}
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-1 bg-teal-700 text-white text-xs font-semibold px-2 py-1 rounded">
                  {SAMPLE_PRODUCT.rating}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
                <span className="text-gray-500 text-sm">{SAMPLE_PRODUCT.reviews.toLocaleString()} Reviews</span>
              </div>

              {/* Brand Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{SAMPLE_PRODUCT.brand}</h1>
              
              {/* Product Name */}
              <h2 className="text-lg text-gray-600 mb-1">{SAMPLE_PRODUCT.name}</h2>
              
              {/* Description */}
              <p className="text-gray-500 text-sm mb-4">{SAMPLE_PRODUCT.description}</p>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{SAMPLE_PRODUCT.price}</span>
                {SAMPLE_PRODUCT.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">₹{SAMPLE_PRODUCT.originalPrice}</span>
                )}
                {SAMPLE_PRODUCT.discount && (
                  <span className="text-green-600 font-semibold">({SAMPLE_PRODUCT.discount}% OFF)</span>
                )}
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Select Color</p>
                <div className="flex items-center gap-3">
                  {colorOptions}
                </div>
              </div>

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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                TRY ON
              </button>

              {/* Offer Badge */}
              {SAMPLE_PRODUCT.offerBadge && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-amber-800">{SAMPLE_PRODUCT.offerBadge}</span>
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-200 mb-4" />

              {/* Check Delivery Options */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Check Delivery Options</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="Enter Pincode"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    maxLength={6}
                  />
                  <button
                    onClick={handleCheckDelivery}
                    className="px-6 py-3 text-teal-600 font-semibold text-sm hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    Check
                  </button>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-6" />

              {/* Product Specifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {specsTable}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="flex flex-wrap gap-4">
                  {featuresList}
                </div>
              </div>

              {/* Long Description */}
              {SAMPLE_PRODUCT.longDescription && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {SAMPLE_PRODUCT.longDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* Recently Viewed Products */}
        <section className="py-10">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recently Viewed Products</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(recentlyViewedRef)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  aria-label="Previous products"
                >
                  <ChevronLeftIcon width={20} height={20} />
                </button>
                <button
                  onClick={() => scrollRight(recentlyViewedRef)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  aria-label="Next products"
                >
                  <ChevronRightIcon width={20} height={20} />
                </button>
              </div>
            </div>
          </Container>
          <div 
            ref={recentlyViewedRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pl-12"
          >
            {SAMPLE_PRODUCTS.slice(0, 6).map((product, index) => (
              <div key={index} className="shrink-0 w-[280px]">
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
        <section className="py-10 bg-gray-50">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Products Related to {SAMPLE_PRODUCT.brand}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(relatedProductsRef)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  aria-label="Previous products"
                >
                  <ChevronLeftIcon width={20} height={20} />
                </button>
                <button
                  onClick={() => scrollRight(relatedProductsRef)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  aria-label="Next products"
                >
                  <ChevronRightIcon width={20} height={20} />
                </button>
              </div>
            </div>
          </Container>
          <div 
            ref={relatedProductsRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pl-12"
          >
            {SAMPLE_PRODUCTS.slice(0, 6).map((product, index) => (
              <div key={index} className="shrink-0 w-[280px]">
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

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
});

ProductDetailPage.displayName = "ProductDetailPage";
