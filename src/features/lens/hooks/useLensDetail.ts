import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLensById, getSimilarLenses } from "@/features/lens/api/lensApi";
import { getLensCategoryId, getLensId } from "@/features/lens/utils/detail";
import type { LensItem } from "@/features/lens/types";

export type LensDetailStatus = "loading" | "success" | "not-found" | "error";

interface RequestLikeError {
  code?: string;
  response?: { status?: number };
}

function isCanceled(error: unknown): boolean {
  return (error as RequestLikeError | null)?.code === "ERR_CANCELED";
}

function isMissingLens(error: unknown): boolean {
  const status = (error as RequestLikeError | null)?.response?.status;
  return status === 404 || status === 400;
}

export function useLensDetail() {
  const { id } = useParams<{ id: string }>();
  const [lens, setLens] = useState<LensItem | null>(null);
  const [similar, setSimilar] = useState<LensItem[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [status, setStatus] = useState<LensDetailStatus>("loading");
  const [retryKey, setRetryKey] = useState(0);
  const [settledId, setSettledId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setLens(null);
      setStatus("not-found");
      setSettledId(undefined);
      return;
    }

    const controller = new AbortController();
    setLens(null);
    setSimilar([]);
    setStatus("loading");

    void getLensById(id, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setSettledId(id);
        if (!data) {
          setStatus("not-found");
          return;
        }
        setLens(data);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCanceled(error)) return;
        setSettledId(id);
        setStatus(isMissingLens(error) ? "not-found" : "error");
      });

    return () => controller.abort();
  }, [id, retryKey]);

  useEffect(() => {
    if (!lens) return;

    const lensId = getLensId(lens);
    const categoryId = getLensCategoryId(lens);

    if (!lensId || !categoryId) {
      setSimilar([]);
      setSimilarLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;
    setSimilarLoading(true);

    void getSimilarLenses(categoryId, lensId, controller.signal)
      .then((items) => {
        if (active) setSimilar(items);
      })
      .catch((error: unknown) => {
        if (active && !isCanceled(error)) setSimilar([]);
      })
      .finally(() => {
        if (active) setSimilarLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [lens]);

  const retry = useCallback(() => setRetryKey((key) => key + 1), []);

  // The response is tied to the route id it was requested for, not compared
  // with the id the API returns (slug / case / format may differ).
  const settled = settledId === id;
  const currentLens = settled && status === "success" ? lens : null;

  return {
    lens: currentLens,
    similar: currentLens ? similar : [],
    similarLoading: currentLens ? similarLoading : false,
    status: settled ? status : "loading",
    retry,
  };
}
