import { memo, useMemo, useEffect, useState } from "react";
import { Container } from "../Container/Container";
import { NEARBY_SERVICES } from "../../lib/constants";
import { getSettings, type Settings } from "../../api/settings";

export const NearbyServices = memo(function NearbyServices(): JSX.Element {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const serviceCards = useMemo(() => {
    const whatsappLink = settings?.whatsappNumber
      ? `https://wa.me/${settings.whatsappNumber}`
      : NEARBY_SERVICES[2].link;
    const phoneLink = settings?.contactPhone
      ? `tel:+${settings.contactPhone}`
      : NEARBY_SERVICES[3].link;

    const items = NEARBY_SERVICES.map((service, index) => ({
      ...service,
      link: index === 2 ? whatsappLink : index === 3 ? phoneLink : service.link,
    }));

    return items.map((service, index) => (
      <a
        key={index}
        href={service.link}
        className="relative block overflow-hidden group"
        style={{ borderRadius: "16px" }}
      >
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </a>
    ));
  }, [settings]);

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
