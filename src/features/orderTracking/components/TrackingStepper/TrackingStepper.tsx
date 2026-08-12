import { memo } from "react";
import { Check, ClipboardCheck, Package, PackageCheck, PackageSearch, Truck, XCircle } from "lucide-react";
import type { TrackingStep } from "@/features/orderTracking/types";

interface TrackingStepperProps {
  steps: TrackingStep[];
  isCancelled?: boolean;
  cancelledDate?: string;
}

const STEP_ICONS: Record<TrackingStep["key"], typeof Package> = {
  pending: Package,
  confirmed: ClipboardCheck,
  processing: Truck,
  shipped: PackageSearch,
  delivered: PackageCheck,
};

/**
 * Vertical order-progress stepper (Pending → Confirmed → Processing → Shipped →
 * Delivered). Completed steps show a green check + timestamp, the current
 * (in-progress) step is highlighted with the brand accent and a pulse, future
 * steps are greyed out. A cancelled order replaces the stepper entirely with a
 * distinct red cancelled state showing when it was cancelled.
 */
export const TrackingStepper = memo(function TrackingStepper({
  steps,
  isCancelled,
  cancelledDate,
}: TrackingStepperProps): JSX.Element | null {
  if (isCancelled) {
    return (
      <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-400/15 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-300">Order Cancelled</p>
            <p className="text-xs text-red-300/70 mt-1">
              {cancelledDate
                ? `Cancelled on ${cancelledDate}. This order will not be processed further.`
                : "This order was cancelled and will not be processed further."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (steps.length === 0) return null;

  return (
    <ol className="relative">
      {steps.map((step, index) => {
        const Icon = STEP_ICONS[step.key];
        const isLast = index === steps.length - 1;
        const nextReached = !isLast && steps[index + 1].state !== "future";
        const isCurrent = step.state === "current";
        const isCompleted = step.state === "completed";

        return (
          <li key={step.key} className="relative flex gap-3.5 pb-8 last:pb-0">
            {!isLast && (
              <div className={`absolute left-[15px] top-9 bottom-1 w-px ${nextReached ? "bg-green-500/50" : "bg-white/10"}`} />
            )}
            <div className="relative shrink-0">
              {isCurrent && <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center ${
                  isCurrent
                    ? "bg-accent text-white shadow-lg shadow-accent/40"
                    : isCompleted
                      ? "bg-green-500/90 text-white"
                      : "border border-white/15 bg-white/5 text-gray-500"
                }`}
              >
                {isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                ) : isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  <Icon className="w-4 h-4" strokeWidth={2} />
                )}
              </div>
            </div>
            <div className="pt-1 min-w-0">
              <p
                className={`text-sm ${isCurrent ? "font-semibold text-white" : isCompleted ? "font-medium text-gray-100" : "text-gray-500"}`}
              >
                {step.label}
              </p>
              {step.timestamp && (
                <p className={`text-xs mt-0.5 ${isCurrent ? "text-accent" : "text-gray-500"}`}>{step.timestamp}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
});

TrackingStepper.displayName = "TrackingStepper";
