import { memo } from "react";
import type { ImageCardProps } from "../../types";

/**
 * ImageCard - consistent aspect ratio
 */
export const ImageCard = memo(function ImageCard({ 
  image, 
  alt, 
  link,
  borderRadius = "8px"
}: ImageCardProps): JSX.Element {
  return (
    <a
      href={link}
      className="block overflow-hidden"
      style={{ borderRadius }}
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </a>
  );
});

ImageCard.displayName = "ImageCard";
