import { useEffect, useState } from "react";
import { getCollectionSections } from "@/features/home/api/collectionSectionApi";
import type { CollectionSection } from "@/features/home/types";

interface UseCollectionSectionsResult {
  sections: CollectionSection[];
  isLoading: boolean;
}

export function useCollectionSections(): UseCollectionSectionsResult {
  const [sections, setSections] = useState<CollectionSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCollectionSections()
      .then((data) => {
        if (!cancelled) setSections(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { sections, isLoading };
}
