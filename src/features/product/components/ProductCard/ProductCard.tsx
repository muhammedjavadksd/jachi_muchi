import { memo, useMemo, useState, useCallback } from "react";
import { useWishlist } from "@/features/wishlist/hooks";
import { getImageUrl } from "@/shared/utils/image";
import type { ProductCardProps } from "@/features/product/types";

const FALLBACK_IMAGE = "https://placehold.co/400x300?text=Eyewear";

export const ProductCard = memo(function ProductCard({
  images,
  name,
  description,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  colors,
  link,
  offerLabel,
  offerBadgeColor,
}: ProductCardProps & { offerLabel?: string; offerBadgeColor?: string }): JSX.Element {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(link);

  const primaryImage = useMemo(() => {
    if (selectedColorIndex !== null && colors && colors[selectedColorIndex]) {
      return colors[selectedColorIndex].image || FALLBACK_IMAGE;
    }
    return getImageUrl(images?.[0], FALLBACK_IMAGE);
  }, [selectedColorIndex, colors, images]);

  const handleColorClick = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorIndex(index);
  }, []);

  const productId = link.replace(/^\/product\//, "");

  const handleWishlistClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlistLoading) return;

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist({ name, image: primaryImage, link, price });
      }
    } catch (error) {
      console.error("Wishlist action failed:", error);
    } finally {
      setWishlistLoading(false);
    }
  }, [inWishlist, productId, name, primaryImage, price, addToWishlist, removeFromWishlist, wishlistLoading]);

  return (
    <a
      href={link}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-[220px] bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={primaryImage}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        {offerLabel && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[10px] font-bold shadow-md z-10"
            style={{ backgroundColor: offerBadgeColor || "#f26b3a" }}
          >
            {offerLabel}
          </div>
        )}
        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md transition-shadow z-10 disabled:opacity-50"
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={inWishlist ? "text-red-500" : "text-gray-600"}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        {rating && (
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-teal-700 text-white text-xs px-2 py-1 rounded-md font-semibold">
              {rating}
            </span>
            {reviews && (
              <span className="text-gray-500 text-xs">{reviews.toLocaleString()}</span>
            )}
          </div>
        )}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{name}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">{description}</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-black">₹{price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
          )}
          {discount && discount > 0 && (
            <span className="text-green-600 text-xs font-semibold">({discount}% OFF)</span>
          )}
        </div>
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            {colors.slice(0, 4).map((color, index) => (
              <button
                key={index}
                onClick={(e) => handleColorClick(e, index)}
                className={`w-4 h-4 border-2 transition-all ${
                  selectedColorIndex === index
                    ? "border-gray-800 scale-110"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{
                  backgroundColor: color.colorCode,
                  borderRadius: "3px",
                }}
                aria-label={`Select color ${index + 1}`}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-xs text-gray-500">+{colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </a>
  );
});

ProductCard.displayName = "ProductCard";
