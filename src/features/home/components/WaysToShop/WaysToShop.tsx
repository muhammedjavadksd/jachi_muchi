import { memo, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/shared/components/Container/Container";

interface ShopCard {
  title: string;
  subtitle: string;
  link: string;
  linkExternal?: boolean;
  image: string;
  badge?: string;
}

const CARDS: ShopCard[] = [
  {
    title: "Visit nearest store",
    subtitle: "Try frames in person, get a proper fitting from our team.",
    link: "/store-locator",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop",
  },
  {
    title: "Home try-on",
    subtitle: "Pick four frames, we bring them straight to your door.",
    link: "/home-try-on",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop",
    badge: "In 60 mins",
  },
  {
    title: "Order on WhatsApp",
    subtitle: "Chat with us and order without the app hassle.",
    link: "https://wa.me/",
    linkExternal: true,
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=400&fit=crop",
  },
  {
    title: "Talk to an expert",
    subtitle: "Get guidance on lenses, fit and frame style.",
    link: "/talk-to-expert",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
  },
];

export const WaysToShop = memo(function WaysToShop(): JSX.Element {
  return (
    <section className="py-12">
      <Container>
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ color: "#C1652F" }}
        >
          Ways to shop with us
        </p>

        <h2
          className="text-xl sm:text-2xl md:text-[30px] font-semibold mb-4 text-[#1a1a1a]"
        >
          Visit, try on, or just say hi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {CARDS.map((card) => (
            <a
              key={card.title}
              href={card.link}
              {...(card.linkExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label={card.title}
              className="group relative block overflow-hidden rounded-2xl bg-gray-100 h-52 sm:h-60 lg:h-72"
            >
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {card.badge && (
                <span
                  className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 z-10"
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "#C9A24A",
                    color: "#1C2B2A",
                  }}
                >
                  {card.badge}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <h3 className="text-white font-bold tracking-wide text-sm sm:text-base leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-[11.5px] sm:text-xs mt-1 line-clamp-2">
                    {card.subtitle}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
                >
                  <ArrowRight className="w-4 h-4 text-gray-900" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
});

WaysToShop.displayName = "WaysToShop";
