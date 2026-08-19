import { memo, useMemo, useCallback } from "react";
import { Footer, WhatsAppButton, PromotionHeader, LensSelectionPanel, ProductReviews } from "@/components";
import { SimilarProducts } from "@/features/product/components/SimilarProducts/SimilarProducts";
import { ProductImageViewer } from "@/features/product/components/ProductImageViewer/ProductImageViewer";
import { Container } from "@/shared/components/Container/Container";
import { useProductDetail } from "@/features/product/hooks";

const PROMOTION_HEADER_HEIGHT = 140;

function StarIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}

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
        <span className="w-40 shrink-0 text-gray-500">{spec.label}</span>
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
                <button onClick={openLensPanel} className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-base transition-colors">SELECT LENS</button>
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
                              {getOfferLabel(offer)}
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
                <button onClick={toggleTech} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-lg font-semibold text-gray-900">Technical Information</span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${techOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {techOpen && (
                  <div className="px-5 pb-5 text-sm animate-[fadeIn_0.2s_ease-out]">{specsTable}</div>
                )}
              </div>

            </div>
          </div>
        </Container>

        <div className="border-t border-gray-200 my-8" />
        <Container className="pb-8">
          <SimilarProducts productId={product?._id} />
        </Container>
        <div className="border-t border-gray-200 my-8" />
        <Container className="pb-12">
          <ProductReviews productId={id} />
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
