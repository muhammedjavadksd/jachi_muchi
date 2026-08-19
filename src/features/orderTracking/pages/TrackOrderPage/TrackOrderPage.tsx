import { memo, useCallback, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Banknote,
  Calendar,
  Check,
  Clock,
  Download,
  Info,
  Loader2,
  MapPin,
  Package,
  PackageSearch,
  RotateCw,
  Search,
  Truck,
  X,
} from "lucide-react";
import { BRAND_LOGO_URL } from "@/shared/constants";
import { getImageUrl } from "@/shared/utils/image";
import { generateInvoicePdf } from "@/shared/utils/invoice";
import { cancelOrder } from "@/features/checkout/api/orderApi";
import { TrackingStepper } from "@/features/orderTracking/components/TrackingStepper/TrackingStepper";
import { CancelOrderModal } from "@/features/orderTracking/components/CancelOrderModal/CancelOrderModal";
import { useTrackOrder } from "@/features/orderTracking/hooks/useTrackOrder";
import {
  TRACK_PAYMENT_METHOD_LABEL,
  TRACK_PAYMENT_STATUS_META,
  TRACK_STATUS_META,
} from "@/features/orderTracking/constants";
import type { TrackShippingAddress } from "@/features/orderTracking/types";

const CARD = "rounded-2xl border border-white/10 bg-[#151c28] p-5 sm:p-6";
const FALLBACK_PAYMENT_BADGE = "bg-amber-400/10 text-amber-300 ring-amber-400/30";

const STATUS_ICONS: Record<string, typeof Clock> = {
  clock: Clock,
  check: Check,
  truck: Truck,
  package: Package,
  x: X,
};

function maskName(name?: string): string {
  if (!name) return "Customer";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Customer";
  if (parts.length === 1) {
    const word = parts[0];
    return word.length > 0 ? `${word[0].toUpperCase()}${"*".repeat(Math.max(word.length - 1, 2))}` : "Customer";
  }
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || "";
  return `${first} ${lastInitial}.`;
}

interface TrackOrderInputProps {
  onSubmit: (id: string) => void;
  buttonLabel?: string;
  hint?: string;
}

const TrackOrderInput = memo(function TrackOrderInput({
  onSubmit,
  buttonLabel = "Track Order",
  hint,
}: TrackOrderInputProps): JSX.Element {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = value.trim();
    if (id) onSubmit(id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your order ID"
          className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-transparent transition-colors"
        />
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold py-3 text-sm transition-colors active:scale-[0.99]"
      >
        <PackageSearch className="w-4 h-4" />
        {buttonLabel}
      </button>
    </form>
  );
});

TrackOrderInput.displayName = "TrackOrderInput";

/**
 * Public, login-free order tracking page.
 * /track/:orderId loads the order from GET /api/track/:orderId and renders a
 * vertical progress stepper, payment info, shipping address and item list.
 * /track (no ID) shows an order-ID input instead.
 */
