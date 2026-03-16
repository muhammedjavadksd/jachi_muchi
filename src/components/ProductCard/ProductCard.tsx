import { memo, useMemo, useState, useCallback } from "react";
import { useWishlist } from "../../context/WishlistContext";
import type { ProductCardProps } from "../../types";

/**
 * Reusable product card component for product listings
 * Displays product image with hover flip, rating, name, description, and price
 * Memoized to prevent unnecessary re-renders
 */
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
}: ProductCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const { addItem: addToWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(link);

  /** Handle mouse enter */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  /** Handle mouse leave */
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  /** Handle color click - changes displayed image */
  const handleColorClick = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorIndex(index);
  }, []);

  /** Get primary image - selected color image or default */
  const primaryImage = useMemo(() => {
    if (selectedColorIndex !== null && colors && colors[selectedColorIndex]) {
      return colors[selectedColorIndex].image;
    }
    return images[0];
  }, [selectedColorIndex, colors, images]);

  /** Get hover image - only use default hover if no color selected */
  const hoverImage = useMemo(() => {
    if (selectedColorIndex !== null) {
      return null; // No hover effect when color is selected
    }
    return images.length > 1 ? images[1] : null;
  }, [selectedColorIndex, images]);

  return (
    <a
      href={link}
      className="block bg-white rounded-xl overflow-hidden border border-gray-200 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative p-4 bg-white overflow-hidden">
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={name}
          className={`w-full h-48 object-contain transition-opacity duration-300 ${
            isHovered && hoverImage ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />
        {/* Hover Image (if exists and no color selected) */}
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${name} - alternate view`}
            className={`absolute inset-0 w-full h-48 object-contain p-4 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        )}
        {/* Wishlist Button */}
        <button
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToWishlist({ name, image: images[0], link, price });
          }}
          aria-label={inWishlist ? "In wishlist" : "Add to wishlist"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1 bg-teal-700 text-white text-xs font-semibold px-2 py-0.5 rounded">
              {rating}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            {reviews && (
              <span className="text-gray-500 text-xs">{reviews.toLocaleString()}</span>
            )}
          </div>
        )}

        {/* Brand Name */}
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{name}</h3>

        {/* Description */}
        {description && (
          <p className="text-gray-500 text-xs mb-2 truncate">{description}</p>
        )}

        {/* Price and Colors */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">₹{price}</span>
            {originalPrice && (
              <span className="text-gray-400 text-sm line-through">₹{originalPrice}</span>
            )}
            {discount && (
              <span className="text-green-600 text-xs font-medium">({discount}% OFF)</span>
            )}
          </div>
          
          {/* Color Swatches */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-1">
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
                    borderRadius: "3px"
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
      </div>
    </a>
  );
});

ProductCard.displayName = "ProductCard";
