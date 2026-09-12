import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks";
import { useWishlist } from "@/features/wishlist/hooks";
import { BOTTOM_NAV_ROUTES } from "./constants";

export type NavTab = "home" | "stores" | "eye-test" | "orders" | "wishlist"; // "ar-tryon" — temporarily hidden

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem = memo(function NavItem({ active, onClick, icon, label }: NavItemProps): JSX.Element {
  const activeColor = label === "AI Stylist" ? "#e74c3c" : "#4FC3F7";
  const inactiveColor = "#8899b0";

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center py-1 px-2 relative min-w-[60px]"
    >
      {icon}
      <span
        className="text-[10px] mt-1 font-medium transition-colors"
        style={{ color: active ? activeColor : inactiveColor }}
      >
        {label}
      </span>
      {active && (
        <span
          className="absolute bottom-0 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: activeColor }}
        />
      )}
    </button>
  );
});

const HomeIcon = memo(function HomeIcon({ active }: { active: boolean }): JSX.Element {
  const color = active ? "#4FC3F7" : "#8899b0";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
});

const StoresIcon = memo(function StoresIcon({ active }: { active: boolean }): JSX.Element {
  const color = active ? "#4FC3F7" : "#8899b0";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-4h6v4" />
      <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  );
});

/* AR Try on icon — temporarily hidden
const ARTryOnIcon = memo(function ARTryOnIcon({ active }: { active: boolean }): JSX.Element {
  const color = active ? "#4FC3F7" : "#8899b0";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M2 12h2M20 12h2" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
});
*/

const EyeTestIcon = memo(function EyeTestIcon({ active }: { active: boolean }): JSX.Element {
  const color = active ? "#4FC3F7" : "#8899b0";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" fill={color} />
    </svg>
  );
});

const OrdersIcon = memo(function OrdersIcon({ active }: { active: boolean }): JSX.Element {
  const color = active ? "#4FC3F7" : "#8899b0";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
});

const WishlistIcon = memo(function WishlistIcon({ active }: { active: boolean }): JSX.Element {
  const color = active ? "#e74c3c" : "#8899b0";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#e74c3c" : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
});

export const BottomNav = memo(function BottomNav(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { open: openWishlist } = useWishlist();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  const activeTab = useMemo<NavTab>(() => {
    const pathname = location.pathname;
    return (
      (Object.keys(BOTTOM_NAV_ROUTES) as NavTab[]).find((tab) => {
        const route = BOTTOM_NAV_ROUTES[tab];
        return route === "/" ? pathname === "/" : pathname.startsWith(route);
      }) ?? "home"
    );
  }, [location.pathname]);

  const handleTabChange = useCallback(
    (tab: NavTab) => {
      if (tab === "wishlist") {
        if (isAuthenticated) {
          openWishlist();
        } else {
          navigate("/wishlist");
        }
        return;
      }
      const route = BOTTOM_NAV_ROUTES[tab];
      if (location.pathname !== route) {
        navigate(route);
      }
    },
    [openWishlist, isAuthenticated, navigate, location.pathname]
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setIsNavVisible(true);
        lastScrollY.current = currentY;
        return;
      }
      if (Math.abs(currentY - lastScrollY.current) < 5) return;
      setIsNavVisible(currentY < lastScrollY.current);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t md:hidden"
      style={{
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        transform: isNavVisible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        <NavItem
          active={activeTab === "home"}
          onClick={() => handleTabChange("home")}
          icon={<HomeIcon active={activeTab === "home"} />}
          label="Home"
        />
        <NavItem
          active={activeTab === "stores"}
          onClick={() => handleTabChange("stores")}
          icon={<StoresIcon active={activeTab === "stores"} />}
          label="Stores"
        />
        {/* AR Try on — temporarily hidden
        <NavItem
          active={activeTab === "ar-tryon"}
          onClick={() => handleTabChange("ar-tryon")}
          icon={<ARTryOnIcon active={activeTab === "ar-tryon"} />}
          label="AR Try on"
        />
        */}
        <NavItem
          active={activeTab === "eye-test"}
          onClick={() => handleTabChange("eye-test")}
          icon={<EyeTestIcon active={activeTab === "eye-test"} />}
          label="Eye Test"
        />
        <NavItem
          active={activeTab === "orders"}
          onClick={() => handleTabChange("orders")}
          icon={<OrdersIcon active={activeTab === "orders"} />}
          label="Orders"
        />
        <NavItem
          active={activeTab === "wishlist"}
          onClick={() => handleTabChange("wishlist")}
          icon={<WishlistIcon active={activeTab === "wishlist"} />}
          label="Wishlist"
        />
      </div>
    </nav>
  );
});

BottomNav.displayName = "BottomNav";
