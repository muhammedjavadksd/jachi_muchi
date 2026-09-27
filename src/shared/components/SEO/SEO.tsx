import { memo } from "react";
import { Helmet } from "react-helmet-async";

/** Absolute production origin used to build canonical and `og:url` values. */
const SITE_URL = "https://jachiandmuchi.com";

export interface SEOProps {
  /** Document title. Also used verbatim for `og:title`. */
  title: string;
  /** Meta description. Also used verbatim for `og:description`. */
  description: string;
  /**
   * Root-relative path of the page, e.g. `/stores`. Appended to `SITE_URL` to
   * form the absolute canonical URL.
   *
   * Omit for the app-wide default instance and for `noindex` pages, so no
   * canonical / `og:url` is emitted.
   */
  canonicalPath?: string;
  /** Optional `keywords` meta. Omitted from the head when not provided. */
  keywords?: string;
  /**
   * Emits `<meta name="robots" content="noindex, nofollow" />`. Use for
   * protected, transactional and account pages that must stay out of the index.
   */
  noIndex?: boolean;
}

/**
 * Per-page document metadata (title, description, keywords, canonical URL and
 * the matching Open Graph tags) for this client-side routed SPA.
 *
 * Mount inside a `HelmetProvider` (see `src/main.tsx`).
 *
 * IMPORTANT — how to avoid duplicate head tags in an SPA:
 * `react-helmet-async` only reconciles tags that carry its `data-rh` marker
 * (its `updateTags` queries `meta[data-rh]` / `link[data-rh]`). Any static
 * `<meta>` in `index.html` WITHOUT `data-rh` is invisible to it, so Helmet
 * appends a second copy and the stale first copy keeps winning. The three tags
 * this component owns (`description`, `og:title`, `og:description`) therefore
 * carry `data-rh="true"` in `index.html`, and an always-mounted default
 * instance (`seoMeta.defaultMeta`, rendered in `main.tsx`) re-asserts them for
 * routes without a page-level override.
 *
 * Only one instance should be active per page: Helmet dedupes by
 * `name`/`property`/`rel`, with the most recently mounted instance winning.
 */
export const SEO = memo(function SEO({
  title,
  description,
  canonicalPath,
  keywords,
  noIndex = false,
}: SEOProps): JSX.Element | null {
  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
    </Helmet>
  );
});

SEO.displayName = "SEO";
