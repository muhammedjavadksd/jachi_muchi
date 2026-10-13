import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, Container } from "@/shared/components";
import { SEO } from "@/shared/components/SEO/SEO";
import { CUSTOMER_CARE, CUSTOMER_CARE_HOURS } from "@/shared/constants/contactInfo";
import { seoMeta } from "@/shared/constants/seoMeta";
import { ROUTE_PATHS } from "@/shared/constants/routes";

const HEADER_SPACER_HEIGHT = 132;
const LAST_UPDATED = "February 2025";

/**
 * Sections to be filled in by the business / legal team.
 *
 * IMPORTANT — these are PLACEHOLDERS, not legal text. A disclaimer is a
 * legally binding document, so no wording has been invented here: inventing
 * clauses could be worse than having none, because it would ship as if it were
 * reviewed and approved. Each entry below states only what the page is for and
 * who must supply the wording, and `DISCLAIMER_PENDING` is what makes that
 * obvious to visitors, to legal, and to anyone reading the source later.
 *
 * To finish this page: replace each `body` with the approved copy and delete
 * `DISCLAIMER_PENDING`. Nothing else in the app needs to change.
 */
const DISCLAIMER_PENDING = true;

interface DisclaimerSection {
  heading: string;
  body: string;
}

const DISCLAIMER_SECTIONS: DisclaimerSection[] = [
  {
    heading: "1. General Information",
    body: "Reserved for the approved wording. This section is expected to cover the scope of the website and the relationship between the site and its visitors.",
  },
  {
    heading: "2. Professional Advice",
    body: "Reserved for the approved wording. This section is expected to cover the limits of the information published on the site, in particular anything relating to eye health, prescriptions and vision.",
  },
  {
    heading: "3. Product Information and Pricing",
    body: "Reserved for the approved wording. This section is expected to cover product descriptions, availability, pricing changes and promotional offers.",
  },
  {
    heading: "4. External Links",
    body: "Reserved for the approved wording. This section is expected to cover links to third-party websites and the limits of responsibility for their content.",
  },
  {
    heading: "5. Limitation of Liability",
    body: "Reserved for the approved wording. This section is expected to cover the limits of liability permitted by applicable law.",
  },
  {
    heading: "6. Contact",
    body: "Reserved for the approved wording. This section is expected to direct enquiries to the Jachi & Muchi customer care team.",
  },
];

/**
 * Disclaimer page.
 *
 * BUG-023: the footer linked to `/disclaimer` from both the Legal column and
 * the mobile bottom bar, but no route was ever registered for that path, so
 * React Router fell through to the `*` catch-all and rendered the 404 page. The
 * page did not exist. It is created here and registered in
 * `src/app/routes/index.tsx`; every link uses `ROUTE_PATHS.disclaimer`.
 *
 * Layout deliberately mirrors `TermsPage` / `PrivacyPage` (spacer for the fixed
 * header, constrained `Container`, `Footer`, `WhatsAppButton`) so all legal
 * pages stay visually consistent.
 */
export const DisclaimerPage = memo(function DisclaimerPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `var(--header-offset, ${HEADER_SPACER_HEIGHT}px)` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <SEO {...seoMeta.disclaimer} indexFollow />
      <div style={spacerStyle} />
      <main className="flex-1 py-6 md:py-10 lg:py-12">
        <Container className="max-w-2xl lg:max-w-3xl">
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Disclaimer
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          {DISCLAIMER_PENDING && (
            <div
              role="note"
              className="mb-6 md:mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
            >
              <p className="font-semibold">This page is awaiting approved legal text.</p>
              <p className="mt-1 leading-relaxed">
                The wording below is a structural placeholder and has not been reviewed
                or approved. The sections marked &ldquo;Reserved for the approved
                wording&rdquo; are awaiting input from the business or legal team. For
                anything urgent, please contact us using the details in our{" "}
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
            <p className="text-sm sm:text-base leading-relaxed">
              This page is intended to hold the Jachi &amp; Muchi website disclaimer. It
              is published here so the &ldquo;Disclaimer&rdquo; link in the site footer
              leads to a real page. Please refer to our{" "}
              <Link
                to={ROUTE_PATHS.terms}
                className="underline underline-offset-2 font-medium text-gray-900 hover:text-teal"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                to={ROUTE_PATHS.privacy}
                className="underline underline-offset-2 font-medium text-gray-900 hover:text-teal"
              >
                Privacy Policy
              </Link>{" "}
              for the terms that currently govern the use of this website.
            </p>

            {DISCLAIMER_SECTIONS.map((section) => (
              <section key={section.heading}>
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-snug">
                  {section.heading}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 md:mt-12 border-t border-gray-200 pt-6 text-sm text-gray-600">
            <p className="leading-relaxed">
              Questions about this disclaimer? Call our customer care team on{" "}
              {CUSTOMER_CARE.isAvailable ? (
                <a
                  href={CUSTOMER_CARE.telHref}
                  aria-label={`Call customer care on ${CUSTOMER_CARE.display}`}
                  className="font-semibold text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  {CUSTOMER_CARE.display}
                </a>
              ) : (
                <a
                  href={`mailto:${CUSTOMER_CARE.email}`}
                  className="font-semibold text-teal underline underline-offset-2 hover:text-teal-deep"
                >
                  {CUSTOMER_CARE.email}
                </a>
              )}
              , or reach us on WhatsApp. Phone support is available{" "}
              {CUSTOMER_CARE_HOURS.label}.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

DisclaimerPage.displayName = "DisclaimerPage";
