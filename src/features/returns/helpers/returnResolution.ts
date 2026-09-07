import { RETURN_STATUS_KEY_BY_VALUE } from "@/features/returns/constants";
import type { MyReturnItem } from "@/features/returns/types";

/** Normalize a possibly-raw status value into the canonical status key. */
export function normalizeStatus(value?: string | number): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Best-effort start time of a return request, used to pick the MOST RECENT
 * attempt when several records exist for the same order item. Falls back to
 * each record's `createdAt`/`requestedAt`/first timeline entry; returns 0 when
 * no timestamp is available so records simply tie.
 */
export function recordStartTime(item: MyReturnItem): number {
  const raw =
    item.createdAt ||
    item.requestedAt ||
    item.statusTimeline?.[0]?.date ||
    item.statusTimeline?.[0]?.timestamp ||
    "";
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

/**
 * Extract the admin's (structured) rejection reason from any supported
 * backend shape: the top-level `rejectionReason` first, then the nested
 * `rejection.reason` and `rejection` as a string. `message`/`note` inside the
 * nested object are treated as the customer-safe secondary note (see
 * `extractRejectionNote`) and only used as a last-resort reason for legacy
 * shapes that carry no dedicated reason field.
 */
export function extractRejectionReason(item: MyReturnItem): string | undefined {
  const direct = typeof item.rejectionReason === "string" ? item.rejectionReason.trim() : "";
  if (direct) return direct;

  const nested = item.rejection;
  if (typeof nested === "string" && nested.trim()) return nested.trim();
  if (nested && typeof nested === "object") {
    const reason = nested.reason;
    if (typeof reason === "string" && reason.trim()) return reason.trim();

    const legacy = nested.message || nested.note;
    if (typeof legacy === "string" && legacy.trim()) return legacy.trim();
  }

  return undefined;
}

/**
 * Extract the optional customer-safe note a support admin may attach to a
 * rejection — distinct from the structured reason. Sources, in priority order:
 * top-level `rejectionNote`, then the nested `rejection.note` / `message`.
 * Returns undefined when there is no note, so consumers simply hide the
 * "Additional note from support" line.
 */
export function extractRejectionNote(item: MyReturnItem): string | undefined {
  const direct = typeof item.rejectionNote === "string" ? item.rejectionNote.trim() : "";
  if (direct) return direct;

  const nested = item.rejection;
  if (nested && typeof nested === "object") {
    const note = nested.note || nested.message;
    if (typeof note === "string" && note.trim()) return note.trim();
  }

  return undefined;
}

/** Coerce a backend flag (boolean | number | "true"/"1"/"yes") into a real boolean. */
function truthy(flag: boolean | number | string | undefined): boolean {
  if (typeof flag === "number") return flag > 0;
  if (typeof flag === "boolean") return flag;
  const s = (flag || "").trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

/**
 * Whether a rejected return is the customer's final one — either the backend
 * explicitly says so (maxAttemptsReached / finalRejection, including a nested
 * `rejection` object) or the raw data shows two or more rejected attempts for
 * the same order item.
 */
export function isFinalRejection(item: MyReturnItem, rejectedCount?: number): boolean {
  if (truthy(item.maxAttemptsReached) || truthy(item.finalRejection)) return true;

  const nested = item.rejection;
  if (nested && typeof nested === "object") {
    if (
      truthy((nested as { final?: boolean | number | string }).final) ||
      truthy((nested as { maxAttemptsReached?: boolean | number | string }).maxAttemptsReached)
    ) {
      return true;
    }
  }

  const explicitCount = item.attemptCount != null ? Number(item.attemptCount) : undefined;
  const explicitRejections =
    item.rejectionCount != null ? Number(item.rejectionCount) : undefined;
  if (typeof explicitCount === "number" && !Number.isNaN(explicitCount) && explicitCount >= 2) {
    return true;
  }
  if (
    typeof explicitRejections === "number" &&
    !Number.isNaN(explicitRejections) &&
    explicitRejections >= 2
  ) {
    return true;
  }
  if (typeof rejectedCount === "number" && rejectedCount >= 2) return true;

  return false;
}

/**
 * Whether ANY return record belonging to an order carries the explicit
 * "final rejection" backend flag. Used on the Orders page so the two-attempt
 * limit is respected even when a rejected record can't be matched to an order
 * item by id (the flag itself is the authority).
 */
export function hasFinalRejectionFlag(items: MyReturnItem[], orderId?: string): boolean {
  if (!orderId) return false;
  for (const item of items) {
    if (item.orderId !== orderId) continue;
    if (isFinalRejection(item, 0)) return true;
  }
  return false;
}

/**
 * Count how many distinct rejected return records exist for the same order
 * item. Used with the raw (pre-dedupe) /returns/my list to detect a second
 * rejection even when the per-item record collapses to a single entry.
 */
export function countAttemptedRejections(
  items: MyReturnItem[],
  orderId?: string,
  orderItemId?: string
): number {
  if (!orderId || !orderItemId) return 0;
  let count = 0;
  for (const item of items) {
    if (item.orderId !== orderId || item.orderItemId !== orderItemId) continue;
    if (RETURN_STATUS_KEY_BY_VALUE[normalizeStatus(item.status)] === "rejected") count += 1;
  }
  return count;
}