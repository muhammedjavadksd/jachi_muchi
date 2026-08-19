import { memo, useMemo, useCallback, useRef } from "react";
// import { Link } from "react-router-dom"; // [HIDDEN] Commented out — Nearby Stores button removed; uncomment to restore
// import { Viewer360 } from "@/features/product/components/Viewer360/Viewer360"; // [HIDDEN] Commented out — 360° modal removed; uncomment to restore

const FALLBACK_IMG = "https://placehold.co/400x300?text=No+Image";

interface ProductImageViewerProps {
  images: string[];
  // rotation360Images?: string[]; // [HIDDEN] Commented out — 360° removed; uncomment to restore
  productName: string;
  currentImageIndex: number;
  onImageChange: (index: number) => void;
  onGoPrev: () => void;
  onGoNext: () => void;
  productId: string;
  onSimilarClick?: () => void;
}

// [HIDDEN] StoreIcon — uncomment to restore "Nearby Stores" button
// function StoreIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//       <polyline points="9 22 9 12 15 12 15 22" />
//     </svg>
//   );
// }

// [HIDDEN] RotateCwIcon — uncomment to restore 360° button
// function RotateCwIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//       <path d="M3 3v5h5" />
//     </svg>
//   );
// }

// [HIDDEN] Try On button — uncomment to restore
// function GlassesIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="6" cy="14" r="4" />
//       <circle cx="18" cy="14" r="4" />
//       <path d="M10 14h4" />
//       <path d="M2 14V8" />
//       <path d="M22 14V8" />
//     </svg>
//   );
// }

// [HIDDEN] Similar button — uncomment to restore
// function GridIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="3" y="3" width="7" height="7" />
//       <rect x="14" y="3" width="7" height="7" />
//       <rect x="3" y="14" width="7" height="7" />
//       <rect x="14" y="14" width="7" height="7" />
//     </svg>
//   );
// }

export const ProductImageViewer = memo(function ProductImageViewer({
  images,
  // rotation360Images = [], // [HIDDEN] Commented out — 360° removed; uncomment to restore
  productName,
  currentImageIndex,
  onImageChange,
  onGoPrev,
  onGoNext,
  productId,
  onSimilarClick,
}: ProductImageViewerProps): JSX.Element {
  // [HIDDEN] 360° modal state — uncomment to restore
  // const [viewer360Open, setViewer360Open] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const hasMultiple = images.length > 1;
  // const has360Images = rotation360Images.length > 0; // [HIDDEN] Commented out — 360° removed; uncomment to restore

  const handleThumbClick = useCallback((index: number) => {
    onImageChange(index);
  }, [onImageChange]);

  // [HIDDEN] 360° handlers — uncomment to restore
  // const open360 = useCallback(() => setViewer360Open(true), []);
  // const close360 = useCallback(() => setViewer360Open(false), []);

  // [HIDDEN] 360° escape key + scroll lock — uncomment to restore
  // useEffect(() => {
  //   if (!viewer360Open) return;
  //   const handleEsc = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") close360();
  //   };
  //   document.addEventListener("keydown", handleEsc);
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.removeEventListener("keydown", handleEsc);
  //     document.body.style.overflow = "";
  //   };
  // }, [viewer360Open, close360]);

  // [HIDDEN] Similar scroll — uncomment to restore
  // const handleSimilarClick = useCallback(() => {
  //   if (onSimilarClick) {
  //     onSimilarClick();
  //   } else {
  //     document.getElementById("similar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  // }, [onSimilarClick]);

  const thumbnailStrip = useMemo(() => {
    if (images.length <= 1) return null;
    return (
      <div ref={thumbsRef} className="flex flex-col gap-2 overflow-y-auto max-h-[480px] pr-1 scrollbar-thin">
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => handleThumbClick(i)}
            className={`shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              i === currentImageIndex
                ? "border-teal-600 shadow-md opacity-100"
                : "border-gray-200 opacity-50 hover:opacity-80 hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`${productName} view ${i + 1}`}
              className="max-w-full max-h-full object-contain object-center bg-white"
            />
          </button>
        ))}
      </div>
    );
  }, [images, currentImageIndex, productName, handleThumbClick]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        {images.length > 1 && (
          <div className="hidden md:flex flex-col">
            {thumbnailStrip}
          </div>
        )}

        <div className="flex-1 relative bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
          <div className="relative w-full aspect-[4/3]">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={images[currentImageIndex] || FALLBACK_IMG}
                alt={`${productName} - view ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain object-center"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
              />
            </div>
          </div>

          {hasMultiple && (
            <>
              <button
                onClick={onGoPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all active:scale-90 z-10"
                aria-label="Previous image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                onClick={onGoNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all active:scale-90 z-10"
                aria-label="Next image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </>
          )}

          {hasMultiple && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onImageChange(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? "bg-teal-700 w-5" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex md:hidden gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => handleThumbClick(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentImageIndex
                  ? "border-teal-600 shadow-md opacity-100"
                  : "border-gray-200 opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumb ${i + 1}`}
                className="max-w-full max-h-full object-contain object-center bg-white"
              />
            </button>
          ))}
        </div>
      )}

      {/* [HIDDEN] Action row with "Nearby Stores" and "360°" buttons — uncomment to restore */}
      {/* <div className="flex items-center justify-center gap-3 mt-4">
        <Link
          to="/stores"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <StoreIcon />
          Nearby Stores
        </Link>
        <button
          onClick={open360}
          title={has360Images ? "360° View" : "360° view coming soon"}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
            has360Images
              ? "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              : "border-gray-200 text-gray-300 cursor-default"
          }`}
        >
          <RotateCwIcon />
          360°
        </button>
        {/* [HIDDEN] Try On button — uncomment to restore * /}
        {/* <Link
          to="/try-at-home"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <GlassesIcon />
          Try On
        </Link> * /}
        {/* [HIDDEN] Similar button — uncomment to restore * /}
        {/* <button
          onClick={handleSimilarClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <GridIcon />
          Similar
        </button> * /}
      </div> */}

      {/* [HIDDEN] 360° modal — uncomment to restore */}
      {/* {viewer360Open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) close360(); }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-3xl h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">360° View</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {has360Images
                    ? `Drag left or right to rotate • ${rotation360Images.length} angles`
                    : "360° view coming soon for this product"}
                </p>
              </div>
              <button
                onClick={close360}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close 360° viewer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 bg-gray-50">
              {has360Images ? (
                <Viewer360 frames={rotation360Images} alt={productName} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <RotateCwIcon />
                  </div>
                  <p className="text-gray-600 font-medium mb-1">360° view coming soon</p>
                  <p className="text-gray-400 text-sm max-w-xs">Multi-angle rotation images haven't been uploaded for this product yet. Check back soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
});

ProductImageViewer.displayName = "ProductImageViewer";
