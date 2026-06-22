import { memo, useState, useCallback, useMemo } from "react";
import { getImageUrl } from "@/shared/utils/image";

interface ProductGalleryProps {
  images: string[];
  productName?: string;
}

const FALLBACK_IMG = "https://placehold.co/400x300?text=No+Image";

export const ProductGallery = memo(function ProductGallery({
  images,
  productName,
}: ProductGalleryProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const imageList = useMemo(
    () => (images.length > 0 ? images : [FALLBACK_IMG]),
    [images]
  );

  const currentImage = useMemo(
    () => getImageUrl(imageList[selectedIndex]) || FALLBACK_IMG,
    [imageList, selectedIndex]
  );

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-auto md:max-h-[500px]">
        {imageList.map((img, idx) => {
          const thumbSrc = getImageUrl(img) || FALLBACK_IMG;
          return (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                idx === selectedIndex
                  ? "border-teal-600 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={thumbSrc}
                alt={`${productName || "Product"} ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="flex-1 order-1 md:order-2 bg-gray-50 rounded-2xl flex items-center justify-center p-6 min-h-[300px] sm:min-h-[400px]">
        <img
          src={currentImage}
          alt={productName || "Product Image"}
          className="w-full h-full max-h-[450px] object-contain"
        />
      </div>
    </div>
  );
});

ProductGallery.displayName = "ProductGallery";
