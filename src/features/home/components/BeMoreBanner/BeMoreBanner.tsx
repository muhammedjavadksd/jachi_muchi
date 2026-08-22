import { memo } from "react";
import { Container } from "@/shared/components/Container/Container";
import { BE_MORE_BANNER } from "@/features/home/constants";

export const BeMoreBanner = memo(function BeMoreBanner(): JSX.Element {
  return (
    <section
      className="w-full bg-white"
      style={{ paddingTop: "48px", paddingBottom: "16px" }}
    >
      <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
        <img
          src={BE_MORE_BANNER.image}
          alt={BE_MORE_BANNER.alt}
          className="block w-full h-auto"
          loading="lazy"
        />
      </div>

      <Container>
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-600">
            {BE_MORE_BANNER.eyebrow}
          </p>
          <p className="mt-2 text-xl md:text-2xl font-semibold" style={{ color: "#1a1a1a" }}>
            {BE_MORE_BANNER.tagline}
          </p>
        </div>
      </Container>
    </section>
  );
});

BeMoreBanner.displayName = "BeMoreBanner";