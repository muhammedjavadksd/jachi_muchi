import { useCallback, useState } from "react";
import { submitReturn } from "@/features/returns/api/returnApi";
import type { ReturnCreateRequest } from "@/features/returns/types";

type SubmitState =
  | { phase: "idle" }
  | { phase: "submitting" }
  | { phase: "success"; returnId?: string; message?: string }
  | { phase: "error"; message: string };

/**
 * Manage a single return-request submission. Tracks in-flight state so the
 * submit button can be disabled (preventing double-submission), and surfaces
 * a clear error message on failure.
 */
export function useSubmitReturn() {
  const [state, setState] = useState<SubmitState>({ phase: "idle" });

  const submit = useCallback(async (request: ReturnCreateRequest) => {
    setState({ phase: "submitting" });
    try {
      const res = await submitReturn(request);
      setState({
        phase: "success",
        returnId: res?.returnId,
        message: res?.message,
      });
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      let message = "Something went wrong submitting your return. Please try again.";
      if (err?.response?.status === 410) {
        message = "The return window for this item has expired.";
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }
      setState({ phase: "error", message });
    }
  }, []);

  const reset = useCallback(() => setState({ phase: "idle" }), []);

  return { state, submit, reset };
}
