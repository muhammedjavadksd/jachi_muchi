import { memo } from "react";
import { Banknote, Check, Clock, Package, XCircle } from "lucide-react";
import { RETURN_STATUS_META } from "@/features/returns/constants";
import type { ReturnStatusKey } from "@/features/returns/types";
import type { ReturnTimelineStep } from "@/features/returns/hooks/useMyReturns";

interface ReturnStatusTrackerProps {
  statusKey: ReturnStatusKey;
  steps: ReturnTimelineStep[];
  rejectionReason?: string;
}

const STEP_ICONS: Record<ReturnStatusKey, typeof Clock> = {
  requested: Clock,
  accepted: Check,
  collected: Package,
  refunded: Banknote,
  rejected: XCircle,
};

/**
 * Vertical return-status tracker (Requested -> Accepted -> Collected ->
 * Refunded). Completed steps show a check + timestamp, the current step is
 * highlighted, future steps are greyed out. A rejected return replaces the
 * stepper with a distinct red rejected state showing the rejection reason.
 */
export const ReturnStatusTracker = memo(function ReturnStatusTracker({
  statusKey,
  steps,
  rejectionReason,
}: ReturnStatusTrackerProps): JSX.Element | null {
  if (statusKey === "rejected") {
    return (
      <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-400/15 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-300">Return Rejected</p>
            <p className="text-xs text-red-300/70 mt-1">
              {rejectionReason
                ? `Reason: ${rejectionReason}`
                : "This return request was not approved. Please contact support for more details."}
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
        const meta = RETURN_STATUS_META[step.key];
        const isLast = index === steps.length - 1;
        const nextReached = !isLast && steps[index + 1].state !== "future";
        const isCurrent = step.state === "current";
        const isCompleted = step.state === "completed";

        return (
          <li key={step.key} className="relative flex gap-3.5 pb-8 last:pb-0">
            {!isLast && (
              <div className={`absolute left-[15px] top-9 bottom-1 w-px ${nextReached ? "bg-teal-500/50" : "bg-gray-200"}`} />
            )}
            <div className={`relative shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isCurrent
                ? "bg-teal-600 text-white"
                : isCompleted
                  ? "bg-teal-500 text-white"
                  : "border border-gray-300 bg-gray-50 text-gray-400"
            }`}>
              {isCompleted ? (
                <Check className="w-4 h-4" strokeWidth={3} />
              ) : (
                <Icon className="w-4 h-4" strokeWidth={2} />
              )}
            </div>
            <div className="pt-1 min-w-0">
              <p className={`text-sm ${isCurrent ? "font-semibold text-gray-900" : isCompleted ? "font-medium text-gray-800" : "text-gray-400"}`}>
                {meta.label}
              </p>
              {step.timestamp && (
                <p className={`text-xs mt-0.5 ${isCurrent ? "text-teal-600" : "text-gray-500"}`}>{step.timestamp}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
});

ReturnStatusTracker.displayName = "ReturnStatusTracker";
