import { useCallback, useEffect, useRef, useState } from "react";
import type { ReviewToastState } from "@/features/review/components/ReviewToast/ReviewToast";
import { REVIEW_TOAST_AUTO_DISMISS_MS } from "@/features/review/constants";

interface UseReviewToastResult {
  toast: ReviewToastState | null;
  showToast: (message: string, tone: ReviewToastState["tone"]) => void;
}

export function useReviewToast(): UseReviewToastResult {
  const [toast, setToast] = useState<ReviewToastState | null>(null);
  const timerRef = useRef<number | null>(null);

  const showToast = useCallback(
    (message: string, tone: ReviewToastState["tone"]) => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      setToast({ message, tone });
      timerRef.current = window.setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, REVIEW_TOAST_AUTO_DISMISS_MS);
    },
    []
  );

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    []
  );

  return { toast, showToast };
}
