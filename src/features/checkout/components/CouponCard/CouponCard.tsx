import { memo, useState } from "react";
import { Price } from "@/shared/components";

interface CouponCardProps {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue?: number;
  minPurchase?: number;
  maxDiscount?: number;
  description?: string;
  expiresAt?: string;
  isNewUserOnly?: boolean;
  onCopy: (code: string) => void;
  onApply?: (code: string) => void;
}

const hasExpiry = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDaysRemaining(expiresAt?: string): number | null {
  if (!hasExpiry(expiresAt)) return null;
  const diff = new Date(expiresAt!).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

const num = (v?: number): number =>
  typeof v === "number" && !isNaN(v) && v > 0 ? v : 0;

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
}: CouponCardProps): JSX.Element | null {
  const [copied, setCopied] = useState(false);
  const daysLeft = getDaysRemaining(expiresAt);
  const isExpiringSoon = daysLeft !== null && daysLeft <= 5 && daysLeft > 0;
  const isExpired = daysLeft !== null && daysLeft <= 0;
  const dVal = num(discountValue);
  const minPur = num(minPurchase);
  const maxDisc = num(maxDiscount);

  if (isExpired) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    onCopy(code);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
      <div className="h-1.5 bg-gradient-to-r from-teal-500 to-teal-600 shrink-0" />

      {isNewUserOnly && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
          NEW USER
        </div>
      )}

      {isExpiringSoon && (
        <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
          EXPIRES SOON
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 pt-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {dVal > 0
                ? discountType === "percentage"
                  ? `${dVal}% OFF`
                  : <><Price value={dVal} size="lg" /> OFF</>
                : "—"}
            </p>
            {description && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{description}</p>
            )}
          </div>

          {dVal > 0 && (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs text-center leading-tight shrink-0 shadow-sm ml-4">
              {discountType === "percentage" ? (
                <span>{dVal}%<br />OFF</span>
              ) : (
                <span><Price value={dVal} size="xs" className="text-white" /><br />OFF</span>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-dashed border-gray-300 mt-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Coupon Code</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-bold text-gray-900 tracking-[2px] select-all truncate min-w-0">{code}</p>
            <button
              onClick={handleCopy}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 shrink-0 ${
                copied
                  ? "bg-teal-500 text-white"
                  : "bg-teal-50 text-teal-600 hover:bg-teal-100"
              }`}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-6 mb-6 flex-1 space-y-2 text-sm">
          {minPur > 0 && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Min. <span className="font-semibold text-gray-800"><Price value={minPur} size="xs" /></span></span>
            </div>
          )}

          {maxDisc > 0 && discountType === "percentage" && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              <span>Max discount <span className="font-semibold text-gray-800"><Price value={maxDisc} size="xs" /></span></span>
            </div>
          )}

          {hasExpiry(expiresAt) && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Valid till <span className="font-semibold text-gray-800">{formatDate(expiresAt!)}</span></span>
            </div>
          )}

          {isNewUserOnly && (
            <div className="flex items-center gap-2 text-orange-600">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">First order only</span>
            </div>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] transition-all duration-200 shadow-sm mt-auto shrink-0"
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
    </div>
  );
});

CouponCard.displayName = "CouponCard";
