import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "@/shared/components";

const HEADER_SPACER_HEIGHT = 140;

/**
 * 404 Not Found page – shown when the user navigates to a route that doesn't exist
 */
export const NotFoundPage = memo(function NotFoundPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container className="max-w-lg text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <p className="text-6xl font-bold text-teal-600 mb-2">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-600 mb-8">
            The page you’re looking for doesn’t exist or has been moved. Check the link or head back to start fresh.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              Go to Home
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Browse products
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            Need help? <Link to="/faq" className="text-teal-600 hover:text-teal-700 font-medium">Visit FAQ</Link> or{" "}
            <a href="/contact" className="text-teal-600 hover:text-teal-700 font-medium">contact us</a>.
          </p>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

NotFoundPage.displayName = "NotFoundPage";
