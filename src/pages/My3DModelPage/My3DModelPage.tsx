import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** 3D Model interface */
interface Model3D {
  id: string;
  image: string;
  name: string;
  createdAt: string;
}

/** Sample 3D models data */
const SAMPLE_MODELS: Model3D[] = [
  { id: "1", image: "/category/image.png", name: "Front View", createdAt: "14 Feb 2026" },
  { id: "2", image: "/category/image.png", name: "Side View Left", createdAt: "14 Feb 2026" },
  { id: "3", image: "/category/image.png", name: "Side View Right", createdAt: "14 Feb 2026" },
  { id: "4", image: "/category/image.png", name: "Model 4", createdAt: "10 Feb 2026" },
  { id: "5", image: "/category/image.png", name: "Model 5", createdAt: "08 Feb 2026" },
  { id: "6", image: "/category/image.png", name: "Model 6", createdAt: "05 Feb 2026" },
];

/** Sidebar menu items */
const SIDEBAR_MENU = [
  { id: "orders", label: "MY ORDERS", icon: null, link: "/account" },
  { id: "3d-model", label: "MY 3D MODEL", icon: "3d", link: "/account/3d-model" },
  { id: "account-info", label: "ACCOUNT INFORMATION", icon: null, link: "/account/info" },
  { id: "notifications", label: "MANAGE NOTIFICATIONS", icon: null, link: "/account/notifications" },
  { id: "address", label: "ADDRESS BOOK", icon: null, link: "/account/address" },
  { id: "prescriptions", label: "MY PRESCRIPTIONS", icon: null, link: "/account/prescriptions" },
];

/**
 * My 3D Model Page
 * Displays user's 3D face models in a grid layout
 */
export const My3DModelPage = memo(function My3DModelPage(): JSX.Element {
  const [models, setModels] = useState<Model3D[]>(SAMPLE_MODELS);
  const [activeMenu] = useState("3d-model");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Handle delete model */
  const handleDeleteModel = useCallback((modelId: string) => {
    setModels(prev => prev.filter(model => model.id !== modelId));
  }, []);

  /** Shared sidebar nav content */
  const sidebarNav = useMemo(() => (
    <nav className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {SIDEBAR_MENU.map((item) => (
        <Link
          key={item.id}
          to={item.link}
          onClick={() => setSidebarOpen(false)}
          className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between border-b border-gray-200 last:border-b-0 ${
            activeMenu === item.id
              ? "bg-teal-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span>{item.label}</span>
          {item.icon === "3d" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          )}
        </Link>
      ))}
    </nav>
  ), [activeMenu]);

  /** Memoize model cards */
  const modelCards = useMemo(() => (
    models.map((model) => (
      <div
        key={model.id}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
      >
        {/* Image */}
        <div className="relative h-36 bg-gray-100">
          <img
            src={model.image}
            alt="3D Model"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* 3D Badge */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-teal-600 text-white text-xs font-semibold rounded">
            3D
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3">
          <p className="text-xs text-gray-500 mb-3">Created: {model.createdAt}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex-1 py-2 px-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden xs:inline">Try On</span>
              <span className="xs:hidden">Try</span>
            </button>
            <button
              onClick={() => handleDeleteModel(model.id)}
              className="py-2 px-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200 flex items-center justify-center"
              aria-label="Delete model"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    ))
  ), [models, handleDeleteModel]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Promotion Header */}
      <PromotionHeader />

      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-4 md:py-6">
        <Container>

          {/* ── Mobile: menu toggle bar ── */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 w-full"
              aria-expanded={sidebarOpen}
              aria-controls="mobile-sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Account Menu</span>
              <svg
                className={`w-4 h-4 ml-auto transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Collapsible mobile sidebar */}
            {sidebarOpen && (
              <div id="mobile-sidebar" className="mt-2">
                {sidebarNav}
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {/* ── Desktop: Left Sidebar – Sticky ── */}
            <div
              className="hidden lg:block w-64 shrink-0 sticky self-start"
              style={{ top: `${PROMOTION_HEADER_HEIGHT + 24}px` }}
            >
              {sidebarNav}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My 3D Models</h1>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your face scans for virtual try-on</p>
                </div>
                <button className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm sm:text-base">Create New 3D Model</span>
                </button>
              </div>

              {/* Info Section */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">How it works</h4>
                    <p className="text-blue-700 text-xs sm:text-sm">
                      Your 3D face model helps you virtually try on glasses from any device.
                      Simply scan your face using your device camera, and we'll create a realistic 3D model
                      that you can use to see how different frames look on you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Models Grid — 1 col on mobile, 2 on sm, 3 on xl */}
              {models.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {modelCards}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-12 sm:py-16 px-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No 3D Models Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm sm:text-base">
                    Create your first 3D face model to try on glasses virtually before you buy.
                  </p>
                  <button className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First 3D Model
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
});

My3DModelPage.displayName = "My3DModelPage";