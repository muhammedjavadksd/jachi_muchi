import { memo, useCallback, useEffect, useState } from "react";
import { getImageUrl } from "@/shared/utils/image";
import { IMAGE_PLACEHOLDER, nextImageSrcOnError } from "@/shared/utils/imageSrc";

export interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fallback?: string;
}

/**
 * Image element that never renders a broken picture. Missing/empty sources
 * resolve to the placeholder up front, and a failed load (onError) swaps the
 * source for the same placeholder. The element keeps whatever sizing classes
 * it is given, so a swap does not collapse the surrounding card layout.
 */
export const SafeImage = memo(function SafeImage({
  src,
  alt,
  className,
  loading = "lazy",
  fallback = IMAGE_PLACEHOLDER,
}: SafeImageProps): JSX.Element {
  const resolved = getImageUrl(src, fallback);
  const [currentSrc, setCurrentSrc] = useState(resolved);

  useEffect(() => {
    setCurrentSrc(resolved);
  }, [resolved]);

  const handleError = useCallback(() => {
    setCurrentSrc((prev) => nextImageSrcOnError(prev, fallback));
  }, [fallback]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
});

SafeImage.displayName = "SafeImage";
