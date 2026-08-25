import { memo } from "react";
import { MapPin, Glasses, MessageCircle, Headphones, ArrowRight } from "lucide-react";
import { Container } from "@/shared/components/Container/Container";

interface ShopCard {
  icon: typeof MapPin;
  title: string;
  subtext: string;
  link: string;
  linkExternal?: boolean;
  badge?: string;
  dark?: boolean;
}

const CARDS: ShopCard[] = [
  {
    icon: MapPin,
    title: "Visit nearest store",
    subtext: "Try frames in person, get a proper fitting from our team.",
    link: "/store-locator",
  },
  {
    icon: Glasses,
    title: "Home try-on",
    subtext: "Pick four frames, we bring them straight to your door.",
    link: "/home-try-on",
    badge: "In 60 mins",
    dark: true,
  },
  {
    icon: MessageCircle,
    title: "Order on WhatsApp",
    subtext: "Chat with us and order without the app hassle.",
    link: "https://wa.me/",
    linkExternal: true,
  },
  {
    icon: Headphones,
    title: "Talk to an expert",
    subtext: "Get guidance on lenses, fit and frame style.",
    link: "/talk-to-expert",
  },
];

export const WaysToShop = memo(function WaysToShop(): JSX.Element {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        {/* Eyebrow */}
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ color: "#C1652F" }}
        >
          Ways to shop with us
        </p>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl font-semibold mb-10 leading-tight"
          style={{ color: "#1C2B2A", fontFamily: "'Fraunces', serif" }}
        >
          Visit, try on, or just say hi
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((card) => {
            const Icon = card.icon;
            const isDark = card.dark;

            return (
              <a
                key={card.title}
                href={card.link}
                {...(card.linkExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                aria-label={card.title}
                className="group relative flex flex-col justify-between p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:border-[#0E4A3E] h-[320px] sm:h-[380px]"
                style={{
                  backgroundColor: isDark ? "#0E4A3E" : "#FBF8F2",
                  border: `1px solid ${isDark ? "#0E4A3E" : "#E2D9C6"}`,
                  borderRadius: isDark ? "28px 6px 28px 28px" : "28px 28px 28px 6px",
                  transform: "translateY(0) rotate(0deg)",
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px) rotate(-0.3deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
                }}
              >
                {/* Decorative lens circle */}
                <div
                  className="absolute pointer-events-none opacity-[0.06]"
                  style={{
                    width: isDark ? "160px" : "110px",
                    height: isDark ? "160px" : "110px",
                    borderRadius: "50%",
                    border: `2px solid ${isDark ? "#fff" : "#1C2B2A"}`,
                    top: isDark ? "-30px" : "-20px",
                    right: isDark ? "-30px" : "-20px",
                  }}
                />

                {/* Badge (top-right) */}
                {card.badge && (
                  <span
                    className="absolute top-4 right-4 text-[11px] font-semibold px-2.5 py-1"
                    style={{
                      borderRadius: "14px 14px 14px 4px",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.15)"
                        : "#C1652F",
                      color: "#fff",
                    }}
                  >
                    {card.badge}
                  </span>
                )}

                <div>
                  {/* Icon circle */}
                  <div
                    className="w-11 h-11 flex items-center justify-center mb-4 transition-all duration-300 group-hover:!rounded-full"
                    style={{
                      borderRadius: "16px 16px 16px 4px",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.15)"
                        : "#F6F1E8",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: isDark ? "#fff" : "#0E4A3E" }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-semibold mb-1.5"
                    style={{
                      color: isDark ? "#fff" : "#1C2B2A",
                      fontFamily: "'Fraunces', serif",
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Subtext */}
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#5B655F" }}
                  >
                    {card.subtext}
                  </p>
                </div>

                {/* Arrow button (bottom-right) */}
                <div className="flex justify-end mt-6">
                  <span
                    className="w-[34px] h-[34px] flex items-center justify-center transition-all duration-300 group-hover:bg-[#0E4A3E] group-hover:!rounded-full"
                    style={{
                      borderRadius: "14px 14px 14px 4px",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.15)"
                        : "#E2D9C6",
                    }}
                  >
                    <ArrowRight
                      className="w-4 h-4 transition-colors duration-300 group-hover:text-white"
                      style={{ color: isDark ? "#fff" : "#1C2B2A" }}
                    />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
});

WaysToShop.displayName = "WaysToShop";
