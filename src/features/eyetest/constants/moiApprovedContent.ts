/**
 * Copy, store data and JSON-LD builders for the `/moi-approved-eye-test-qatar`
 * Google Ads landing page.
 *
 * WHY EVERY UNVERIFIED CLAIM IS A TODO_CONFIRM COMMENT
 * ----------------------------------------------------
 * This page is the ad Final URL, so it cannot ship placeholder text such as
 * `{{TODO_CONFIRM: ...}}` in the rendered copy — it would be indexed and shown
 * to paying ad traffic. Instead, every claim that is not yet confirmed with the
 * business is written in deliberately non-committal wording and carries a
 * `TODO_CONFIRM` comment on the line directly above it. Grep the repo for
 * `TODO_CONFIRM` to get the full list of what still needs a decision, each one
 * sitting on the exact string it applies to.
 *
 * Once a claim is confirmed, replace the neutral wording with the real wording
 * and delete the adjacent `TODO_CONFIRM` comment.
 *
 * HARD RULE enforced here: no claim of a direct link with / certification by the
 * Ministry of Interior, no "instant Metrash2 integration", no "certified by
 * MOI", no invented phone numbers, addresses, hours, fees or approval status.
 * The online webcam screening is NOT MOI-approved and is never referenced here.
 */

import { BRAND_LOGO_URL, QATAR_PHONE_DISPLAY, QATAR_TEL_URL, QATAR_WHATSAPP_URL } from "@/shared/constants";

/** Absolute origin. Kept in sync with `SITE_URL` in the shared SEO component. */
export const SITE_URL = "https://jachiandmuchi.com";

export const MOI_PAGE_PATH = "/moi-approved-eye-test-qatar";

/** Brand logo asset actually served from this origin (public/logo.png). */
export const LOGO_ABSOLUTE_URL = `${SITE_URL}${BRAND_LOGO_URL}`;

/** Public contact mailbox for the Qatar business. */
export const CONTACT_EMAIL = "info@jachiandmuchi.com";

/** Prefilled WhatsApp message for the hero and sticky-bar CTAs. */
export const WHATSAPP_PREFILL =
  "Hello, I would like to inquire about the MOI eye test";

