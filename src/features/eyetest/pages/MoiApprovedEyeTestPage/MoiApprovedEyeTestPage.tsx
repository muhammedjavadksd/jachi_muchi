import { memo, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container, Footer, WhatsAppButton } from "@/shared/components";
import { HEADER_SPACER_HEIGHT } from "@/shared/constants";
import { SEO } from "@/shared/components/SEO/SEO";
import { seoMeta } from "@/shared/constants/seoMeta";
import {
  BREADCRUMBS,
  CHECKLIST,
  CONTACT_EMAIL,
  FAQS,
  FEATURE_CARDS,
  HERO,
  LOCATIONS_SECTION,
  PROCESS,
  SERVICE_OVERVIEW,
  STICKY_BAR,
  STORES,
  buildFaqJsonLd,
  buildStoreJsonLd,
  phoneDisplay,
  telUrl,
  whatsappUrl,
} from "@/features/eyetest/constants/moiApprovedContent";

/** Shared primary/secondary button classes, matching the rest of the storefront. */
const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-teal-700";
const CTA_OUTLINE =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-teal-600 px-6 py-3 text-base font-semibold text-teal-600 transition-colors hover:bg-teal-600 hover:text-white";

/**
 * `/moi-approved-eye-test-qatar` — Google Ads landing page and the only page on
 * the site allowed to carry MOI / driving-license / Metrash2 wording.
 *
 * Mobile-first by design (85%+ of the ad traffic is mobile): a single-column
 * flow, large tap targets, and a persistent bottom CTA bar. Desktop gets the
 * same content in a wider grid.
 *
 * The bottom CTA bar replaces the site-wide `BottomNav` on this route (see
 * `BOTTOM_NAV_EXCLUDED_PREFIXES`) — two fixed bars would overlap, and an app
 * bottom nav is not what an ad landing page should show anyway.
 *
 * Every unverified claim lives as a `TODO_CONFIRM` comment next to its string in
 * `../constants/moiApprovedContent.ts`; see the note at the top of that file.
 */
