import { memo } from "react";
import type { CampaignProps } from "../../types";
import { Link } from "react-router-dom";
/**
 * Campaign banner section displaying promotional full-width image
 * Links to specified campaign page
 * Memoized as content is static
 */
export const Campaign = memo(function Campaign({ 
  image, 
  link, 
  alt = "Campaign Banner" 
}: CampaignProps): JSX.Element {
  const imageUrl = image || "https://placehold.co/1200x300/1e40af/FFFFFF?text=Promotional+Banner";
  return (
    <section className="w-full">
      <Link to={link} className="block w-full">
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </Link>
    </section>
  );
});

Campaign.displayName = "Campaign";
