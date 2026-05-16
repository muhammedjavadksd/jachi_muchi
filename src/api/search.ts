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

export interface SearchResult {
  suggestions: string[];
  categories: string[];
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function searchSuggestions(query: string): Promise<SearchResult> {
  await delay(200);
  const q = query.toLowerCase().trim();
  if (!q) return { suggestions: [], categories: [] };
  const suggestions = MOCK_KEYWORDS.filter((kw) => kw.includes(q)).slice(0, 6);
  const categories = MOCK_CATEGORIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 3);
  return { suggestions, categories };
}
