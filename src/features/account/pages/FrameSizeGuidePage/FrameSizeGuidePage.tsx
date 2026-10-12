import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, Container } from "@/shared/components";
import { SEO } from "@/shared/components/SEO/SEO";
import { seoMeta } from "@/shared/constants/seoMeta";
import { ROUTE_PATHS } from "@/shared/constants/routes";
import { CUSTOMER_CARE, CUSTOMER_CARE_HOURS } from "@/shared/constants/contactInfo";

const HEADER_SPACER_HEIGHT = 132;

/**
 * BUG-028: the site content is a placeholder until the business team supplies
 * the real figures, and the flag below is what makes that visible to visitors.
 *
 * Frame measurements are numbers a customer relies on to choose a fit. Guessing
 * them would produce a page that looks authoritative and is simply wrong, and a
 * wrong bridge or temple length is how frames end up slipping or pinching. So
 * every numeric cell below is an em dash placeholder, not an estimate.
 *
 * To finish this page: fill in the numbers in `SIZE_CHART_ROWS` and the wording
 * in `MEASUREMENT_STEPS`, then set `SIZE_GUIDE_PENDING = false` to remove the
 * notice banners. Nothing else in the app needs to change.
 */
const SIZE_GUIDE_PENDING = true;

/** Placeholder for a figure the business team has not supplied yet. */
const AWAITING = "—";

/**
 * The three-number frame measurement notation every optical brand uses:
 * lens width, bridge, temple length — all in millimetres, printed on the inner
 * temple arm of the frames. This is reference information about the notation
 * itself, not a product claim, so it is safe to state; the *values* in
 * {@link SIZE_CHART_ROWS} are what require the business team's sign-off.
 */
interface SizeChartRow {
  /** Frame size label as it appears on the temple arm, e.g. "52-18-140". */
  size: string;
  lensWidth: string;
  bridge: string;
  templeLength: string;
  /** Short fit note for this size, e.g. "Narrow / average / Wide". */
  fit: string;
}

const SIZE_CHART_ROWS: SizeChartRow[] = [
  { size: AWAITING, lensWidth: AWAITING, bridge: AWAITING, templeLength: AWAITING, fit: AWAITING },
  { size: AWAITING, lensWidth: AWAITING, bridge: AWAITING, templeLength: AWAITING, fit: AWAITING },
  { size: AWAITING, lensWidth: AWAITING, bridge: AWAITING, templeLength: AWAITING, fit: AWAITING },
  { size: AWAITING, lensWidth: AWAITING, bridge: AWAITING, templeLength: AWAITING, fit: AWAITING },
  { size: AWAITING, lensWidth: AWAITING, bridge: AWAITING, templeLength: AWAITING, fit: AWAITING },
];

/** Column headers, kept in one place so the table and its summary stay in sync. */
const SIZE_CHART_COLUMNS: { key: keyof SizeChartRow; label: string; unit: string }[] = [
  { key: "size", label: "Frame size", unit: "as printed" },
  { key: "lensWidth", label: "Lens width", unit: "mm" },
  { key: "bridge", label: "Bridge", unit: "mm" },
  { key: "templeLength", label: "Temple length", unit: "mm" },
  { key: "fit", label: "Best for", unit: "" },
];

interface MeasurementStep {
  step: string;
  instruction: string;
}

/**
 * How-to-measure skeleton. The *order* of operations is standard practice, but
 * the phrasing still needs the business team's approval, so the steps are short
 * and the notice above flags the page as provisional.
 */
const MEASUREMENT_STEPS: MeasurementStep[] = [
  {
    step: "1",
    instruction:
      "Get a pair of glasses you already like the fit of. This is the most reliable reference, because you already know how that pair sits on your nose and whether the temples pinch.",
  },
  {
    step: "2",
    instruction:
      "Find the three numbers printed on the inside of one temple arm, next to the hinge. They read lens width, bridge, temple length — for example 52-18-140.",
  },
  {
    step: "3",
    instruction:
      "Measure the lens width of that frame from one edge of the lens to the other at the widest point, in millimetres. This is the first number.",
  },
  {
    step: "4",
    instruction:
      "Measure the bridge, the gap between the two lenses across the top of the nose. This is the second number, and it is the one most people misjudge by eye.",
  },
  {
    step: "5",
    instruction:
      "Measure the temple length from the hinge to the end of the arm, including the bend behind the ear. This is the third number.",
  },
  {
    step: "6",
    instruction:
      "When you order, match all three numbers, not just the lens width. Two frames can share a lens width and fit very differently because the bridge and temple length differ.",
  },
];

