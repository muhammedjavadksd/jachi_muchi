import { memo, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  CartIcon,
  UserIcon,
  PhoneIcon,
} from "@/shared/components/Icons";
import { SearchAutocomplete } from "@/features/product/components/SearchAutocomplete/SearchAutocomplete";
import { BRAND_LOGO_URL, SUPPORT_PHONE } from "@/shared/constants";
import { NAV_CATEGORIES } from "@/features/account/constants";
import { useAuth, useLoginModal } from "@/features/auth/hooks";
import { useCart } from "@/features/cart/hooks";
import { useWishlist } from "@/features/wishlist/hooks";
import type { HeaderProps } from "@/shared/types";

/** Height of HeaderHome2 (3 rows) for spacer calculation */
export const HEADER_HOME2_SPACER_HEIGHT = 140;

/** Inline icons for top-row service pills (delivery, store, shipping, shop) */
const TruckIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const StoreIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ZapIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const GridIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const TOP_SERVICE_PILLS = [
  {
    label: "Try @ Home",
    sub: "Free trial",
    link: "/try-at-home",
    icon: TruckIcon,
    className: "bg-blue-800 text-white hover:bg-blue-900 border-0",
  },
  {
    label: "Store Visit",
    sub: "Book slot",
    link: "/stores",
    icon: StoreIcon,
    className: "bg-amber-400 text-slate-900 hover:bg-amber-500 border-0",
  },
  {
    label: "Free Shipping",
    sub: "Above ₹499",
    link: "/search",
    icon: ZapIcon,
    className: "bg-red-500 text-white hover:bg-red-600 border-0",
  },
  {
    label: "Shop Eyewear",
    sub: "All frames",
    link: "/search",
    icon: GridIcon,
    className: "bg-sky-200 text-slate-800 hover:bg-sky-300 border-0",
  },
] as const;

/**
 * Home 2 header — 3-row layout inspired by Carrefour-style header.
 * Row 1: Service pills (Try @ Home, Store, Shipping, Shop). Row 2: Logo, location, search, login, cart.
 * Row 3: Category nav. Colors: blue, white, gray, gold, red.
 */
export const HeaderHome2 = memo(function HeaderHome2({
  isScrolled: _isScrolled,
}: HeaderProps): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDropdownEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setShowUserDropdown(true);
  };

  const handleDropdownLeave = () => {
    closeTimerRef.current = setTimeout(() => setShowUserDropdown(false), 150);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

  const navLinks = useMemo(
    () =>
      NAV_CATEGORIES.map((category) => {
        const isTryAtHome = category === "Try @ Home";
        const linkClass =
          "text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors whitespace-nowrap";
        if (isTryAtHome) {
          return (
            <Link key={category} to="/try-at-home" className={linkClass}>
              {category}
            </Link>
          );
        }
        return (
          <a
            key={category}
            href={`#${category.toLowerCase().replace(/ /g, "-")}`}
            className={linkClass}
          >
            {category}
          </a>
        );
      }),
    []
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Row 1: Service pills — light blue/gray gradient */}
      <div className="w-full bg-gradient-to-r from-sky-100 via-slate-100 to-sky-50 border-b border-slate-200/80">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-2.5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {TOP_SERVICE_PILLS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 shadow-sm transition-colors ${item.className}`}
                >
                  <Icon className="shrink-0 w-4 h-4" />
                  <span className="flex flex-col items-start leading-tight">
                    <span className="font-semibold text-sm">{item.label}</span>
                    {item.sub && (
                      <span className="text-[10px] opacity-90">{item.sub}</span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Logo, location, search, login, cart — white */}
      <header className="w-full h-14 bg-white border-b border-slate-200">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <img
              src={BRAND_LOGO_URL}
              alt="Brand"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Location / Store picker — blue button */}
          <Link
            to="/stores"
            className="hidden sm:flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 hover:bg-blue-700 transition-colors shrink-0"
          >
            <StoreIcon className="w-4 h-4 shrink-0" />
            <span className="flex flex-col items-start text-left leading-tight">
              <span className="text-xs font-medium">Store & time</span>
              <span className="text-[11px] opacity-90">Find a store</span>
            </span>
            <ChevronDownIcon className="w-3.5 h-3.5 shrink-0 ml-0.5 opacity-80" />
          </Link>

          {/* Search bar — wide, rounded */}
          <div className="flex-1 min-w-0 max-w-xl mx-2 sm:mx-4">
            <SearchAutocomplete />
          </div>

          {/* Support phone — optional, or we keep for content */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 shrink-0">
            <PhoneIcon className="w-3.5 h-3.5" />
            <span className="font-medium">{SUPPORT_PHONE}</span>
          </div>

          {/* Login & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
                <button className="flex items-center gap-1.5 text-slate-700 hover:text-teal-600 transition-colors">
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">{user.name.split(" ")[0]}</span>
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/account" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Profile
                      </Link>
                      <Link to="/account/orders" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Orders
                      </Link>
                      <Link to="/account/home-try-on-appointments" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        My Home Try-On
                      </Link>
                    </div>
                    <div className="border-t border-gray-100">
                      <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m-8.25 4H3m12-8.25a4.5 4.5 0 010 8.25H8.25a4.5 4.5 0 010-8.25H15" /></svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors"
                aria-label="Sign In"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Sign In</span>
              </button>
            )}
            <button
              type="button"
              onClick={openWishlist}
              className="relative p-2 rounded-full text-slate-700 hover:text-blue-600 transition-colors"
              aria-label="Wishlist"
            >
              <HeartIcon className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                </span>
              )}
            </button>
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
              aria-label="Cart"
            >
              <CartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="text-sm font-semibold">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Row 3: Category nav — white, text links */}
      <nav className="w-full h-11 bg-white border-b border-slate-200">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 h-full flex items-center gap-6 overflow-x-auto">
          <Link
            to="/search"
            className="flex items-center gap-2 text-slate-800 font-semibold hover:text-blue-600 shrink-0"
          >
            <GridIcon className="w-4 h-4" />
            <span className="text-sm">All Categories</span>
          </Link>
          <span className="w-px h-5 bg-slate-200 shrink-0" aria-hidden />
          {navLinks}
        </div>
      </nav>
    </div>
  );
});

HeaderHome2.displayName = "HeaderHome2";
