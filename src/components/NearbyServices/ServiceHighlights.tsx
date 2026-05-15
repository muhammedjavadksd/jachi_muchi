import { memo, useMemo } from "react";
import { Container } from "../Container/Container";

/**
 * Nearby Stores & Services section
 * Displays service cards with full-width images and arrow buttons
 * Memoized as content is static
 */
interface Store {
  _id?: string;
  title?: string;
  images?: string[];
}

export const NearbyServices = memo(function NearbyServices({ stores = [] }: { stores?: Store[] }): JSX.Element | null {
  /** Memoize service cards to prevent recreation on re-render */
  const serviceCards = useMemo(() => (
    (stores || []).map((store, index) => (
      <a
        key={store?._id || index}
        href={`/stores/${store?._id || ""}`}
        className="relative block overflow-hidden group"
        style={{ borderRadius: "16px" }}
      >
        {/* Full-width Service Image */}
        <img
          src={store?.images && store.images.length > 0 ? store.images[0] : "https://placehold.co/600x400?text=Store"}
          alt={store?.title || "Nearby Store"}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </a>
    ))
  ), [stores]);

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
        {(!stores || stores.length === 0) ? (
          <div className="text-sm text-gray-500">No nearby services available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {serviceCards}
          </div>
        )}
      </Container>
    </section>
  );
});

NearbyServices.displayName = "NearbyServices";
