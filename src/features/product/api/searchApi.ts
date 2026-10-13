import { api } from "@/shared/lib/axios";
import type { SearchResult, SearchSuggestions } from "@/features/product/types";

const MOCK_KEYWORDS = [
  "eyeglasses for men", "eyeglasses for women", "eyeglasses for kids",
  "clip-on glasses", "blue light blocking glasses", "computer glasses",
  "reading glasses", "sunglasses for men", "sunglasses for women",
  "aviator sunglasses", "wayfarer glasses", "round frame glasses",
  "square frame glasses", "cat eye glasses", "rimless glasses",
  "half rim glasses", "full rim glasses", "lightweight glasses",
  "tr 90 glasses", "titanium glasses", "acetate glasses",
  "metal frame glasses", "premium glasses", "designer glasses",
  "contact lenses", "lens cleaning solution", "glasses case",
  "sports glasses", "kids eyeglasses", "bifocal glasses", "progressive lenses",
];

const MOCK_CATEGORIES = [
  "Men", "Women", "Kids", "Sunglasses", "Contact Lenses", "Accessories",
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function searchSuggestions(query: string): Promise<SearchResult> {
  await delay(200);
  const q = query.toLowerCase().trim();
  if (!q) return { suggestions: [], categories: [] };
  const suggestions = MOCK_KEYWORDS.filter((kw) => kw.includes(q)).slice(0, 6);
  const categories = MOCK_CATEGORIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 3);
  return { suggestions, categories };
}

/**
 * Live typeahead suggestions from the search backend for the mobile
 * full-screen search. The optional `signal` lets the caller abort a superseded
 * request, so a slow earlier response can never overwrite a newer one.
 */
export async function getSearchSuggestions(
  query: string,
  signal?: AbortSignal
): Promise<SearchSuggestions> {
  const res = await api.get("/search/suggestions", {
    params: { q: query },
    signal,
  });
  const data = res.data?.data ?? res.data;
  return {
    products: data?.products ?? [],
    keywords: data?.keywords ?? data?.suggestions ?? [],
  };
}
