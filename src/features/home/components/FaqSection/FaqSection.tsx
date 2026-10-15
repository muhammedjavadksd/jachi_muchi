import { memo, useCallback, useId, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

/**
 * Home page FAQ content. Kept as a single editable array so the accordion and
 * the FAQPage JSON-LD below always render the exact same questions and answers.
 */
const faqs = [
  {
    q: "Where can I buy eyeglasses in Qatar?",
    a: "Jachi & Muchi Opticals offers eyeglasses in different styles, frame shapes and price ranges. Customers can browse available collections on jachiandmuchi.com or visit a showroom in Qatar.",
  },
  {
    q: "Where can I get an eye test in Qatar?",
    a: "Jachi & Muchi provides information about its eye-testing services and participating showroom locations through its website. Check the store locator to confirm the availability of your required eye test at a specific branch.",
  },
  {
    q: "Does Jachi & Muchi offer MOI-approved eye testing?",
    a: "Jachi & Muchi identifies MOI-approved eye-testing services on its website. Customers should confirm which showroom currently provides the required test before visiting.",
  },
  {
    q: "Where can I find computer glasses in Qatar?",
    a: "You can explore computer glasses through Jachi & Muchi's online eyewear collections. Review the individual product specifications and ask the optical team about lens options suited to your screen use.",
  },
  {
    q: "Does Jachi & Muchi have physical showrooms in Qatar?",
    a: "Yes, Jachi & Muchi has physical showrooms in Qatar. Use the official store locator for current addresses, contact information and opening hours.",
  },
  {
    q: "Can I buy glasses online from Jachi & Muchi?",
    a: "Yes, the website has online product listings with product details and prices. Check each product page for current availability, lens options, delivery conditions and purchase instructions.",
  },
];

/**
 * FAQPage structured data generated from `faqs`, emitted through the app's
 * existing `react-helmet-async` head manager (same pattern as the MOI landing
 * page) so the schema never drifts from the visible copy.
 */
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
});

/**
 * Home page "Frequently asked questions" section, rendered right after
 * "Ways to shop with us". Single-open accordion: opening one item closes the
 * previous one, the first item starts open on desktop and all stay closed on
 * mobile. Animations are disabled under `prefers-reduced-motion`.
 */
export const FaqSection = memo(function FaqSection(): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openIndex, setOpenIndex] = useState<number | null>(() =>
    isDesktop ? 0 : null
  );
  const baseId = useId();

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="px-[4vw] py-10 md:py-16 bg-white">
      <Helmet>
        <script type="application/ld+json">{faqJsonLd}</script>
      </Helmet>

      <h2 className="text-center text-xl sm:text-2xl md:text-[30px] font-semibold mb-3 text-[#1a1a1a] font-brand">
        Frequently asked questions
      </h2>
      <p className="text-center text-gray-600 max-w-xl mx-auto mb-8">
        Quick answers about eyeglasses, eye tests and our showrooms in Qatar.
      </p>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const questionId = `${baseId}-question-${index}`;
          const answerId = `${baseId}-answer-${index}`;

          return (
            <div
              key={faq.q}
              className={`rounded-xl bg-white border border-gray-200 transition-shadow motion-reduce:transition-none ${
                isOpen ? "shadow-md" : ""
              }`}
            >
              <button
                type="button"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggle(index)}
                className="w-full min-h-12 flex justify-between items-center gap-4 text-left px-5 py-4 md:px-6 md:py-5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <span className="font-medium text-base md:text-lg text-gray-900">
                  {faq.q}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700"
                >
                  <Plus
                    className={`w-4 h-4 transition-transform duration-200 motion-reduce:transition-none ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </span>
              </button>

              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p
                    className={`text-gray-600 text-sm md:text-base leading-relaxed px-5 pb-5 md:px-6 md:pb-6 transition-opacity duration-300 motion-reduce:transition-none ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

FaqSection.displayName = "FaqSection";
