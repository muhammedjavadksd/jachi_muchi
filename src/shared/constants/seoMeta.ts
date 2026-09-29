/**
 * Approved per-page SEO copy for the storefront.
 *
 * Single source of truth for document titles, meta descriptions, keywords and
 * canonical paths. Every `canonicalPath` below is verified against the live
 * route table in `src/app/routes/index.tsx`.
 *
 * NOTE: `faqs.canonicalPath` is `/faq` — the live route. The spec draft
 * originally said `/faqs`, which is not a declared route and would resolve to
 * the `*` NotFoundPage catch-all, so it was corrected rather than added as a
 * new route.
 *
 * MOI / driving-license / Metrash2 wording lives in exactly ONE entry,
 * `moiApprovedEyeTest`, and that entry is consumed only by
 * `/moi-approved-eye-test-qatar`. The other eye-test surfaces —
 * `onlineEyeTest` (`/online-eye-test`) and `eyeTestHomeVisit`
 * (`/home-try-on`) — must stay free of it: the online webcam screening is not
 * confirmed as MOI-approved, and advertising it as such is both a Google Ads
 * policy problem and a plain false claim.
 *
 * Routes deliberately absent from this map (cart, checkout, account, policies,
 * support, warranty, collections, services, and the remaining
 * `/online-eye-test/*` wizard steps) have no approved copy yet and therefore
 * fall back to the static `<title>` / `<meta name="description">` in
 * `index.html`.
 */

export interface SeoMetaEntry {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  /**
   * Optional social-only overrides. Both default to the SERP `title` /
   * `description` when omitted, so entries that need no divergence stay silent.
   */
  ogTitle?: string;
  ogDescription?: string;
}

/**
 * App-wide fallback, mirroring the static `<title>` / `description` /
 * `og:title` / `og:description` in `index.html`.
 *
 * This is mounted unconditionally in `src/main.tsx` (alongside `PageTracking`)
 * because `react-helmet-async` removes the `data-rh`-marked static tags from
 * `index.html` once it takes them over. Without this default instance, arriving
 * at a route that has no page-level `<SEO>` override would leave the document
 * with no description/OG tags at all until a full reload.
 *
 * It deliberately declares no `canonicalPath`, so routes without an override
 * do not inherit a bogus canonical pointing at `/`.
 *
 * KEEP IN SYNC with `index.html` — that file is what crawlers see, since this
 * is a client-rendered SPA with no SSR/prerender.
 */
export const defaultMeta: Pick<SeoMetaEntry, "title" | "description"> = {
  title: "Jachi Muchi — Premium Eyewear",
  description:
    "Shop premium glasses, sunglasses and lenses at Jachi Muchi. Free home try-on, online eye test, and fast delivery.",
};

