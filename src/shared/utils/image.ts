const API_BASE_URL = "http://localhost:5000";

export function getImageUrl(path?: string | null, fallback = "https://placehold.co/400x300?text=Eyewear"): string {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads/")) return `${API_BASE_URL}${path}`;
  return path;
}
