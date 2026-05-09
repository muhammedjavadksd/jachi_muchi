import { memo, useState } from "react";

interface CouponCardProps {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  description?: string;
  expiresAt: string;
  isNewUserOnly?: boolean;
  onCopy: (code: string) => void;
  onApply: (code: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getDaysRemaining(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const CouponCard = memo(function CouponCard({
  code,
  discountType,
  discountValue,
  minPurchase,
  maxDiscount,
  description,
  expiresAt,
  isNewUserOnly,
  onCopy,
  onApply,
}: CouponCardProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const daysRemaining = getDaysRemaining(expiresAt);
  const isExpiringSoon = daysRemaining <= 5 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    onCopy(code);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isExpired) return null;

  return (
    <div className="relative bg-white border-2 border-green-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-green-300">
      {/* New user badge */}
      {isNewUserOnly && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
          NEW USER
        </div>
      )}

      {/* Expiring soon badge */}
      {isExpiringSoon && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
          EXPIRES SOON
        </div>
      )}

      <div className="p-5">
        {/* Discount Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-3xl font-black text-gray-900">
              {discountType === "percentage" ? `${discountValue}%` : `₹${discountValue}`}
            </p>
            <p className="text-green-600 font-semibold text-sm">
              {description || (discountType === "percentage" ? "OFF" : "FLAT DISCOUNT")}
            </p>
          </div>

          {/* Circular discount badge */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs text-center leading-tight shrink-0">
            {discountType === "percentage" ? (
              <span>SAVE<br/>{discountValue}%</span>
            ) : (
              <span>SAVE<br/>₹{discountValue}</span>
            )}
          </div>
        </div>

        {/* Coupon Code */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Coupon Code</p>
          <p className="text-lg font-bold text-gray-900 tracking-wider">{code}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-5 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Min purchase: <span className="font-semibold">₹{minPurchase}</span></span>
          </div>

          {maxDiscount && discountType === "percentage" && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Max discount: <span className="font-semibold">₹{maxDiscount}</span></span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-2 0v1H3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-1V2a1 1 0 10-2 0v1H7V2a1 1 0 00-1-1zm0 5a1 1 0 000 2h3a1 1 0 100-2v-3a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Valid till: <span className="font-semibold">{formatDate(expiresAt)}</span></span>
          </div>

          {isNewUserOnly && (
            <div className="flex items-center gap-2 text-orange-600">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">First order only</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border-2 ${
              copied
                ? "bg-green-500 border-green-500 text-white"
                : "border-green-500 text-green-600 hover:bg-green-50"
            }`}
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>

          <button
            onClick={() => onApply(code)}
            className="flex-1 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
});

CouponCard.displayName = "CouponCard";