export const seoMeta = {
  home: {
    title: "Jachi & Muchi | Premium Eyewear & Opticals in Qatar",
    description:
      "Shop premium eyeglasses, designer sunglasses, and screen glasses in Qatar. Book certified eye tests, visit our stores, or schedule a home try-on today.",
    keywords:
      "opticals in qatar, glasses shop doha, eyewear store qatar, prescription glasses doha",
    canonicalPath: "/",
  },
  moiApprovedEyeTest: {
    title: "MOI Approved Eye Test Qatar | Driving License Eye Test – Jachi & Muchi",
    description:
      "Get your eye test for a Qatar driving license at Jachi & Muchi Opticals. Visit our store, walk-in or WhatsApp booking.",
    keywords:
      "MOI approved eye test centre Qatar, driving license eye test Doha, Metrash2 eye test renewal, optical center for driving license test Qatar",
    canonicalPath: "/moi-approved-eye-test-qatar",
    ogTitle: "MOI Approved Eye Test for Qatar Driving License & Metrash2",
    ogDescription:
      "Fast, hassle-free vision testing for your Qatar driving license. Visit Jachi & Muchi Opticals.",
  },
  onlineEyeTest: {
    title: "Online Eye Test Qatar | Free Vision Screening – Jachi & Muchi",
    description:
      "Take a quick online vision screening from home, or book an optometrist home eye test anywhere in Qatar with Jachi & Muchi.",
    keywords:
      "online eye test qatar, free vision screening doha, home eye test qatar, eyesight test at home",
    canonicalPath: "/online-eye-test",
    ogTitle: "Online Eye Test Qatar | Free Vision Screening – Jachi & Muchi",
    ogDescription:
      "Take a quick online vision screening from home, or book an optometrist home eye test anywhere in Qatar with Jachi & Muchi.",
  },
  eyeglasses: {
    title: "Eyeglasses in Qatar | Prescription Frames – Jachi & Muchi",
    description:
      "Explore trendy, durable prescription glasses and optical frames for men & women in Qatar. High-index, anti-glare, and progressive lenses fitted by experts.",
    keywords:
      "eyeglasses qatar, prescription spectacles doha, optical frames qatar, progressive lenses doha",
    canonicalPath: "/search/eyeglasses",
  },
  sunglasses: {
    title: "Designer Sunglasses in Qatar | UV Eyewear – Jachi & Muchi",
    description:
      "Protect your eyes in style with 100% UV protection and polarized sunglasses in Qatar. Browse top international brands and exclusive modern collections.",
    keywords:
      "sunglasses qatar, polarized shades doha, designer sunglasses qatar, uv protection eyewear",
    canonicalPath: "/search/sunglasses",
  },
  screenGlasses: {
    title: "Blue Light & Screen Glasses in Qatar | Jachi & Muchi",
    description:
      "Reduce digital eye strain and headaches with Jachi & Muchi anti-blue light computer glasses. Available with or without prescription across Qatar.",
    keywords:
      "blue light glasses qatar, computer glasses doha, digital eye strain glasses, anti-glare spectacles",
    canonicalPath: "/search/screen-glasses",
  },
  kidsGlasses: {
    title: "Kids Eyeglasses in Qatar | Flexible Frames – Jachi & Muchi",
    description:
      "Safe, flexible, and stylish kids' eyeglasses designed for active youngsters in Qatar. Impact-resistant lenses and comfortable fits children love to wear.",
    keywords:
      "kids glasses qatar, children eyewear doha, flexible kids frames, vision care for children",
    canonicalPath: "/search/kids-glasses",
  },
  eyeTestHomeVisit: {
    title: "Book Eye Test in Qatar | In-Store & 60-Min Home Try-On",
    description:
      "Accurate computerized vision testing by certified optometrists. Visit our optical branches or book an optometrist home visit anywhere in Qatar.",
    keywords:
      "eye test qatar, optometrist checkup doha, home eye test qatar, computerized eye exam",
    canonicalPath: "/home-try-on",
  },
  storeLocator: {
    title: "Jachi & Muchi Optical Stores in Qatar | Wakra & Gharaffa",
    description:
      "Find your nearest Jachi & Muchi optical branch in Qatar. Check opening hours, store locations at Ezdan Mall Al Wakra, Ezdan Mall Al Gharaffa, and contact details.",
    keywords:
      "opticals ezdan mall wakra, jachi and muchi gharrafa, optical shop near me qatar",
    canonicalPath: "/stores",
  },
  aboutUs: {
    title: "About Jachi & Muchi | Qatar's Modern Eyewear Brand",
    description:
      "Founded in Qatar in 2018, Jachi & Muchi combines advanced optical precision with contemporary fashion to deliver clear vision and confident everyday style.",
    keywords:
      "about jachi and muchi, qatar optical brand, eyewear company doha",
    canonicalPath: "/about",
  },
  contactUs: {
    title: "Contact Jachi & Muchi Qatar | Customer Care & WhatsApp",
    description:
      "Have questions about your prescription or order? Reach out to the Jachi & Muchi Qatar team via WhatsApp, call our stores, or visit one of our optical boutiques.",
    keywords:
      "jachi and muchi contact, optical store whatsapp qatar, customer support eyewear",
    canonicalPath: "/contact",
  },
  faqs: {
    title: "FAQs | Eyewear, Eye Tests & Delivery – Jachi & Muchi Qatar",
    description:
      "Got questions about eye tests, lens options, warranty, or delivery in Qatar? Find quick answers in our official Jachi & Muchi FAQ.",
    keywords:
      "eyewear faq qatar, lens warranty doha, optical test questions qatar",
    canonicalPath: "/faq",
  },
} satisfies Record<string, SeoMetaEntry>;
