import { memo } from "react";
import type { ImageCardProps } from "../../types";

/**
 * Reusable ImageCard component for displaying clickable image cards
 * Used in exclusive section, category grids, etc.
 * Memoized to prevent unnecessary re-renders
 */
export const ImageCard = memo(function ImageCard({ 
  image, 
  alt, 
  link,
  borderRadius = "16px"
}: ImageCardProps): JSX.Element {
  return (
    <a
      href={link}
      className="relative block overflow-hidden group"
      style={{ borderRadius }}
    >
      <img
        src={image}
        alt={alt}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </a>
  );
});

ImageCard.displayName = "ImageCard";
