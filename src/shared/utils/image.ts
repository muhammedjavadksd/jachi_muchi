import { resolveImageSrc, IMAGE_PLACEHOLDER } from "@/shared/utils/imageSrc";

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || "";

export function getImageUrl(path?: string | null, fallback: string = IMAGE_PLACEHOLDER): string {
  return resolveImageSrc(path, API_BASE_URL, fallback);
}
