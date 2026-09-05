import { useCallback, useEffect, useState } from "react";
import { getReturnEligibility } from "@/features/returns/api/returnApi";

type EligibilityState =
  | { phase: "loading" }
  | { phase: "ready"; eligible: boolean; reason?: string; deadline?: string; daysLeft?: number }
  | { phase: "error" };

/**
 * Wrap the eligibility `deadline` in "days left" terms so the UI can show a
 * "X days left to return" notice when the window is about to expire.
 */
export function computeDaysLeft(deadline?: string): number | undefined {
  if (!deadline) return undefined;
  const deadlineTime = new Date(deadline).getTime();
  if (Number.isNaN(deadlineTime)) return undefined;
  const diffMs = deadlineTime - Date.now();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Fetch return eligibility for one delivered order item. Resilient to fetch
 * failure (networks hiccup / backend partially unavailable) so the order list
 * never breaks even if eligibility can't be loaded.
 */
export function useReturnEligibility(orderId: string): EligibilityState {
  const [state, setState] = useState<EligibilityState>({ phase: "loading" });

  const fetchEligibility = useCallback(async (id: string) => {
    if (!id) {
      setState({ phase: "ready", eligible: false });
      return;
    }
    setState({ phase: "loading" });
    try {
      const data = await getReturnEligibility(id);
      const eligible = Boolean(data.eligible);
      setState({
        phase: "ready",
        eligible,
        reason: data.reason,
        deadline: data.deadline,
        daysLeft: computeDaysLeft(data.deadline),
      });
    } catch {
      // Opt for safety: if we can't confirm eligibility, don't offer returns.
      setState({ phase: "error" });
    }
  }, []);

  useEffect(() => {
    fetchEligibility(orderId);
  }, [orderId, fetchEligibility]);

  return state;
}
