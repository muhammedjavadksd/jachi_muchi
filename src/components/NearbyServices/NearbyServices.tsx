import { memo, useMemo } from "react";
import { Container } from "../Container/Container";
import { NEARBY_SERVICES } from "../../lib/constants";

/**
 * Nearby Services - responsive grid
 */
export const NearbyServices = memo(function NearbyServices(): JSX.Element {
  const serviceCards = useMemo(() => (
    NEARBY_SERVICES.map((service, index) => (
      <a
        key={index}
        href={service.link}
        className="block overflow-hidden rounded-lg"
      >
        <div className="aspect-[4/3] bg-gray-100">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </a>
    ))
  ), []);

  return (
    <section className="w-full bg-white py-3 sm:py-4">
      <Container>
        <h2 className="text-sm sm:text-base font-semibold mb-2 text-gray-900">
          Nearby Stores & Services
        </h2>

        {/* ✅ Merged responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {serviceCards}
        </div>

      </Container>
    </section>
  );
});

NearbyServices.displayName = "NearbyServices";