export const MoiApprovedEyeTestPage = memo(function MoiApprovedEyeTestPage(): JSX.Element {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  const waHref = useMemo(() => whatsappUrl(), []);
  const callHref = useMemo(() => telUrl(), []);
  const primaryMapsHref = useMemo(() => STORES[0].mapsUrl, []);

  const faqJsonLd = useMemo(() => JSON.stringify(buildFaqJsonLd()), []);
  const storeJsonLd = useMemo(() => JSON.stringify(buildStoreJsonLd()), []);

  const toggleFaq = useCallback((index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO {...seoMeta.moiApprovedEyeTest} indexFollow />
      <Helmet>
        <script type="application/ld+json">{faqJsonLd}</script>
        <script type="application/ld+json">{storeJsonLd}</script>
      </Helmet>

      <div style={spacerStyle} />

      <main className="flex-1 pb-24 md:pb-0">
        {/* ---------------------------------------------------------- Hero */}
        <section className="bg-white border-b border-gray-200">
          <Container className="max-w-5xl py-8 sm:py-12 lg:py-16">
            <nav
              className="text-xs sm:text-sm text-gray-500"
              aria-label="Breadcrumb"
            >
              {BREADCRUMBS.map((crumb, index) => (
                <span key={crumb.label}>
                  {index > 0 && <span className="mx-1 sm:mx-2">&rsaquo;</span>}
                  {index === BREADCRUMBS.length - 1 ? (
                    <span className="text-gray-900 font-medium" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link to={crumb.to} className="hover:text-teal-600">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            <h1 className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {HERO.h1}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
              {HERO.subheading}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <a href={callHref} className={`${CTA_PRIMARY} w-full sm:w-auto`}>
                <Phone className="w-5 h-5" aria-hidden />
                {HERO.callLabel}
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CTA_OUTLINE} w-full sm:w-auto`}
              >
                <WhatsAppGlyph />
                {HERO.whatsappLabel}
              </a>
              <a
                href={primaryMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CTA_OUTLINE} w-full sm:w-auto`}
              >
                <MapPin className="w-5 h-5" aria-hidden />
                {HERO.mapsLabel}
              </a>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------- Service overview */}
        <section className="py-10 sm:py-14">
          <Container className="max-w-5xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {SERVICE_OVERVIEW.h2}
            </h2>
            <p className="mt-4 text-base text-gray-700 leading-relaxed max-w-3xl">
              {SERVICE_OVERVIEW.body}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURE_CARDS.map((card) => (
                <article
                  key={card.title}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <CheckGlyph />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* ----------------------------------------------------- Process */}
        <section className="bg-white border-y border-gray-200 py-10 sm:py-14">
          <Container className="max-w-5xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {PROCESS.h2}
            </h2>

            <ol className="mt-8 space-y-6">
              {PROCESS.steps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-4">
                  <span className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm sm:text-base text-gray-600 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* ---------------------------------------------------- Checklist */}
        <section className="py-10 sm:py-14">
          <Container className="max-w-5xl">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 sm:px-8 py-6 sm:py-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {CHECKLIST.h2}
              </h2>
              <ul className="mt-5 space-y-3">
                {CHECKLIST.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <CheckGlyph small />
                    </span>
                    <span className="text-sm sm:text-base text-gray-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------- FAQ */}
        <section className="bg-white border-y border-gray-200 py-10 sm:py-14">
          <Container className="max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.question}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between py-3 sm:py-4 px-4 sm:px-5 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base pr-2">
                        {faq.question}
                      </span>
                      <span
                        className={`shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 pt-0">
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------ Store locations */}
        <section className="py-10 sm:py-14">
          <Container className="max-w-5xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {LOCATIONS_SECTION.h2}
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">
              {LOCATIONS_SECTION.testAvailabilityNote}
            </p>
            <p className="mt-3 text-sm text-gray-700">
              <a href={callHref} className="font-semibold text-teal-600 hover:text-teal-700">
                {phoneDisplay()}
              </a>
              {" · "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-teal-600 hover:text-teal-700">
                {CONTACT_EMAIL}
              </a>
            </p>

            <div className="mt-8 space-y-8">
              {STORES.map((store) => (
                <article
                  key={store.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="px-5 sm:px-8 py-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {store.name}
                    </h3>

                    <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Address
                        </dt>
                        <dd className="mt-1.5 leading-relaxed text-gray-800">
                          {store.streetAddress}, {store.area}, Qatar
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Hours
                        </dt>
                        <dd className="mt-1.5 leading-relaxed text-gray-800">
                          {store.hours}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <a
                        href={store.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${CTA_PRIMARY} text-sm py-2.5`}
                      >
                        <MapPin className="w-4 h-4" aria-hidden />
                        Get Directions
                      </a>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className={`${CTA_OUTLINE} text-sm py-2.5`}
                      >
                        <Mail className="w-4 h-4" aria-hidden />
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>

                  <iframe
                    title={`Map — ${store.name}`}
                    src={store.mapsEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-64 border-0 border-t border-gray-200"
                  />
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
      {/* Lifted clear of the mobile CTA bar below; the bar already carries a
          labelled WhatsApp action, the bubble is the desktop affordance. */}
      <WhatsAppButton className="bottom-24 md:bottom-6" />

      {/* --------------------------------- Mobile sticky CTA bar (md:hidden) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-gray-200 bg-white">
        <div className="grid grid-cols-3">
          <a
            href={callHref}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-gray-700"
          >
            <Phone className="w-5 h-5 text-teal-600" aria-hidden />
            {STICKY_BAR.call}
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-gray-700 border-x border-gray-200"
          >
            <span className="text-teal-600">
              <WhatsAppGlyph />
            </span>
            {STICKY_BAR.whatsapp}
          </a>
          <a
            href={STORES[0].mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold text-gray-700"
          >
            <MapPin className="w-5 h-5 text-teal-600" aria-hidden />
            {STICKY_BAR.directions}
          </a>
        </div>
      </div>
    </div>
  );
});

MoiApprovedEyeTestPage.displayName = "MoiApprovedEyeTestPage";

/** WhatsApp glyph, matching the icon used by the shared `WhatsAppButton`. */
const WhatsAppGlyph = memo(function WhatsAppGlyph(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
});

/** Teal tick used in the feature cards and the bring-list. */
const CheckGlyph = memo(function CheckGlyph({ small = false }: { small?: boolean }): JSX.Element {
  return (
    <svg
      width={small ? 12 : 20}
      height={small ? 12 : 20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
});
