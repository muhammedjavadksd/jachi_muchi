import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

/**
 * 500 Server Error page – shown when something goes wrong on our side
 */
export const ServerErrorPage = memo(function ServerErrorPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container className="max-w-lg text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-600">
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
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="text-6xl font-bold text-amber-600 mb-2">500</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
          <p className="text-gray-600 mb-8">
            We’re sorry — we hit a snag on our end. Our team has been notified. Please try again in a moment or head back home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              Go to Home
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Try again
            </button>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            If the problem continues, please{" "}
            <a href="/contact" className="text-teal-600 hover:text-teal-700 font-medium">contact us</a>.
          </p>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

ServerErrorPage.displayName = "ServerErrorPage";
