import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/shared/utils/image";

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&q=80";

interface PromoBannerProps {
  image?: string;
  link?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export const PromoBanner = memo(function PromoBanner({
  image,
  link = "#",
  title = "Summer Eyewear Sale",
  subtitle = "Up to 50% Off on Premium Frames & Sunglasses",
  buttonText = "Shop Now",
}: PromoBannerProps): JSX.Element {
  const [imgError, setImgError] = useState(false);
  const imageUrl = image ? getImageUrl(image) : FALLBACK_BANNER;

  return (
    <section className="w-full px-4 my-6">
      <Link
        to={link}
        className="relative block w-full h-[300px] sm:h-[380px] lg:h-[450px] rounded-2xl overflow-hidden shadow-lg group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
      >
        {!imgError && imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 lg:px-14 text-white">
          <p className="text-amber-400 text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold mb-2">
            Limited Time Offer
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-lg leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-white/80 max-w-md leading-relaxed">
              {subtitle}
            </p>
          )}
          <span className="mt-5 sm:mt-6 inline-flex items-center gap-2 w-fit px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white text-gray-900 font-semibold text-sm sm:text-base hover:bg-gray-100 transition-all active:scale-95">
            {buttonText}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </section>
  );
});

PromoBanner.displayName = "PromoBanner";
