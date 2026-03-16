import { memo } from "react";
import type { CampaignProps } from "../../types";

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
  return (
    <section className="w-full">
      <a href={link} className="block w-full">
        <img
          src={image}
          alt={alt}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </a>
    </section>
  );
});

Campaign.displayName = "Campaign";