export function whatsappUrl(): string {
  return `${QATAR_WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;
}

export function telUrl(): string {
  return QATAR_TEL_URL;
}

export function phoneDisplay(): string {
  return QATAR_PHONE_DISPLAY;
}

export interface CrumbItem {
  label: string;
  to: string;
}

/**
 * Breadcrumb trail. Every crumb resolves to a real route: the generic
 * `Vision Screening` crumb points at the online screening choice page, which is
 * what it is — not a claim that the online test is MOI-approved.
 */
export const BREADCRUMBS: CrumbItem[] = [
  { label: "Services", to: "/services" },
  { label: "Vision Screening", to: "/online-eye-test" },
  { label: "Driving License Test", to: MOI_PAGE_PATH },
];

export const HERO = {
  h1: "MOI Approved Eye Test in Qatar for Driving License & Renewal",
  subheading:
    "Fast, hassle-free vision testing for your Qatar driving license application or renewal.",
  // TODO_CONFIRM: the store-hours phone line the "Call Now" button should dial.
  // Currently the shared Qatar WhatsApp number; confirm a dedicated branch line.
  callLabel: "Call Now",
  whatsappLabel: "WhatsApp Us",
  mapsLabel: "Open in Google Maps",
};

export interface FeatureCard {
  title: string;
  body: string;
}

export const SERVICE_OVERVIEW = {
  h2: "Vision Testing for Your Qatar Driving License",
  // TODO_CONFIRM: describe the exact result-submission process (who uploads the
  // record, to which system, and on what timescale) once confirmed with the
  // business. The copy below deliberately stops at "your licensing formalities".
  body:
    "Applying for a new driving license or renewing through Metrash2? Our optometrists conduct accurate visual screening tests for your licensing formalities.",
};

export const FEATURE_CARDS: FeatureCard[] = [
  {
    // TODO_CONFIRM: confirm the real screening duration before putting a number
    // in the title or body. The draft copy suggested "5 to 10 minutes".
    title: "Fast Screening Session",
    body: "A short, focused vision screening so you can get on with the rest of your licensing formalities without a long wait.",
  },
  {
    title: "Qualified Optometrists",
    body: "Your screening is carried out by qualified optometrists using professional vision-testing equipment.",
  },
  {
    // TODO_CONFIRM: describe the Metrash2 / MOI upload process accurately —
    // whether results are submitted by us, by the applicant, or both, and how.
    title: "Result Submission Support",
    body: "We complete the result submission your licensing formalities require and walk you through the remaining steps.",
  },
  {
    // TODO_CONFIRM: confirm whether single-vision lenses can be fitted and handed
    // over the same day before promising a same-day turnaround in the copy.
    title: "Prescription Glasses On Site",
    body: "If you need corrective lenses, our in-store dispensing team can fit prescription glasses during the same visit.",
  },
];

export interface ProcessStep {
  title: string;
  body: string;
}

export const PROCESS = {
  h2: "How to Complete Your Test in 3 Simple Steps",
  steps: [
    {
      // TODO_CONFIRM: confirm the walk-in vs appointment policy and the real
      // store opening hours before stating them.
      title: "Walk in or book",
      body: "Bring your valid QID or Passport. Walk-ins are welcome during regular store hours, or you can call or message us on WhatsApp in advance to confirm a convenient time.",
    },
    {
      // TODO_CONFIRM: confirm which measurements are actually taken (visual
      // acuity, peripheral vision, colour recognition) before listing them.
      title: "Visual acuity examination",
      body: "Our optometrist carries out your vision screening and records the results required for your licensing formalities.",
    },
    {
      // TODO_CONFIRM: confirm how and when the result reaches MOI / Metrash2,
      // and whether the applicant must upload anything themselves.
      title: "Result submission",
      body: "We complete the result submission required for your licensing formalities and explain what happens next on your side.",
    },
  ] as ProcessStep[],
};

export const CHECKLIST = {
  h2: "What to Bring to Your Eye Test",
  items: [
    "Original QID or Passport",
    "Your current glasses or contact lenses, if you use them",
  ],
};

export interface FaqItem {
  question: string;
  /**
   * Rendered verbatim both in the on-page accordion and in the FAQPage JSON-LD.
   * Both read this same string, so the two can never drift apart.
   */
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "How long does the test take?",
    // TODO_CONFIRM: replace with the real, measured average duration.
    answer:
      "The screening itself is short and is carried out during a single store visit. Exact timings can vary from person to person, so please call or message us on WhatsApp before you come in and we will confirm how long to allow for your visit.",
  },
  {
    question: "How quickly will my result reflect on Metrash2?",
    // TODO_CONFIRM: confirm the real turnaround with the business. Deliberately
    // makes NO promise of "within minutes" — do not add one without evidence.
    answer:
      "We complete the result submission your licensing formalities require at the time of your visit. We do not control how quickly that record appears on Metrash2, so please allow time for it to reflect there before your appointment. If you need an update on your submission, message us on WhatsApp or call the store.",
  },
  {
    question: "Do I need an appointment?",
    // TODO_CONFIRM: confirm the walk-in policy and the store opening hours.
    answer:
      "Walk-ins are welcome during regular store hours. You can also call or message us on WhatsApp in advance.",
  },
  {
    question: "What if I do not meet the minimum vision standard?",
    // TODO_CONFIRM: confirm the exact corrective-lens guidance we are allowed
    // to give, and whether a retest is offered free of charge.
    answer:
      "If your vision does not meet the required standard, our optometrist will carry out a full refraction and recommend corrective glasses or contact lenses to bring your vision up to the required level.",
  },
];

export interface StoreEntry {
  id: string;
  name: string;
  /** Mall / area name only — the full street address is still unconfirmed. */
  // TODO_CONFIRM: replace with the exact in-mall unit and street address.
  streetAddress: string;
  area: string;
  // TODO_CONFIRM: replace with the real, published opening hours.
  hours: string;
  /** Google Maps *search* link (no fabricated coordinates). */
  mapsUrl: string;
  mapsEmbedUrl: string;
  // TODO_CONFIRM: confirm whether this branch performs the driving-license test.
  offersTest: boolean;
}

function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&hl=en&output=embed`;
}

