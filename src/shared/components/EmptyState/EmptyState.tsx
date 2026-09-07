import { memo, type ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  /** Icon shown in the soft circular badge above the title. */
  icon?: LucideIcon;
  /** Primary heading (e.g. "No orders yet"). */
  title: string;
  /** Optional supporting line under the heading. */
  description?: string;
  /** Optional call-to-action node (Link or button) rendered below the text. */
  action?: ReactNode;
  /** Extra classes merged onto the outer centered container. */
  className?: string;
}

const DEFAULT_ICON: LucideIcon = Inbox;

/**
 * Consistent "no data" state used across the account module (and beyond):
 * a soft circular icon badge centered above a heading, a short supporting
 * line, and an optional call-to-action so users are never left at a dead end.
 * Replaces ad-hoc plain-text empty messages with one shared visual pattern
 * (grounded white card, soft gray badge, gray-900 heading, muted description,
 * teal action) so every "no data" screen looks the same.
 */
export const EmptyState = memo(function EmptyState({
  icon: Icon = DEFAULT_ICON,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl text-center py-16 px-6 ${className}`}
    >
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <Icon className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-7 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
});