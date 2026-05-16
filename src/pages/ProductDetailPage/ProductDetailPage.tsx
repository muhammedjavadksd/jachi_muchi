import { memo, useMemo, useState, useCallback } from "react";
import { Footer, WhatsAppButton, PromotionHeader, LensSelectionPanel, SimilarProducts, ProductReviews } from "../../components";
import { Container } from "../../components/Container/Container";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../../api/axios";
import { getOffers, getProductOffers, calculateOfferDiscount } from "../../lib/offerEngine";
import { getImageUrl } from "../../lib/image";
import type { Offer } from "../../types/offers.types";

const PROMOTION_HEADER_HEIGHT = 140;
const FALLBACK_IMG = "https://placehold.co/400x300?text=No+Image";

const COLOR_MAP: Record<string, string> = {
  black: "#000000", blue: "#1e40af", pink: "#ec4899", red: "#dc2626",
  green: "#16a34a", gold: "#d4a017", silver: "#c0c0c0", grey: "#6b7280",
  brown: "#8b4513", transparent: "#f0f0f0", purple: "#7c3aed",
  "rose-gold": "#b76e79", gunmetal: "#2c3539", white: "#ffffff",
};

function ChevronLeft() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>;
}

function ChevronRight() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>;
}

function StarIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}

function Badge360() {
  return (
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
  );
}

const OFFER_LABEL: Record<string, (o: Offer) => string> = {
  percentage: (o) => `${o.discountValue}% off`,
  flat: (o) => `₹${o.discountValue} off`,
  bogo: (o) => `Buy ${o.buyQuantity || 1} Get ${o.getQuantity || 1}`,
};