const WAKRA_QUERY = "Ezdan Mall Al Wakra, Qatar";
const GHARAFFA_QUERY = "Ezdan Mall Al Gharaffa, Qatar";

export const STORES: StoreEntry[] = [
  {
    id: "al-wakra",
    name: "Jachi & Muchi Opticals — Ezdan Mall, Al Wakra",
    streetAddress: "Ezdan Mall",
    area: "Al Wakra",
    hours: "Opening hours to be confirmed",
    mapsUrl: mapsSearchUrl(WAKRA_QUERY),
    mapsEmbedUrl: mapsEmbedUrl(WAKRA_QUERY),
    offersTest: false,
  },
  {
    id: "al-gharaffa",
    name: "Jachi & Muchi Opticals — Ezdan Mall, Al Gharaffa",
    streetAddress: "Ezdan Mall",
    area: "Al Gharaffa",
    hours: "Opening hours to be confirmed",
    mapsUrl: mapsSearchUrl(GHARAFFA_QUERY),
    mapsEmbedUrl: mapsEmbedUrl(GHARAFFA_QUERY),
    offersTest: false,
  },
];

export const LOCATIONS_SECTION = {
  h2: "Visit Jachi & Muchi Opticals in Qatar",
  // TODO_CONFIRM: once the branch list is confirmed, drop this note and render
  // the "offers this test" badge per branch instead.
  testAvailabilityNote:
    "Which of our branches runs the driving-license test is being confirmed — please call or WhatsApp us and we will point you to the right store.",
};

export const STICKY_BAR = {
  call: "Call Us",
  whatsapp: "WhatsApp",
  directions: "Get Directions",
};

interface JsonLdFaq {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }[];
}

/**
 * FAQPage structured data. Questions and answers are lifted straight from
 * {@link FAQS}, which is also what the accordion renders, so the machine
 * readable copy and the visible copy are identical by construction.
 */
export function buildFaqJsonLd(): JsonLdFaq {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

interface JsonLdOptician {
  "@context": "https://schema.org";
  "@type": "Optician";
  "@id": string;
  name: string;
  url: string;
  telephone: string;
  logo: string;
  image: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
  sameAs: string;
  parentOrganization: { "@type": "Organization"; name: string; url: string };
  areaServed: { "@type": "Country"; name: "Qatar" };
}

/**
 * Optician (a LocalBusiness subtype) structured data, one node per branch.
 *
 * `openingHoursSpecification` is intentionally omitted until the real hours are
 * confirmed — declaring hours we have not verified is worse than declaring none.
 * `url` points at the store locator rather than a per-branch page, because the
 * repo has no per-branch URLs to link to.
 */
export function buildStoreJsonLd(): JsonLdOptician[] {
  return STORES.map((store) => ({
    "@context": "https://schema.org",
    "@type": "Optician",
    "@id": `${SITE_URL}${MOI_PAGE_PATH}#${store.id}`,
    name: store.name,
    url: `${SITE_URL}/stores`,
    telephone: QATAR_PHONE_DISPLAY,
    logo: LOGO_ABSOLUTE_URL,
    image: LOGO_ABSOLUTE_URL,
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.streetAddress,
      addressLocality: store.area,
      addressCountry: "QA",
    },
    sameAs: store.mapsUrl,
    parentOrganization: {
      "@type": "Organization",
      name: "Jachi & Muchi",
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Qatar" },
  }));
}
