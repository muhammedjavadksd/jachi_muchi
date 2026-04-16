import { memo, useMemo } from "react";
import { Container } from "../Container/Container";
import { NEARBY_SERVICES } from "../../lib/constants";

/**
 * Nearby Stores & Services section
 * Displays service cards with full-width images and arrow buttons
 * Memoized as content is static
 */
export const NearbyServices = memo(function NearbyServices(): JSX.Element {
  /** Memoize service cards to prevent recreation on re-render */
  const serviceCards = useMemo(() => (
    NEARBY_SERVICES.map((service, index) => (
      <a
        key={index}
        href={service.link}
        className="relative block overflow-hidden group"
        style={{ borderRadius: "16px" }}
      >
        {/* Full-width Service Image */}
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        
       
        
      </a>
    ))
  ), []);

  return (
    <section
      className="w-full bg-white"
      style={{ paddingTop: "48px", paddingBottom: "48px" }}
    >
      <Container>
        <h2
          className="font-semibold mb-8"
          style={{ fontSize: "24px", color: "#1a1a1a" }}
        >
          Nearby Stores & Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {serviceCards}
        </div>
      </Container>
    </section>
  );
});

NearbyServices.displayName = "NearbyServices";
