import { memo } from "react";
import { Link } from "react-router-dom";
import { PackageX, RotateCw } from "lucide-react";
import { getImageUrl } from "@/shared/utils/image";
import { ReturnStatusTracker } from "@/features/returns/components/ReturnStatusTracker/ReturnStatusTracker";
import { useMyReturns } from "@/features/returns/hooks";
import type { NormalizedReturn } from "@/features/returns/hooks/useMyReturns";

const CARD = "rounded-2xl border border-white/10 bg-[#151c28] p-5 sm:p-6";
const STATUS_ICON: Record<string, string> = {
  requested: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
  accepted: "bg-blue-400/10 text-blue-300 ring-blue-400/30",
  collected: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/30",
  refunded: "bg-green-400/10 text-green-300 ring-green-400/30",
  rejected: "bg-red-400/10 text-red-300 ring-red-400/30",
};

function ReturnCard({ item }: { item: NormalizedReturn }): JSX.Element {
  return (
    <section className={CARD}>
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
            <img
              src={getImageUrl(item.productImage || item.productImageSrc)}
              alt={item.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{item.productName}</p>
            <p className="text-xs text-gray-500 mt-0.5">Return #{item.orderId}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 self-start ${STATUS_ICON[item.statusKey] || STATUS_ICON.requested}`}>
          {item.statusLabel}
        </span>
      </div>

      <div className="mb-5">
        <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Return Progress</h3>
        <ReturnStatusTracker
          statusKey={item.statusKey}
          steps={item.steps}
          rejectionReason={item.rejectionReason}
        />
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs text-gray-500 mb-2">Reason</p>
        <p className="text-sm text-gray-200">{item.reason || "Not specified"}</p>

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
      </div>
    </section>
  );
}

function Thumbnail({ src, alt }: { src?: string; alt: string }): JSX.Element {
  if (!src) {
    return (
      <div className="w-full aspect-square max-w-[110px] rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
        <span className="text-xs text-gray-600">No image</span>
      </div>
    );
  }
  return (
    <div className="w-full max-w-[110px] aspect-square rounded-lg border border-white/10 bg-white overflow-hidden">
      <img src={getImageUrl(src)} alt={alt} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

/**
 * "My Returns" status tracker page. Lists the logged-in user's return requests
 * with a visual status tracker, reason, thumbnails of submitted images and the
 * date of each status change. Loads from GET /api/returns/my.
 */
export const MyReturnsPage = memo(function MyReturnsPage(): JSX.Element {
  const { state, returns, refetch } = useMyReturns();

  return (
    <div className="min-h-screen w-full bg-[#0c1018] text-gray-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0c1018]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Link to="/account" className="flex items-center gap-1.5 text-sm text-accent">
            <span aria-hidden>←</span> Back
          </Link>
          <span className="text-sm font-semibold tracking-tight text-gray-100">My Returns</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-5">
        {state.phase === "loading" && (
          <section className={CARD}>
            <div className="space-y-3">
              <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="mt-6 space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse shrink-0" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-32 rounded bg-white/10 animate-pulse" />
                    <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {state.phase === "error" && (
          <section className={CARD}>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mb-4">
                <PackageX className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-100 mb-1">Couldn't load your returns</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                We couldn't fetch your return requests right now. Please try again in a moment.
              </p>
              <button
                onClick={refetch}
                className="inline-flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2.5 transition-colors"
              >
                <RotateCw className="w-4 h-4" /> Retry
              </button>
            </div>
          </section>
        )}

        {state.phase === "ready" && returns.length === 0 && (
          <section className={CARD}>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <PackageX className="w-7 h-7 text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-100 mb-1">No returns yet</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                When you start a return on a delivered order, it will show up here so you can track its status.
              </p>
              <Link
                to="/account/orders"
                className="inline-flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2.5 transition-colors"
              >
                View My Orders
              </Link>
            </div>
          </section>
        )}

        {state.phase === "ready" &&
          returns.map((item) => <ReturnCard key={item.id} item={item} />)}
      </main>
    </div>
  );
});

MyReturnsPage.displayName = "MyReturnsPage";
