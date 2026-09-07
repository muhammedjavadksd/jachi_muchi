import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, PackageX, RotateCcw } from "lucide-react";
import { getImageUrl } from "@/shared/utils/image";
import { EmptyState } from "@/shared/components";
import { ReturnStatusTracker } from "@/features/returns/components/ReturnStatusTracker/ReturnStatusTracker";
import { ReturnStatusBadge } from "@/features/returns/components/ReturnStatusBadge/ReturnStatusBadge";
import { ReturnAgainButton } from "@/features/returns/components/ReturnAgainButton/ReturnAgainButton";
import { useMyReturns } from "@/features/returns/hooks";
import type { NormalizedReturn } from "@/features/returns/hooks/useMyReturns";

function Thumbnail({ src, alt }: { src?: string; alt: string }): JSX.Element {
  if (!src) {
    return (
      <div className="w-full aspect-square max-w-[110px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
        <span className="text-xs text-gray-400">No image</span>
      </div>
    );
  }
  return (
    <div className="w-full max-w-[110px] aspect-square rounded-lg border border-gray-200 bg-white overflow-hidden">
      <img src={getImageUrl(src)} alt={alt} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

const ReturnCard = memo(function ReturnCard({
  item,
  expanded,
  onToggle,
}: {
  item: NormalizedReturn;
  expanded: boolean;
  onToggle: () => void;
}): JSX.Element {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 text-left transition-colors duration-200 hover:bg-gray-50"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-white">
          <img
            src={getImageUrl(item.productImage || item.productImageSrc)}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
          <p className="text-xs text-gray-500 mt-0.5">Return #{item.id}</p>
        </div>

        <ReturnStatusBadge status={item.statusKey} rejectionReason={item.rejectionReason} />

        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-5 border-t border-gray-100">
          <div className="pt-5">
            <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Return Progress</h3>
            <ReturnStatusTracker
              statusKey={item.statusKey}
              steps={item.steps}
              rejectionReason={item.rejectionReason}
              rejectionNote={item.rejectionNote}
              isFinalRejection={item.isFinalRejection}
            />
          </div>

          <div className="border-t border-gray-100 pt-4 mt-5">
            <p className="text-xs text-gray-500 mb-2">Reason</p>
            <p className="text-sm text-gray-800">{item.reason || "Not specified"}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Bill / Invoice</p>
                <Thumbnail src={item.billImageSrc} alt="Bill / invoice" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Product photo</p>
                <Thumbnail src={item.productImageSrc || item.productImage} alt="Product photo" />
              </div>
            </div>

            {item.canRetry && item.orderItemId && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">
                  Your first return request was declined but you get one more chance.
                </p>
                <ReturnAgainButton
                  orderId={item.orderId}
                  orderItemId={item.orderItemId}
                  productName={item.productName}
                  productImage={item.productImageSrc || item.productImage}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ReturnCard.displayName = "ReturnCard";

const CARD_SKELETON = "bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4";

/**
 * "My Returns" panel rendered inside the AccountLayout (alongside "My Orders").
 * Lists every return request (GET /api/returns/my) as an expandable card showing
 * the product, status badge and — once opened — the full progress tracker,
 * submitted reason and uploaded bill/product photos.
 */
export const AccountMyReturnsPage = memo(function AccountMyReturnsPage(): JSX.Element {
  const { state, returns, refetch } = useMyReturns();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Returns</h1>
        <p className="text-gray-500 mt-1">Track the status of your return requests</p>
      </div>

      {state.phase === "loading" && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className={CARD_SKELETON}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-40 rounded bg-gray-100 animate-pulse" />
                  <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {state.phase === "error" && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageX className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Couldn't load your returns</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            We couldn't fetch your return requests right now. Please try again in a moment.
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
        </div>
      )}

      {state.phase === "ready" && returns.length === 0 && (
        <EmptyState
          icon={PackageX}
          title="No returns yet"
          description="When you start a return on a delivered order, it will show up here so you can track its status."
          action={
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              View My Orders
            </Link>
          }
        />
      )}

      {state.phase === "ready" && returns.length > 0 && (
        <div className="space-y-4">
          {returns.map((item) => (
            <ReturnCard
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => toggleCard(item.id)}
            />
          ))}
        </div>
      )}
    </>
  );
});

AccountMyReturnsPage.displayName = "AccountMyReturnsPage";