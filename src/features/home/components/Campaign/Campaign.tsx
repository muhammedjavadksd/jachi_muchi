import { memo } from "react";
import type { CampaignProps } from "@/features/home/types";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/shared/utils/image";

export const Campaign = memo(function Campaign({ 
  image, 
  link, 
  alt = "Campaign Banner" 
}: CampaignProps): JSX.Element {
  const imageUrl = getImageUrl(image) || "https://placehold.co/1200x300/1e40af/FFFFFF?text=Promotional+Banner";
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
