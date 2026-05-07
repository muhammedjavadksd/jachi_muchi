import { memo, useMemo, useState, useCallback, useRef } from "react";
import { Footer, WhatsAppButton, PromotionHeader, LensSelectionPanel } from "../../components";
import { Container } from "../../components/Container/Container";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/icons";
import { SAMPLE_PRODUCTS } from "../../lib/constants";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../../api/axios";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  blue: "#1e40af",
  pink: "#ec4899",
  red: "#dc2626",
  green: "#16a34a",
  gold: "#d4a017",
  silver: "#c0c0c0",
  grey: "#6b7280",
  brown: "#8b4513",
  transparent: "#f0f0f0",
  purple: "#7c3aed",
  "rose-gold": "#b76e79",
  gunmetal: "#2c3539",
  white: "#ffffff",
};

export const ProductDetailPage = memo(function ProductDetailPage(): JSX.Element {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [pincode, setPincode] = useState("");
  const [lensPanelOpen, setLensPanelOpen] = useState(false);
const { id } = useParams();

const [product, setProduct] = useState<any>(null);
const [loading, setLoading] = useState(true);



useEffect(() => {
  if (!id) return;

  setLoading(true);

  api.get(`/products/${id}`)
    .then((res) => {
      setProduct(res.data.data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => setLoading(false));

}, [id]);

useEffect(() => {
  setSelectedColorIndex(0);
}, [product]);


const variants = product?.variants || [];

const dynamicColors = variants.length > 0
  ? variants.map((v: any) => ({
      colorCode: COLOR_MAP[v.color?.toLowerCase()] || v.colorCode || "#888888",
      image: product?.images?.length ? product.images[0] : "/placeholder.png",
      name: v.color,
      size: v.size,
      stock: v.stock,
      _id: v._id,
    }))
  : [];

console.log("dynamicColors", dynamicColors);

const selectedVariant = variants.find((v: any) => v.color === dynamicColors[selectedColorIndex]?.name) || variants[0];

const dynamicSpecs = [
  { label: "Product ID", value: product?._id || "N/A" },
  { label: "Brand", value: product?.brand || "N/A" },
  { label: "Category", value: product?.category || "N/A" },
  { label: "Shape", value: product?.shape || "N/A" },
  { label: "Frame Type", value: product?.frameType || "N/A" },
  { label: "Frame Color", value: dynamicColors[selectedColorIndex]?.name || "N/A" },
  ...(product?.description ? [{ label: "Description", value: product.description }] : []),
];

const safeProduct = {
  _id: product?._id || "",
  brand: product?.brand || "",
  name: product?.name || "",
  description: product?.description || "",
  price: product?.price || 0,
  originalPrice: product?.mrp > product?.price ? product.mrp : 0,
  discount: product?.mrp > product?.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
  rating: product?.rating || 0,
  reviews: product?.reviewCount || 0,
  images: product?.images?.length ? product.images : ["/placeholder.png"],
  colors: dynamicColors,
  specs: dynamicSpecs,
};

  const handlePincodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);
  }, []);

  const handleCheckDelivery = useCallback(() => {
    console.log("Checking delivery for pincode:", pincode);
  }, [pincode]);

  const recentlyViewedRef = useRef<HTMLDivElement>(null);
  const relatedProductsRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  }, []);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const handleColorClick = useCallback((index: number) => {
    setSelectedColorIndex(index);
  }, []);



  // Main Product Images as Horizontal Slider on Mobile
  const imageSlider = useMemo(() => (
    <div className="relative">
      <div 
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-1 px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {safeProduct.images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full max-w-[100vw] snap-center bg-white border border-gray-200 rounded-2xl overflow-hidden aspect-square"
          >
            <img
              src={image}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-contain p-6"
              loading="lazy"
            />
            {/* 360° Badge on second image */}
            {index === 1 && (
              <div className="absolute top-6 right-6 flex items-center justify-center w-14 h-14 bg-white border-2 border-teal-600 rounded-2xl cursor-pointer hover:bg-teal-50 transition-colors shadow-md">
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
        ))}
      </div>

      {/* Scroll Indicator Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {safeProduct.images.slice(0, 4).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </div>
  ), [safeProduct.images]);

  // Desktop Image Grid (2x2)
  const imageGrid = useMemo(() => (
    <div className="grid grid-cols-2 gap-4">
      {safeProduct.images.slice(0, 4).map((image, index) => (
        <div
          key={index}
          className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden aspect-square"
        >
          <img
            src={image}
            alt={`Product view ${index + 1}`}
            className="w-full h-full object-contain p-6"
            loading="lazy"
          />
          {index === 1 && (
            <div className="absolute top-4 right-4 flex items-center justify-center w-14 h-14 bg-white border-2 border-teal-600 rounded-2xl cursor-pointer hover:bg-teal-50 transition-colors shadow-sm">
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
      ))}
    </div>
  ), []);

  const colorOptions = useMemo(() => (
    safeProduct.colors.map((color, index) => (
      <button
        key={index}
        type="button"
        title={color.name}
        onClick={() => handleColorClick(index)}
        className={`
          w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
          ${selectedColorIndex === index
            ? "border-black scale-110 shadow-md"
            : "border-gray-300 hover:border-gray-500"}
        `}
        style={{
          backgroundColor: color.colorCode,
        }}
        aria-label={`Select ${color.name}`}
      >
        {selectedColorIndex === index && (
          <div className="w-3 h-3 bg-white rounded-full border border-gray-400" />
        )}
      </button>
    ))
  ), [safeProduct.colors, selectedColorIndex, handleColorClick]);

  const specsTable = useMemo(() => (
    safeProduct.specs.map((spec, index) => (
      <div key={index} className="flex py-3 border-b border-gray-100 last:border-b-0 text-sm">
        <span className="w-40 flex-shrink-0 text-gray-500">{spec.label}</span>
        <span className="text-gray-900 font-medium">{spec.value}</span>
      </div>
    ))
  ), [safeProduct.specs]);

    if (loading) {
  return <div className="p-10 text-center">Loading product...</div>;
}

if (!product) {
  return <div className="p-10 text-center">Product not found</div>;
}

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container className="py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* ====================== IMAGE SECTION ====================== */}
            <div className="lg:w-3/5 xl:w-2/3">
              {/* Mobile: Horizontal Slider */}
              <div className="block lg:hidden">
                {imageSlider}
              </div>

              {/* Desktop & Tablet: 2x2 Grid */}
              <div className="hidden lg:block">
                {imageGrid}
              </div>
            </div>

            {/* ====================== PRODUCT DETAILS ====================== */}
            <div className="lg:w-2/5 xl:w-1/3 lg:sticky lg:top-[160px] lg:self-start">
              {/* Rating */}
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center gap-1 bg-teal-700 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {safeProduct.rating}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
                <span className="text-gray-500 text-sm">
                  {safeProduct.reviews.toLocaleString()} Reviews
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {safeProduct.brand}
              </h1>
              <h2 className="text-lg md:text-xl text-gray-600 mb-2">{safeProduct.name}</h2>
              <p className="text-gray-500 text-sm md:text-base mb-6">{safeProduct.description}</p>

              {/* Price */}
              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹{safeProduct.price}</span>
                {safeProduct.originalPrice > safeProduct.price && (
                  <span className="text-2xl text-gray-400 line-through">₹{safeProduct.originalPrice}</span>
                )}
                {safeProduct.discount > 0 && (
                  <span className="text-green-600 font-bold text-xl">({safeProduct.discount}% OFF)</span>
                )}
              </div>

              {/* Color Selection */}
              {dynamicColors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Select Color</p>
                  <div className="flex items-center gap-4">
                    {colorOptions}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setLensPanelOpen(true)}
                  className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-base transition-colors"
                >
                  SELECT LENS
                </button>

                {/* <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-base transition-colors flex items-center justify-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  TRY ON
                </button> */}
              </div>

              {/* Delivery Check */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Check Delivery Options</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="Enter Pincode"
                    maxLength={6}
                    className="flex-1 px-5 py-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleCheckDelivery}
                    className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
                  >
                    Check
                  </button>
                </div>
              </div>

              <hr className="border-gray-200 my-8" />

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h3>
                <div className="bg-gray-50 rounded-2xl p-5 text-sm">
                  {specsTable}
                </div>
              </div>

              {/* Description */}
              {product?.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* <section className="py-10 bg-white">
          <Container>
            <div className="flex items-center justify-between mb-6 px-4 md:px-0">
              <h2 className="text-xl font-bold text-gray-900">Recently Viewed Products</h2>
              <div className="flex gap-2">
                <button onClick={() => scrollLeft(recentlyViewedRef)} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
                  <ChevronLeftIcon width={20} height={20} />
                </button>
                <button onClick={() => scrollRight(recentlyViewedRef)} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
                  <ChevronRightIcon width={20} height={20} />
                </button>
              </div>
            </div>
          </Container>
          <div ref={recentlyViewedRef} className="flex gap-4 overflow-x-auto pb-6 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory">
            {SAMPLE_PRODUCTS.slice(0, 6).map((product, index) => (
              <div key={index} className="shrink-0 w-[260px] md:w-[280px] snap-start">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </section>

        <section className="py-10 bg-gray-50">
          <Container>
            <div className="flex items-center justify-between mb-6 px-4 md:px-0">
              <h2 className="text-xl font-bold text-gray-900">
                Products Related to {safeProduct.brand}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => scrollLeft(relatedProductsRef)} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
                  <ChevronLeftIcon width={20} height={20} />
                </button>
                <button onClick={() => scrollRight(relatedProductsRef)} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
                  <ChevronRightIcon width={20} height={20} />
                </button>
              </div>
            </div>
          </Container>
          <div ref={relatedProductsRef} className="flex gap-4 overflow-x-auto pb-6 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory">
            {SAMPLE_PRODUCTS.slice(0, 6).map((product, index) => (
              <div key={index} className="shrink-0 w-[260px] md:w-[280px] snap-start">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </section> */}
      </main>

      <Footer />
      <WhatsAppButton />

      <LensSelectionPanel
        isOpen={lensPanelOpen}
        onClose={() => setLensPanelOpen(false)}
        productId={safeProduct._id}
        productName={safeProduct.name}
        productPrice={safeProduct.price}
        productMrp={safeProduct.originalPrice}
        selectedColor={selectedVariant ? { name: selectedVariant.color, id: selectedVariant._id } : undefined}
      />
    </div>
  );
});

ProductDetailPage.displayName = "ProductDetailPage";