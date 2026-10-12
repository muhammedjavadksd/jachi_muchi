import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, Container } from "@/shared/components";
import { SEO } from "@/shared/components/SEO/SEO";
import { seoMeta } from "@/shared/constants/seoMeta";
import { ROUTE_PATHS } from "@/shared/constants/routes";
import { CUSTOMER_CARE, CUSTOMER_CARE_HOURS } from "@/shared/constants/contactInfo";

const HEADER_SPACER_HEIGHT = 132;

/**
 * BUG-029: the site copy is a placeholder until the business team supplies it.
 * This flag is what makes that visible to visitors.
 *
 * A buying guide makes claims a customer buys against — which frame shape suits
 * which face, which lens technology is right for a given prescription, what is
 * and is not covered by warranty. Writing plausible-sounding copy here would
 * produce specific advice we cannot stand behind, so the page ships with its
 * structure and headings (the ones the business asked for) and placeholder
 * bodies instead of invented content.
 *
 * To finish this page: replace the placeholder bodies below, fill
 * `LENS_TYPE_ROWS`, then set `BUYING_GUIDE_PENDING = false` to remove the
 * notice banner. Nothing else in the app needs to change.
 *
 * NOTE: there are no images on this page. Approved artwork can be added once
 * supplied — use an `<img>` with `loading="lazy"`, explicit `width`/`height` to
 * prevent layout shift, and a descriptive `alt`. None was added here because a
 * fabricated `src` would produce a broken image request and a console error.
 */
const BUYING_GUIDE_PENDING = true;

/** Placeholder for copy the business team has not supplied yet. */
const AWAITING_COPY =
  "Content pending. This section is reserved for the approved wording from the business team, so nothing has been guessed here.";

interface GuideStep {
  step: string;
  instruction: string;
}

/** "How to choose" — the decision-making order the business team asked for. */
const CHOOSE_STEPS: GuideStep[] = [
  { step: "1", instruction: AWAITING_COPY },
  { step: "2", instruction: AWAITING_COPY },
  { step: "3", instruction: AWAITING_COPY },
  { step: "4", instruction: AWAITING_COPY },
];

interface FrameTypeEntry {
  name: string;
  bestFor: string;
}

const FRAME_TYPES: FrameTypeEntry[] = [
  { name: AWAITING_COPY, bestFor: AWAITING_COPY },
  { name: AWAITING_COPY, bestFor: AWAITING_COPY },
  { name: AWAITING_COPY, bestFor: AWAITING_COPY },
  { name: AWAITING_COPY, bestFor: AWAITING_COPY },
];

interface LensTypeRow {
  type: string;
  bestFor: string;
  notes: string;
}

const LENS_TYPE_COLUMNS: { key: keyof LensTypeRow; label: string }[] = [
  { key: "type", label: "Lens type" },
  { key: "bestFor", label: "Best for" },
  { key: "notes", label: "Notes" },
];

const LENS_TYPE_ROWS: LensTypeRow[] = [
  { type: AWAITING_COPY, bestFor: AWAITING_COPY, notes: AWAITING_COPY },
  { type: AWAITING_COPY, bestFor: AWAITING_COPY, notes: AWAITING_COPY },
  { type: AWAITING_COPY, bestFor: AWAITING_COPY, notes: AWAITING_COPY },
  { type: AWAITING_COPY, bestFor: AWAITING_COPY, notes: AWAITING_COPY },
];

const ORDER_STEPS: GuideStep[] = [
  { step: "1", instruction: AWAITING_COPY },
  { step: "2", instruction: AWAITING_COPY },
  { step: "3", instruction: AWAITING_COPY },
];

/**
 * Buying Guide.
 *
 * BUG-029: the footer linked to `/buying-guide` from the Services column, but no
 * route was registered for that path and no page existed, so React Router fell
 * through to the `*` catch-all and rendered the 404 page. The page is created
 * here and registered in `src/app/routes/index.tsx`; the footer link reads
 * `ROUTE_PATHS.buyingGuide`.
 *
 * Layout mirrors `TermsPage` / `DisclaimerPage` / `FrameSizeGuidePage` (spacer
 * for the fixed header, constrained `Container`, `Footer`, `WhatsAppButton`).
 */
