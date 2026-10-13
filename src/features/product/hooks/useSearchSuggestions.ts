import { useEffect, useState } from "react";
import { getSearchSuggestions } from "@/features/product/api/searchApi";

/** Live phrases only start at this many characters. */
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

/**
 * Debounced typeahead phrases for a search box, shared by the desktop search
 * dropdown and the mobile full-screen search.
 *
 * Fires `getSearchSuggestions` only once the trimmed query reaches
 * {@link MIN_QUERY_LENGTH} characters, 300 ms after the visitor stops typing,
 * and aborts the previous in-flight request (AbortController) so a slow earlier
 * response can never overwrite a newer one. A blank or too-short query resolves
 * to no phrases without a request. Network errors resolve to no phrases.
 */
export function useSearchSuggestions(query: string): {
  phrases: string[];
  loading: boolean;
} {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setPhrases([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timerId = setTimeout(() => {
      getSearchSuggestions(trimmed, controller.signal)
        .then((data) => {
          if (controller.signal.aborted) return;
          setPhrases(data.phrases);
          setLoading(false);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setPhrases([]);
          setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timerId);
      controller.abort();
    };
  }, [query]);

  return { phrases, loading };
}