export const ProductDetailPage = memo(function ProductDetailPage(): JSX.Element {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [techOpen, setTechOpen] = useState(false);
  const [lensPanelOpen, setLensPanelOpen] = useState(false);
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOffers().then(setOffers).catch(() => {});
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setSelectedColorIndex(0);
    setCurrentImageIndex(0);
  }, [product]);

  const variants = product?.variants || [];

  const dynamicColors = variants.length > 0
    ? variants.map((v: any) => ({
      colorCode: COLOR_MAP[v.color?.toLowerCase()] || v.colorCode || "#888888",
      image: getImageUrl(product?.images?.[0]),
      name: v.color, size: v.size, stock: v.stock, _id: v._id,
    }))
    : [];

  const selectedVariant = variants.find((v: any) => v.color === dynamicColors[selectedColorIndex]?.name) || variants[0];

  const dynamicSpecs = [
    { label: "Product ID", value: product?._id || "N/A" },
    { label: "Brand", value: product?.brand?.name || product?.brand || "N/A" },
    { label: "Category", value: product?.category?.name || product?.category || "N/A" },
    { label: "Shape", value: product?.shape || "N/A" },
    { label: "Frame Type", value: product?.frameType || "N/A" },
    { label: "Frame Color", value: dynamicColors[selectedColorIndex]?.name || "N/A" },
    ...(product?.description ? [{ label: "Description", value: product.description }] : []),
  ];

  const safeProduct = useMemo(() => ({
    _id: product?._id || "",
    brand: product?.brand?.name || product?.brand || "",
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    originalPrice: product?.mrp > product?.price ? product.mrp : 0,
    discount: product?.mrp > product?.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
    rating: product?.rating || 0,
    reviews: product?.reviewCount || 0,
    images: product?.images?.length ? product.images.map((img: string) => getImageUrl(img)) : ["/placeholder.png"],
    colors: dynamicColors,
    specs: dynamicSpecs,
  }), [product, dynamicColors, dynamicSpecs]);

  const handleColorClick = useCallback((index: number) => setSelectedColorIndex(index), []);

  const goToNext = useCallback(() => setCurrentImageIndex(p => (p + 1) % safeProduct.images.length), [safeProduct.images.length]);
  const goToPrev = useCallback(() => setCurrentImageIndex(p => (p - 1 + safeProduct.images.length) % safeProduct.images.length), [safeProduct.images.length]);
  const goToImage = useCallback((index: number) => setCurrentImageIndex(index), []);

  const spacerStyle = useMemo(() => ({ height: PROMOTION_HEADER_HEIGHT }), []);

  const imageCarousel = useMemo(() => {
    if (!safeProduct.images.length) return null;
    const hasMultiple = safeProduct.images.length > 1;
    return (
      <div className="relative">
        <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden aspect-square">
          <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
            {safeProduct.images.map((image, i) => (
              <div key={i} className="min-w-full h-full flex items-center justify-center p-6">
                <img src={image} alt={`Product view ${i + 1}`} className="w-full h-full object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
              </div>
            ))}
          </div>
          {currentImageIndex === 1 && <Badge360 />}
          {hasMultiple && (
            <>
              <button onClick={goToPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all active:scale-90" aria-label="Previous image"><ChevronLeft /></button>
              <button onClick={goToNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all active:scale-90" aria-label="Next image"><ChevronRight /></button>
            </>
          )}
        </div>
        {hasMultiple && (
          <>
            <div className="flex justify-center gap-2 mt-4">
              {safeProduct.images.map((_, i) => (
                <button key={i} onClick={() => goToImage(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? "bg-teal-700 w-6" : "bg-gray-300 hover:bg-gray-400"}`} />
              ))}
            </div>
            <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide pb-2">
              {safeProduct.images.map((image, i) => (
                <button key={i} onClick={() => goToImage(i)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === currentImageIndex ? "border-teal-700 shadow-md opacity-100" : "border-gray-200 opacity-60 hover:opacity-90"}`}>
                  <img src={image} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-contain p-1.5 bg-gray-50" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }, [safeProduct.images, currentImageIndex, goToNext, goToPrev, goToImage]);

  const colorOptions = useMemo(() =>
    safeProduct.colors.map((color, i) => (
      <button key={i} type="button" title={color.name} onClick={() => handleColorClick(i)}
        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColorIndex === i ? "border-black scale-110 shadow-md" : "border-gray-300 hover:border-gray-500"}`}
        style={{ backgroundColor: color.colorCode }} aria-label={`Select ${color.name}`}
      >
        {selectedColorIndex === i && <div className="w-3 h-3 bg-white rounded-full border border-gray-400" />}
      </button>
    ))
  , [safeProduct.colors, selectedColorIndex, handleColorClick]);

  const specsTable = useMemo(() =>
    safeProduct.specs.map((spec, i) => (
      <div key={i} className="flex py-3 border-b border-gray-100 last:border-b-0 text-sm">
        <span className="w-40 flex-shrink-0 text-gray-500">{spec.label}</span>
        <span className="text-gray-900 font-medium">{spec.value}</span>
      </div>
    ))
  , [safeProduct.specs]);

  if (loading) return <div className="p-10 text-center">Loading product...</div>;
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1">
        <Container className="py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-3/5 xl:w-2/3">{imageCarousel}</div>
            <div className="lg:w-2/5 xl:w-1/3 lg:sticky lg:top-[160px] lg:self-start">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center gap-1 bg-teal-700 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {safeProduct.rating} <StarIcon />
                </span>
                <span className="text-gray-500 text-sm">{safeProduct.reviews.toLocaleString()} Reviews</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{safeProduct.brand}</h1>
              <h2 className="text-lg md:text-xl text-gray-600 mb-2">{safeProduct.name}</h2>
              <p className="text-gray-500 text-sm md:text-base mb-6">{safeProduct.description}</p>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹{safeProduct.price}</span>
                {safeProduct.originalPrice > safeProduct.price && <span className="text-2xl text-gray-400 line-through">₹{safeProduct.originalPrice}</span>}
                {safeProduct.discount > 0 && <span className="text-green-600 font-bold text-xl">({safeProduct.discount}% OFF)</span>}
              </div>
              {dynamicColors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Select Color</p>
                  <div className="flex items-center gap-4">{colorOptions}</div>
                </div>
              )}
              <div className="space-y-3 mb-8">
                <button onClick={() => setLensPanelOpen(true)} className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-base transition-colors">SELECT LENS</button>
              </div>
              {offers.length > 0 && id && getProductOffers(id, offers).length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3">Available Offers</h3>
                  <div className="space-y-2">
                    {getProductOffers(id, offers).map((offer) => {
                      const offerDiscount = calculateOfferDiscount(id, safeProduct.price, [offer]);
                      return (
                        <div key={offer._id} className="flex items-start gap-3 p-3 rounded-xl border border-dashed" style={{ borderColor: "#0d5c5c33", backgroundColor: "#0d5c5c08" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: "#0d5c5c" }}>%</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{offer.offerName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {(OFFER_LABEL[offer.offerType] || ((_o: Offer) => "Special offer"))(offer)}
                              {offerDiscount > 0 && <span className="text-teal-600 font-medium"> · Save ₹{Math.round(offerDiscount)}</span>}
                            </p>
                            {offer.couponCode && <span className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded border border-teal-200">Use code: {offer.couponCode}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <hr className="border-gray-200 my-8" />
              <div className="mb-8 border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setTechOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">Technical Information</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${techOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {techOpen && (
                  <div className="px-5 pb-5 text-sm animate-[fadeIn_0.2s_ease-out]">{specsTable}</div>
                )}
              </div>
              {product?.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </Container>

        <div className="border-t border-gray-200 my-8" />

        <Container className="pb-8">
          <SimilarProducts productId={product?._id} />
        </Container>

        <div className="border-t border-gray-200 my-8" />

        <Container className="pb-12">
          <ProductReviews />
        </Container>
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
        productImage={safeProduct.images[0]}
        selectedColor={selectedVariant ? { name: selectedVariant.color, id: selectedVariant._id } : undefined}
      />
    </div>
  );
});

ProductDetailPage.displayName = "ProductDetailPage";