/**
 * Frame Size guide.
 *
 * BUG-028: the footer linked to `/frame-size` from the Services column, but no
 * route was registered for that path and no page existed, so React Router fell
 * through to the `*` catch-all and rendered the 404 page. The page is created
 * here and registered in `src/app/routes/index.tsx`; the footer link reads
 * `ROUTE_PATHS.frameSizeGuide`.
 *
 * Layout mirrors `TermsPage` / `DisclaimerPage` (spacer for the fixed header,
 * constrained `Container`, `Footer`, `WhatsAppButton`).
 */
export const FrameSizeGuidePage = memo(function FrameSizeGuidePage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <SEO {...seoMeta.frameSizeGuide} indexFollow />
      <div style={spacerStyle} />
      <main className="flex-1 py-6 md:py-10 lg:py-12">
        <Container className="max-w-2xl lg:max-w-3xl">
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Frame Size Guide
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Find the right fit by lens width, bridge and temple length
            </p>
          </header>

          {SIZE_GUIDE_PENDING && (
            <div
              role="note"
              className="mb-6 md:mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
            >
              <p className="font-semibold">Size chart awaiting approved measurements.</p>
              <p className="mt-1 leading-relaxed">
                The chart below is a structural placeholder. The measurements have not yet
                been supplied or verified, so the figures are shown as &ldquo;&mdash;&rdquo;
                rather than estimated. For help choosing a fit, contact us using the
                details on our{" "}
                <Link
                  to="/contact"
                  className="underline underline-offset-2 font-medium hover:text-amber-700"
                >
                  contact page
                </Link>
                .
              </p>
            </div>
          )}

          <div className="space-y-8 sm:space-y-10 text-gray-700">
            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                How frame sizes are written
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                A frame size is three numbers in millimetres, in the order{" "}
                <strong className="font-semibold text-gray-900">lens width</strong> –{" "}
                <strong className="font-semibold text-gray-900">bridge</strong> –{" "}
                <strong className="font-semibold text-gray-900">temple length</strong>. The
                example <span className="whitespace-nowrap">52-18-140</span> therefore means a
                52 mm lens, an 18 mm bridge and a 140 mm temple arm. You will find these
                numbers printed on the inside of the temple arm of any pair of glasses you
                own, next to the hinge.
              </p>
              <p className="text-sm sm:text-base leading-relaxed mt-3">
                The bridge is the part most people misjudge by eye, and it is the number that
                decides whether the frame sits properly on your nose. When comparing two
                frames, match all three numbers rather than the lens width alone.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                Size chart
              </h2>
              {/*
                The wrapper scrolls horizontally so a wide chart never forces
                the whole page sideways on a phone. `tabIndex` + role="region"
                + aria-label make that scrollable area reachable and announced
                for keyboard and screen-reader users, which is the standard
                accessible pattern for a horizontally scrollable table.
              */}
              <div
                role="region"
                aria-label="Frame size chart, scrollable"
                tabIndex={0}
                className="overflow-x-auto rounded-xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Frame sizes with lens width, bridge and temple length in millimetres
                  </caption>
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {SIZE_CHART_COLUMNS.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700"
                        >
                          {column.label}
                          {column.unit ? (
                            <span className="block text-[11px] font-normal normal-case text-gray-500">
                              {column.unit}
                            </span>
                          ) : null}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_CHART_ROWS.map((row, index) => (
                      <tr
                        key={row.size + String(index)}
                        className="border-b border-gray-100 last:border-b-0 even:bg-gray-50/50"
                      >
                        {SIZE_CHART_COLUMNS.map((column) => (
                          <td
                            key={column.key}
                            className="whitespace-nowrap px-4 py-3 text-gray-700"
                          >
                            {row[column.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {SIZE_GUIDE_PENDING && (
                <p className="mt-2 text-xs text-gray-500">
                  Measurements are provided in millimetres (mm).
                </p>
              )}
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                How to measure your current frames
              </h2>
              <ol className="space-y-3">
                {MEASUREMENT_STEPS.map((item) => (
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
            </section>

            <section>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                Still not sure?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Our opticians can measure a frame for you and advise on fit — including
                bridge width, which is hard to judge from a photo. Email us at{" "}
                <a
                  href={`mailto:${CUSTOMER_CARE.email}`}
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  {CUSTOMER_CARE.email}
                </a>{" "}
                or use the contact details on our{" "}
                <Link
                  to="/contact"
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  contact page
                </Link>
                . In-store service is also listed on our{" "}
                <Link
                  to={ROUTE_PATHS.storeLocator}
                  className="font-medium text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  store locator
                </Link>
                .
              </p>
            </section>
          </div>

          <div className="mt-10 md:mt-12 border-t border-gray-200 pt-6 text-sm text-gray-600">
            <p className="leading-relaxed">
              Need help with your order or an existing prescription?{" "}
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
              — phone support is available {CUSTOMER_CARE_HOURS.label}.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

FrameSizeGuidePage.displayName = "FrameSizeGuidePage";
