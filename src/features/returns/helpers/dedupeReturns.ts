import { RETURN_STATUS_KEY_BY_VALUE, RETURN_STATUS_RANK } from "@/features/returns/constants";
import { normalizeStatus, recordStartTime } from "./returnResolution";
import type { MyReturnItem } from "@/features/returns/types";

/** Progress rank of a raw record based on its (normalized) status. */
function returnRank(item: MyReturnItem): number {
  const key = RETURN_STATUS_KEY_BY_VALUE[normalizeStatus(item.status)] || "requested";
  return RETURN_STATUS_RANK[key] ?? 0;
}

/**
 * Winner comparison between two records of the same order item. The MOST
 * RECENTLY CREATED return request always reflects the item's live status (e.g.
 * a fresh "Requested" retry supersedes an older "Rejected" attempt), so
 * `recordStartTime` decides first. When timestamps tie or are missing, the
 * further-along status wins (Refunded > Collected > Accepted > Rejected >
 * Requested).
 */
function isBetter(a: MyReturnItem, b: MyReturnItem): boolean {
  const timeA = recordStartTime(a);
  const timeB = recordStartTime(b);
  if (timeA !== timeB) return timeA > timeB;
  return returnRank(a) > returnRank(b);
}

function mergeItem(existing: MyReturnItem, candidate: MyReturnItem): MyReturnItem {
  return isBetter(candidate, existing) ? candidate : existing;
}

/**
 * Deduplicate the raw /returns/my list so each order item is represented by a
 * single, accurate entry that matches the item's LIVE state. Two forms of
 * duplication are collapsed, carrying all fields of the winning record:
 *
 *  1. The exact same record returned twice (same `_id`/`returnId`) — a
 *     back-end or transport artifact.
 *  2. Multiple records for the same order item (orderId + orderItemId) — e.g. a
 *     re-request history where a first attempt was rejected and a later attempt
 *     is now Requested/Accepted/Refunded. The MOST RECENT request wins so both
 *     "My Returns" and "My Orders" reflect the current, not historical, state.
 *
 * Records that cannot be tied to an order item (missing orderId/orderItemId)
 * are always preserved, so genuinely distinct requests are never hidden.
 */
export function dedupeReturns(items: MyReturnItem[]): MyReturnItem[] {
  const byRecordId = new Map<string, MyReturnItem>();
  for (const item of items) {
    const recordId = item._id || item.returnId || "";
    if (!recordId) continue;
    const existing = byRecordId.get(recordId);
    byRecordId.set(recordId, existing ? mergeItem(existing, item) : item);
  }

  const dedupedById: MyReturnItem[] = [];
  const seenRecord = new Set<string>();
  for (const item of items) {
    const recordId = item._id || item.returnId || "";
    if (!recordId) {
      dedupedById.push(item);
      continue;
    }
    if (seenRecord.has(recordId)) continue;
    seenRecord.add(recordId);
    dedupedById.push(byRecordId.get(recordId) as MyReturnItem);
  }

  const byOrderItem = new Map<string, MyReturnItem>();
  for (const item of dedupedById) {
    const key = item.orderId && item.orderItemId ? `${item.orderId}::${item.orderItemId}` : "";
    if (!key) continue;
    const existing = byOrderItem.get(key);
    byOrderItem.set(key, existing ? mergeItem(existing, item) : item);
  }

  const result: MyReturnItem[] = [];
  const seenKey = new Set<string>();
  for (const item of dedupedById) {
    const key = item.orderId && item.orderItemId ? `${item.orderId}::${item.orderItemId}` : "";
    if (!key) {
      result.push(item);
      continue;
    }
    if (seenKey.has(key)) continue;
    seenKey.add(key);
    result.push(byOrderItem.get(key) as MyReturnItem);
  }

  return result;
}