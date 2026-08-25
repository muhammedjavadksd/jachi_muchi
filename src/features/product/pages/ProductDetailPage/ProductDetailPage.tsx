import { memo, useMemo } from "react";
import { Footer, WhatsAppButton, PromotionHeader, LensSelectionPanel, ProductReviews, StarRating } from "@/components";
import { SimilarProducts } from "@/features/product/components/SimilarProducts/SimilarProducts";
import { ProductImageViewer } from "@/features/product/components/ProductImageViewer/ProductImageViewer";
import { Container, Price } from "@/shared/components";
import { useProductDetail } from "@/features/product/hooks";

const PROMOTION_HEADER_HEIGHT = 140;

export const ProductDetailPage = memo(function ProductDetailPage(): JSX.Element {
  const {
    id,
    product,
    loading,
    offers,
    safeProduct,
    selectedColorIndex,
    currentImageIndex,
    techOpen,
    lensPanelOpen,
    dynamicColors,
    selectedVariant,
    handleColorClick,
    goToNext,
    goToPrev,
    goToImage,
    toggleTech,
    openLensPanel,
    closeLensPanel,
    getProductOffers,
    calculateOfferDiscount,
    getOfferLabel,
  } = useProductDetail();

  const spacerStyle = useMemo(() => ({ height: PROMOTION_HEADER_HEIGHT }), []);

  if (loading) return <div className="p-10 text-center">Loading product...</div>;
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1">
        <Container className="py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-3/5 xl:w-2/3">
              {/* [HIDDEN] rotation360Images prop — uncomment to restore 360° */}
              <ProductImageViewer
                images={safeProduct.images}
                productName={safeProduct.name}
                currentImageIndex={currentImageIndex}
                onImageChange={goToImage}
                onGoPrev={goToPrev}
                onGoNext={goToNext}
                productId={safeProduct._id}
              />
            </div>
            <div className="lg:w-2/5 xl:w-1/3 lg:sticky lg:top-40">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{safeProduct.name}</h1>
              {safeProduct.description && (
                <p className="text-gray-500 text-sm mb-4">{safeProduct.description}</p>
              )}

              <div className="flex items-center gap-2 mb-4">
                <StarRating value={safeProduct.ratingAverage} readOnly size="sm" />
                <span className="text-sm font-semibold text-gray-900">
                  {safeProduct.ratingAverage.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">
                  ({safeProduct.ratingCount.toLocaleString()} Reviews)
                </span>
              </div>
              <hr className="border-gray-200 mb-5" />

              <div className="flex items-center gap-3 mb-6">
                <Price
                  value={safeProduct.price}
                  originalValue={safeProduct.originalPrice > safeProduct.price ? safeProduct.originalPrice : undefined}
                  discount={safeProduct.discount > 0 ? safeProduct.discount : undefined}
                  size="3xl"
                />
              </div>

              {dynamicColors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Select Color</p>
                  <div className="flex items-center gap-3">
                    {dynamicColors.map((color, i) => (
                      <button
                        key={i}
                        type="button"
                        title={color.name}
                        onClick={() => handleColorClick(i)}
                        className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                          selectedColorIndex === i
                            ? "ring-2 ring-offset-2 ring-teal-600 scale-110"
                            : "ring-1 ring-gray-200 hover:ring-gray-400"
                        }`}
                        style={{ backgroundColor: color.colorCode }}
                        aria-label={`Select ${color.name}`}
                      >
                        {selectedColorIndex === i && (
                          <div className="w-3 h-3 bg-white rounded-full border border-gray-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {offers.length > 0 && id && getProductOffers(id, offers).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Available Offers</h3>
                  <div className="space-y-2">
                    {getProductOffers(id, offers).map((offer) => {
                      const offerDiscount = calculateOfferDiscount(id, safeProduct.price, [offer]);
                      return (
                        <div key={offer._id} className="flex items-start gap-3 p-3 rounded-xl border border-dashed" style={{ borderColor: "#0d5c5c33", backgroundColor: "#0d5c5c08" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: "#0d5c5c" }}>%</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{offer.offerName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {getOfferLabel(offer)}
                              {offerDiscount > 0 && <span className="text-teal-600 font-medium"> · Save <Price value={offerDiscount} size="xs" className="text-teal-600 font-medium" /></span>}
                            </p>
                            {offer.couponCode && <span className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded border border-teal-200">Use code: {offer.couponCode}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={toggleTech} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-base font-semibold text-[#0d4f4a]">Technical Information</span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${techOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {techOpen && (
                  <div className="px-5 pb-4 animate-[fadeIn_0.2s_ease-out]">
                    {safeProduct.specs.map((spec, i) => {
                      const icons: Record<string, JSX.Element> = {
                        Brand: (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d4f4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="6" cy="14" r="3" /><circle cx="18" cy="14" r="3" /><path d="M10 14h4" /><path d="M2 14V9" /><path d="M22 14V9" />
                          </svg>
                        ),
                        Category: (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d4f4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                          </svg>
                        ),
                        Shape: (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d4f4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        ),
                        "Frame Type": (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d4f4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="6" cy="14" r="3" /><circle cx="18" cy="14" r="3" /><path d="M10 14h4" /><path d="M2 14V9" /><path d="M22 14V9" />
                          </svg>
                        ),
                        "Frame Color": (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d4f4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="12" r="2.5" /><circle cx="12" cy="18" r="2.5" />
                          </svg>
                        ),
                      };
                      return (
                        <div key={i} className={`flex items-center gap-3 py-3 ${i < safeProduct.specs.length - 1 ? "border-b border-gray-100" : ""}`}>
                          <span className="shrink-0">{icons[spec.label] || (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                            </svg>
                          )}</span>
                          <span className="text-gray-500 text-sm flex-1">{spec.label}</span>
                          <span className="text-gray-900 text-sm font-medium">{spec.value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={openLensPanel}
                className="w-full flex items-center justify-between gap-3 py-3.5 px-5 bg-[#0d4f4a] hover:bg-[#0a3d38] text-white font-bold text-sm uppercase tracking-wide rounded-lg transition-colors mt-6"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="14" r="4" />
                  <circle cx="18" cy="14" r="4" />
                  <path d="M10 14h4" />
                  <path d="M2 14V8" />
                  <path d="M22 14V8" />
                </svg>
                <span className="flex-1 text-center">Select Lens</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </Container>

        <div className="border-t border-gray-200 my-8" />
        <Container className="pb-8">
          <SimilarProducts productId={product?._id} />
        </Container>
        <div className="border-t border-gray-200 my-8" />
        <Container className="pb-12">
          <ProductReviews
            key={id}
            productId={id}
            ratingAverage={safeProduct.ratingAverage}
            ratingCount={safeProduct.ratingCount}
          />
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
      <LensSelectionPanel
        isOpen={lensPanelOpen}
        onClose={closeLensPanel}
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
