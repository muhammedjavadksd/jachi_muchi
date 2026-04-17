import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "home", path: "/" },
  { id: "stores", label: "Stores", icon: "store", path: "/stores" },
  { id: "tryon", label: "AR Try On", icon: "camera", path: "/ar-try" },
  { id: "eyetest", label: "Eye Test", icon: "eye", path: "/eye-test" },
  { id: "orders", label: "Orders", icon: "clipboard", path: "/orders" },
];

const icons: Record<string, JSX.Element> = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  store: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
};

/**
 * Bottom Navigation Bar - fixed at bottom, mobile-only
 * Lenskart-style tab navigation
 */
export const BottomNav = memo(function BottomNav(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <span className="mb-0.5">{icons[item.icon]}</span>
              <span className="text-[9px] font-medium leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = "BottomNav";