export const BuyingGuidePage = memo(function BuyingGuidePage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <SEO {...seoMeta.buyingGuide} indexFollow />
      <div style={spacerStyle} />
      <main className="flex-1 py-6 md:py-10 lg:py-12">
        <Container className="max-w-2xl lg:max-w-3xl">
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Buying Guide
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Choosing frames, lenses and understanding your order
            </p>
          </header>

          {BUYING_GUIDE_PENDING && (
            <div
              role="note"
              className="mb-6 md:mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
            >
              <p className="font-semibold">This guide is awaiting approved content.</p>
              <p className="mt-1 leading-relaxed">
                The sections below are structured placeholders. No product advice has been
                written, because a recommendation we cannot substantiate is worse than no
                recommendation. In the meantime, our opticians can advise you in store or
                over WhatsApp, or you can read our{" "}
                <Link
                  to={ROUTE_PATHS.frameSizeGuide}
                  className="underline underline-offset-2 font-medium hover:text-amber-700"
                >
                  frame size guide
                </Link>{" "}
                and{" "}
                <Link
                  to={ROUTE_PATHS.refundPolicy}
                  className="underline underline-offset-2 font-medium hover:text-amber-700"
                >
                  return policy
                </Link>
                .
              </p>
            </div>
          )}

          <div className="space-y-8 sm:space-y-10 text-gray-700">
            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                How to choose your frames
              </h2>
              <NumberedSteps steps={CHOOSE_STEPS} />
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                Frame types
              </h2>
              <ul className="space-y-3">
                {FRAME_TYPES.map((frame, index) => (
                  <li
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <p className="text-sm font-semibold text-gray-900 break-words">
                      {frame.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed break-words">
                      {frame.bestFor}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                Lens types
              </h2>
              {/*
                Same accessible scroll pattern as the frame size chart: the
                table scrolls inside its own container so it never widens the
                page, and the scroll region is keyboard reachable and labelled.
              */}
              <div
                role="region"
                aria-label="Lens types comparison, scrollable"
                tabIndex={0}
                className="overflow-x-auto rounded-xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Lens types, what they are best for, and additional notes
                  </caption>
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {LENS_TYPE_COLUMNS.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LENS_TYPE_ROWS.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 last:border-b-0 even:bg-gray-50/50"
                      >
                        {LENS_TYPE_COLUMNS.map((column) => (
                          <td key={column.key} className="px-4 py-3 align-top text-gray-700">
                            {row[column.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                How to order
              </h2>
              <NumberedSteps steps={ORDER_STEPS} />
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                Returns and warranty
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">{AWAITING_COPY}</p>
              <p className="text-sm sm:text-base leading-relaxed mt-3">
                The full terms are published on our{" "}
                <Link
                  to={ROUTE_PATHS.refundPolicy}
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  Return Policy
                </Link>{" "}
                and{" "}
                <Link
                  to={ROUTE_PATHS.warranty}
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  Warranty
                </Link>{" "}
                pages, which are the authoritative versions.
              </p>
            </section>
          </div>

          <div className="mt-10 md:mt-12 border-t border-gray-200 pt-6 text-sm text-gray-600">
            <p className="leading-relaxed">
              Want advice before you order?{" "}
              {CUSTOMER_CARE.isAvailable ? (
                <a
                  href={CUSTOMER_CARE.telHref}
                  aria-label={`Call customer care on ${CUSTOMER_CARE.display}`}
                  className="font-semibold text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  Call {CUSTOMER_CARE.display}
                </a>
              ) : (
                <a
                  href={`mailto:${CUSTOMER_CARE.email}`}
                  className="font-semibold text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  Email {CUSTOMER_CARE.email}
                </a>
              )}{" "}
              — phone support is available {CUSTOMER_CARE_HOURS.label}. You can also{" "}
              <Link
                to={ROUTE_PATHS.storeLocator}
                className="font-semibold text-teal underline underline-offset-2 hover:text-teal-deep"
              >
                find your nearest store
              </Link>{" "}
              to be fitted in person.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

BuyingGuidePage.displayName = "BuyingGuidePage";

/**
 * Numbered list shared by the "how to choose" and "how to order" sections.
 * The step number is `aria-hidden` and the list is a real `<ol>`, so assistive
 * technology announces the position without the visible badge being read twice.
 */
const NumberedSteps = memo(function NumberedSteps({
  steps,
}: {
  steps: GuideStep[];
}): JSX.Element {
  return (
    <ol className="space-y-3">
      {steps.map((item) => (
        <li key={item.step} className="flex gap-3">
          <span
            aria-hidden
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white"
          >
            {item.step}
          </span>
          <span className="text-sm sm:text-base leading-relaxed">{item.instruction}</span>
        </li>
      ))}
    </ol>
  );
});

NumberedSteps.displayName = "NumberedSteps";