export const TrackOrderPage = memo(function TrackOrderPage(): JSX.Element {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const {
    state,
    order,
    steps,
    isCancelled,
    cancelledDate,
    statusKey,
    placedDate,
    estimatedDelivery,
    orderIdDisplay,
    retry,
  } = useTrackOrder(orderId || "");

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleTrack = useCallback(
    (id: string) => {
      navigate(`/track/${encodeURIComponent(id)}`);
    },
    [navigate]
  );

  const statusMeta = TRACK_STATUS_META[statusKey];
  const StatusIcon = STATUS_ICONS[statusMeta.icon];

  const items = order?.items || [];
  const paymentMethodKey = (order?.paymentMethod || "").toLowerCase();
  const paymentMethodLabel = TRACK_PAYMENT_METHOD_LABEL[paymentMethodKey] || order?.paymentMethod || "N/A";
  const paymentStatusKey = (order?.paymentStatus || "").toLowerCase();
  const paymentStatusMeta =
    TRACK_PAYMENT_STATUS_META[paymentStatusKey] || {
      label: paymentStatusKey ? paymentStatusKey.charAt(0).toUpperCase() + paymentStatusKey.slice(1) : "Pending",
      badge: FALLBACK_PAYMENT_BADGE,
    };

  const canCancel = !isCancelled && statusKey === "pending";
  const canDownloadInvoice = statusKey !== "pending";

  const isCod = paymentMethodKey === "cod" || paymentMethodKey === "cash";
  const showCodCollectionNote = isCod && statusKey === "delivered" && (paymentStatusKey === "pending" || paymentStatusKey === "");

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      const orderId = order.orderId || order._id || order.id || "unknown";
      const addrParts = addressLine
        ? [addressLine, cityStatePin].filter(Boolean).join(", ")
        : "";
      const shippingAddr = addrParts || (typeof order.address === "string" ? order.address : "");
      await generateInvoicePdf({
        orderId,
        date: order.createdAt,
        items: order.items,
        customerName: shipping?.name,
        customerPhone: shipping?.phone,
        shippingAddress: shippingAddr,
        total: order.total,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
      });
      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to generate invoice. Please try again.");
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    const id = order._id || order.id || "";
    if (!id) return;
    setCancelling(true);
    try {
      const res = await cancelOrder(id);
      if (!res?.success) throw new Error("Cancel failed");
      toast.success("Order cancelled successfully");
      setCancelModalOpen(false);
      retry();
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      toast.error(status === 401 ? "Please sign in to cancel this order." : "Failed to cancel order. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const shipping: TrackShippingAddress | null =
    order?.shippingAddress || (typeof order?.address === "object" ? order.address : null) || null;
  const addressString = typeof order?.address === "string" ? order.address : "";
  const addressLine = shipping
    ? [shipping.addressLine1, shipping.addressLine2].filter(Boolean).join(", ")
    : addressString;
  const cityStatePin = shipping
    ? ([shipping.city, shipping.state].filter(Boolean).join(", ") + (shipping.pincode ? ` - ${shipping.pincode}` : ""))
    : "";

  return (
    <div className="min-h-screen w-full bg-[#0c1018] text-gray-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0c1018]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={BRAND_LOGO_URL} alt="Jachi Muchi" className="h-9 w-auto object-contain" />
            <span className="text-lg font-bold tracking-tight text-gray-100">Jachi Muchi</span>
          </Link>
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Track Order</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-5">
        {state.phase === "idle" && (
          <section className={CARD}>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mb-4">
                <PackageSearch className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-lg font-semibold text-gray-100 mb-1">Track your order</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Enter the order ID from your confirmation SMS, email or WhatsApp message.
              </p>
            </div>
            <TrackOrderInput onSubmit={handleTrack} />
          </section>
        )}

        {state.phase === "loading" && (
          <section className={CARD}>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              Fetching your order{orderId ? ` #${orderId}` : ""}…
            </div>
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

        {state.phase === "not_found" && (
          <section className={CARD}>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <PackageSearch className="w-7 h-7 text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-100 mb-1">Order not found</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                We couldn't find an order with that ID. Check the link you received or try entering it again.
              </p>
            </div>
            <TrackOrderInput onSubmit={handleTrack} buttonLabel="Try Another Order" hint="Double-check the order ID from your confirmation message." />
          </section>
        )}

        {state.phase === "error" && (
          <section className={CARD}>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mb-4">
                <X className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-100 mb-1">Something went wrong</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                We couldn't load your order right now. Please try again in a moment.
              </p>
              <button
                onClick={retry}
                className="mb-6 inline-flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-5 py-2.5 transition-colors"
              >
                <RotateCw className="w-4 h-4" /> Retry
              </button>
            </div>
            <TrackOrderInput onSubmit={handleTrack} buttonLabel="Try Another Order" />
          </section>
        )}

        {state.phase === "success" && order && (
          <>
            <section className={CARD}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-sm sm:text-base font-semibold text-gray-100 break-all">{orderIdDisplay}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {placedDate && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" /> Placed on {placedDate}
                      </span>
                    )}
                    {estimatedDelivery && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Truck className="w-3.5 h-3.5" /> Est. delivery {estimatedDelivery}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 self-start ${statusMeta.badge}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusMeta.label}
                </span>
              </div>
            </section>

            <section className={CARD}>
              <h2 className="text-sm font-semibold text-gray-100 mb-5">Order Progress</h2>
              <TrackingStepper steps={steps} isCancelled={isCancelled} cancelledDate={cancelledDate} />
            </section>

            <section className={CARD}>
              <h2 className="text-sm font-semibold text-gray-100 mb-4">Payment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-gray-500 mb-1.5">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-gray-400 shrink-0" />
                    <p className="text-sm font-medium text-gray-100">{paymentMethodLabel}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-gray-500 mb-1.5">Payment Status</p>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${paymentStatusMeta.badge}`}>
                    {paymentStatusMeta.label}
                  </span>
                </div>
              </div>
              {showCodCollectionNote && (
                <p className="mt-3 flex items-start gap-1.5 text-xs text-gray-400">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
                  Payment pending confirmation — this amount will be collected on delivery.
                </p>
              )}
            </section>

            <section className={CARD}>
              <h2 className="text-sm font-semibold text-gray-100 mb-4">Shipping Address</h2>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm space-y-0.5">
                  <p className="font-medium text-gray-100">{maskName(shipping?.name)}</p>
                  {addressLine && <p className="text-gray-400">{addressLine}</p>}
                  {cityStatePin && <p className="text-gray-400">{cityStatePin}</p>}
                  {!addressLine && !cityStatePin && <p className="text-gray-500">Not available</p>}
                </div>
              </div>
            </section>

            <section className={CARD}>
              <h2 className="text-sm font-semibold text-gray-100 mb-4">Items ({items.length})</h2>
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">No items found for this order.</p>
              ) : (
                <ul className="divide-y divide-white/10">
                  {items.map((item, index) => (
                    <li key={index} className="flex gap-3 sm:gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name || "Product"}
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-100 line-clamp-2">{item.name || "Product"}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity || 1}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-gray-100">
                          {item.price === 0 ? <span className="text-green-400">FREE</span> : `₹${item.price ?? 0}`}
                        </p>
                        {(item.quantity || 1) > 1 && item.price ? (
                          <p className="text-xs text-gray-500 mt-0.5">₹{item.price} each</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className={CARD}>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={!canDownloadInvoice}
                  title={canDownloadInvoice ? undefined : "Invoice available after confirmation"}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-gray-200 transition-colors ${
                    canDownloadInvoice ? "hover:bg-white/10 cursor-pointer" : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                {canCancel && (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 py-3 text-sm font-semibold text-red-300 transition-colors hover:bg-red-400/20 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Cancel Order
                  </button>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="mx-auto max-w-2xl px-4 sm:px-6 pb-8 pt-2 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Jachi Muchi · Need help with your order? Contact customer support.
      </footer>

      <CancelOrderModal
        orderId={orderIdDisplay}
        open={cancelModalOpen && canCancel}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        loading={cancelling}
      />
    </div>
  );
});

TrackOrderPage.displayName = "TrackOrderPage";
