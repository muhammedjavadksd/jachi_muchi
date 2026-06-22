import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "@/shared/components";
import { sizeChartRows, faceSizes, faqData } from "@/features/account/constants/faqData";

const HEADER_SPACER_HEIGHT = 140;





interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}



/**
 * FAQ Page with Size Guide and collapsible FAQ by category
 */
export const FAQPage = memo(function FAQPage(): JSX.Element {
  const [openKey, setOpenKey] = useState<string | null>("How to measure glasses?");
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  const toggle = useCallback((key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-6 sm:py-8 lg:py-12 pb-16">
        <Container className="max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-teal-600">TOP</Link>
            <span className="mx-1 sm:mx-2">›</span>
            <span className="text-gray-900 font-medium">FAQ & Size Guide</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-10">FAQ & Size Guide</h1>

          {/* Size Guide */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Size Guide</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">How to measure your glasses</p>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
                Eyeglass dimensions are listed in millimeters: <strong className="text-gray-900">lens width</strong>, 
                <strong className="text-gray-900"> bridge</strong>, and <strong className="text-gray-900">temple length</strong>.
                Total frame width is the horizontal distance across the front. Lens width is the width of one lens.
                Bridge is the distance between the two lenses over your nose. Temple length is the length of the arm 
                from the hinge to the tip that rests on your ear. These numbers are often printed on the inside of 
                the temple arm (e.g., 52-18-140).
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 sm:grid-cols-4">
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Lens width</span> – width of one lens
                </div>
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Bridge</span> – distance between lenses
                </div>
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Temple length</span> – arm length to ear
                </div>
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Frame width</span> – total front width
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mb-6 sm:mb-8">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900 text-sm">Lens width (mm)</th>
                    <th className="text-left py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900 text-sm">Bridge (mm)</th>
                    <th className="text-left py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900 text-sm">Temple length (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChartRows.map((row, i) => (
                    <tr key={i} className="border-t border-gray-200 even:bg-gray-50">
                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-sm">{row.lensWidth}</td>
                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-sm">{row.bridge}</td>
                      <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-sm">{row.temple}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Find Your Size</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {faceSizes.map((face) => (
                <div
                  key={face.size}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 text-center"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-xl sm:text-2xl font-bold">
                    {face.size[0]}
                  </div>
                  <p className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{face.label}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Lens width: {face.lens}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Bridge: {face.bridge}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Temple: {face.temple}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Accordion */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqData.map((category) => (
                <div key={category.title}>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 mt-6 first:mt-0">
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isOpen = openKey === item.question;
                      return (
                        <div
                          key={item.question}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => toggle(item.question)}
                            className="w-full flex items-center justify-between py-3 sm:py-4 px-4 sm:px-5 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                            aria-expanded={isOpen}
                          >
                            <span className="text-sm sm:text-base pr-2">{item.question}</span>
                            <span
                              className={`shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                              aria-hidden
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </span>
                          </button>
                          {isOpen && (
                            <div className="px-4 sm:px-5 pb-4 pt-0">
                              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

FAQPage.displayName = "FAQPage";
