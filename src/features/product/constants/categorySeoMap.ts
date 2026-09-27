import { seoMeta, type SeoMetaEntry } from "@/shared/constants/seoMeta";

/**
 * Maps the `:category` route-param slug used by the shared SearchPage
 * (`/search/:category` and `/category/:category`) to its approved SEO entry.
 *
 * Slugs match the header navigation in `src/shared/constants` and the
 * product constants, e.g. `/search/eyeglasses`, `/search/screen-glasses`.
 *
 * Any slug not listed here is intentionally unmapped, so SearchPage renders no
 * `<SEO>` override and the static `index.html` metadata remains. Do not add
 * categories without approved copy from the SEO spec.
 */
export const CATEGORY_SEO_MAP: Readonly<Record<string, SeoMetaEntry>> = {
  eyeglasses: seoMeta.eyeglasses,
  sunglasses: seoMeta.sunglasses,
  "screen-glasses": seoMeta.screenGlasses,
  "kids-glasses": seoMeta.kidsGlasses,
};
