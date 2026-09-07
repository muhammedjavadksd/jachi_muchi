import { memo } from "react";
import { Banknote, Check, Clock, Package, XCircle } from "lucide-react";
import {
  RETURN_DISCONTINUED_LABEL,
  RETURN_FINAL_REJECTION_MESSAGE,
  RETURN_REJECTED_FALLBACK_MESSAGE,
  RETURN_REJECTION_NOTE_LABEL,
  RETURN_STATUS_META,
} from "@/features/returns/constants";
import type { ReturnStatusKey } from "@/features/returns/types";
import type { ReturnTimelineStep } from "@/features/returns/hooks/useMyReturns";

interface ReturnStatusTrackerProps {
  statusKey: ReturnStatusKey;
  steps: ReturnTimelineStep[];
  rejectionReason?: string;
  /** Optional customer-safe note from support, shown under the reason. */
  rejectionNote?: string;
  /** True when the customer used up their second (final) return attempt. */
  isFinalRejection?: boolean;
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
 * stepper with a distinct red rejected state that surfaces the real admin
 * rejection reason, an optional customer-safe "additional note from support"
 * (when the backend provides one), or the final-attempt message after the
 * second rejection.
 */
export const ReturnStatusTracker = memo(function ReturnStatusTracker({
  statusKey,
  steps,
  rejectionReason,
  rejectionNote,
  isFinalRejection,
}: ReturnStatusTrackerProps): JSX.Element | null {
  if (statusKey === "rejected") {
    const message = isFinalRejection
      ? RETURN_FINAL_REJECTION_MESSAGE
      : rejectionReason
        ? `Reason: ${rejectionReason}`
        : RETURN_REJECTED_FALLBACK_MESSAGE;

    // Only surface the note when it differs from the reason itself (some
    // legacy backend shapes report the primary reason under message/note).
    const showNote = Boolean(
      rejectionNote && rejectionNote !== rejectionReason
    );

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700">
              {isFinalRejection ? RETURN_DISCONTINUED_LABEL : "Return Rejected"}
            </p>
            <p className="text-xs text-red-600 mt-1">{message}</p>
            {isFinalRejection && rejectionReason && (
              <p className="text-xs text-red-600/80 mt-1">Reason: {rejectionReason}</p>
            )}
            {showNote && (
              <p className="text-xs text-red-600/80 mt-1">
                {RETURN_REJECTION_NOTE_LABEL} {rejectionNote}
              </p>
            )}
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
