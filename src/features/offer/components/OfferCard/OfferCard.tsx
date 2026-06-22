import { memo, useState, useEffect } from "react";
import type { Offer } from "@/features/offer/types";

interface OfferCardProps {
  offer: Offer;
}

const TYPE_STYLES: Record<string, { badge: string; gradient: string; accent: string; icon: string }> = {
  bogo: {
    badge: "bg-orange-500 text-white",
    gradient: "from-orange-500 to-red-500",
    accent: "text-orange-600",
    icon: "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z",
  },
  combo: {
    badge: "bg-purple-600 text-white",
    gradient: "from-purple-600 to-indigo-600",
    accent: "text-purple-600",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
  percentage: {
    badge: "bg-blue-600 text-white",
    gradient: "from-blue-500 to-cyan-500",
    accent: "text-blue-600",
    icon: "M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z",
  },
  flat: {
    badge: "bg-teal-600 text-white",
    gradient: "from-teal-500 to-teal-600",
    accent: "text-teal-600",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M3 7l3 1m0 0l-3 9M9 3L6 4m0 0l-3 9",
  },
  "category-offer": {
    badge: "bg-teal-600 text-white",
    gradient: "from-teal-500 to-cyan-500",
    accent: "text-teal-600",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
};

function getDefaultStyle(offerType: string) {
  return {
    badge: "bg-gray-800 text-white",
    gradient: "from-gray-700 to-gray-900",
    accent: "text-gray-700",
    icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  };
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const calcRemaining = () => {
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    if (!remaining) return;
    const timer = setInterval(() => {
      const r = calcRemaining();
      if (!r) { clearInterval(timer); setRemaining(null); return; }
      setRemaining(r);
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!remaining) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-medium">Ends in</span>
      <div className="flex gap-1">
        {remaining.days > 0 && <span className="font-bold text-gray-800">{remaining.days}d</span>}
        <span className="font-bold text-gray-800">{String(remaining.hours).padStart(2, "0")}h</span>
        <span className="font-bold text-gray-800">{String(remaining.minutes).padStart(2, "0")}m</span>
        <span className="font-bold text-gray-800">{String(remaining.seconds).padStart(2, "0")}s</span>
      </div>
    </div>
  );
}

function OfferImage({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-4">
          <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <p className="text-xs text-gray-400 truncate max-w-[120px]">{fallback}</p>
        </div>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}

function getOfferDescription(offer: Offer): string {
  const buyName = offer.applicableProducts?.[0]?.name;
  const freeName = offer.freeProduct?.name;
  if (offer.offerType === "bogo" && buyName && freeName) {
    return `Buy ${offer.buyQuantity || 1} ${buyName} and get ${freeName} free`;
  }
  if (offer.offerType === "combo" && buyName && freeName) {
    return `${buyName} + ${freeName} combo deal`;
  }
  if (offer.offerType === "percentage" && offer.discountValue && buyName) {
    return `Get ${offer.discountValue}% off on ${buyName}`;
  }
  if (offer.offerType === "flat" && offer.discountValue && buyName) {
    return `Flat ₹${offer.discountValue} off on ${buyName}`;
  }
  return offer.offerName;
}

function getProductImage(offer: Offer): string | undefined {
  return (
    offer.applicableProducts?.[0]?.images?.[0] ||
    offer.freeProduct?.images?.[0] ||
    offer.image
  );
}

function getProductName(offer: Offer): string {
  return offer.applicableProducts?.[0]?.name || offer.freeProduct?.name || offer.offerName;
}

export const OfferCard = memo(function OfferCard({ offer }: OfferCardProps) {
  const style = TYPE_STYLES[offer.offerType] || getDefaultStyle(offer.offerType);
  const productImage = getProductImage(offer);
  const productName = getProductName(offer);
  const description = getOfferDescription(offer);

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col md:flex-row-reverse min-h-[320px]">
      {/* Right: Image Section */}
      <div className="relative md:w-[280px] lg:w-[320px] h-52 md:h-auto shrink-0 overflow-hidden bg-gray-100">
        <OfferImage src={productImage} alt={offer.offerName} fallback={productName} />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/30 md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent md:hidden" />
      </div>

      {/* Left: Content Section */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center relative">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${style.badge}`}>
            {offer.offerType === "bogo"
              ? `BUY ${offer.buyQuantity} GET ${offer.getQuantity}`
              : offer.offerType === "combo"
                ? "COMBO"
                : offer.offerType === "percentage"
                  ? `${offer.discountValue}% OFF`
                  : offer.offerType === "flat"
                    ? `FLAT ₹${offer.discountValue}`
                    : "OFFER"}
          </span>
          {offer.offerType === "bogo" && offer.getQuantity && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-700">
              FREE
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
          {offer.offerName}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Product names row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {offer.applicableProducts?.[0] && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700">
              {offer.applicableProducts[0].name}
            </span>
          )}
          {offer.freeProduct && (
            <>
              <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-xs font-medium text-teal-700">
                FREE: {offer.freeProduct.name}
              </span>
            </>
          )}
        </div>

        {/* Price info */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          {offer.applicableProducts?.[0]?.price && (
            <span className="text-gray-500">
              MRP: <span className="line-through">₹{offer.applicableProducts[0].price}</span>
            </span>
          )}
          {offer.freeProduct?.price && (
            <span className="text-teal-600 font-medium">
              Free worth ₹{offer.freeProduct.price}
            </span>
          )}
        </div>

        {/* Countdown */}
        {offer.endDate && <CountdownTimer endDate={offer.endDate} />}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="flex items-center gap-3 mt-4">
          <a
            href={offer.link || "#"}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${style.gradient} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
          >
            {offer.buttonText || "Shop Now"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          {offer.couponCode && (
            <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-[10px] text-gray-400">Use code</p>
              <p className="text-sm font-bold text-gray-800 tracking-wider">{offer.couponCode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

OfferCard.displayName = "OfferCard";
