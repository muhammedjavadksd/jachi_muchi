import { memo, useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  // Box, // [HIDDEN] My 3D Model — uncomment to restore
  User,
  Bell,
  MapPin,
  FileText,
  Home,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { LogoutButton } from "@/features/auth";

const SHOW_PRESCRIPTIONS = import.meta.env.VITE_FEATURE_MY_PRESCRIPTIONS === "true";
const SHOW_NOTIFICATIONS = import.meta.env.VITE_FEATURE_MANAGE_NOTIFICATIONS === "true";

const ALL_MENU_ITEMS = [
  { id: "orders", label: "My Orders", icon: Package, link: "/account/orders" },
  // { id: "3d-model", label: "My 3D Model", icon: Box, link: "/account/3d-model" }, // [HIDDEN] My 3D Model — uncomment to restore
  { id: "account-info", label: "Account Information", icon: User, link: "/account/info" },
  { id: "notifications", label: "Manage Notifications", icon: Bell, link: "/account/notifications", feature: "notifications" },
  { id: "address", label: "Address Book", icon: MapPin, link: "/account/address" },
  { id: "prescriptions", label: "My Prescriptions", icon: FileText, link: "/account/prescriptions", feature: "prescriptions" },
  { id: "home-try-on", label: "My Home Try-On", icon: Home, link: "/account/home-try-on-appointments" },
];

const MENU_ITEMS = ALL_MENU_ITEMS.filter(
  (item) =>
    (item.feature !== "prescriptions" || SHOW_PRESCRIPTIONS) &&
    (item.feature !== "notifications" || SHOW_NOTIFICATIONS)
);

const SIDEBAR_WIDTH = 280;
const PROMOTION_HEADER_HEIGHT = 140;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const AccountSidebar = memo(function AccountSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const isActive = useCallback((link: string) => location.pathname === link, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setMobileOpen(false);
  }, []);

  const sidebarContent = (
    <div className="flex flex-col" style={{ height: "100%" }}>
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#05005B] to-[#2a1a7a] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            {user?.name ? getInitials(user.name) : "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-gray-900 text-sm truncate">{user?.name || "User"}</p>
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            </div>
            <p className="text-xs text-gray-500 truncate">{user?.email || user?.phone || ""}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-2 px-2 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const active = isActive(item.link);
          return (
            <Link
              key={item.id}
              to={item.link}
              className="group relative flex items-center gap-3 px-4 rounded-xl text-sm font-medium transition-colors duration-200"
              style={{ height: "52px" }}
            >
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#05005B] rounded-r-full transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />

              <div
                className={`absolute inset-0 rounded-xl transition-colors duration-200 ${
                  active ? "bg-[#05005B]/5" : "group-hover:bg-gray-50"
                }`}
              />

              <item.icon
                size={18}
                className={`relative shrink-0 transition-colors duration-200 ${
                  active ? "text-[#05005B]" : "text-gray-400 group-hover:text-gray-600"
                }`}
              />

              <span className={`relative truncate transition-colors duration-200 ${
                active ? "text-[#05005B]" : "text-gray-600 group-hover:text-gray-900"
              }`}>
                {item.label}
              </span>

              <ChevronRight
                size={14}
                className={`relative ml-auto shrink-0 transition-opacity duration-200 ${
                  active ? "opacity-100 text-[#05005B]/40" : "opacity-0"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-gray-100">
        <LogoutButton className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 group" iconSize={18} />
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          aria-label="Open account menu"
        >
          <Menu size={18} className="text-gray-500" />
          <span>Account Menu</span>
          <ChevronDown size={16} className="ml-auto text-gray-400" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={handleBackdropClick}
        >
          <style>{`
            @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
            @keyframes slideIn { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            .animate-slideIn { animation: slideIn 0.3s ease-out; }
          `}</style>

          <div
            ref={drawerRef}
            className="absolute left-0 top-0 bottom-0 bg-white shadow-2xl animate-slideIn"
            style={{ width: `${SIDEBAR_WIDTH}px`, maxWidth: "80vw" }}
          >
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      <div
        className="hidden lg:block lg:sticky self-start"
        style={{
          top: `${PROMOTION_HEADER_HEIGHT + 24}px`,
          width: `${SIDEBAR_WIDTH}px`,
          minWidth: `${SIDEBAR_WIDTH}px`,
          maxWidth: `${SIDEBAR_WIDTH}px`,
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {sidebarContent}
        </div>
      </div>
    </>
  );
});
