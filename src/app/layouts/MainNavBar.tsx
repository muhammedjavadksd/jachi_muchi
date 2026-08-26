import { memo, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HeartIcon, CartIcon, UserIcon } from "@/shared/components/Icons";
import { SearchAutocomplete } from "@/features/product/components/SearchAutocomplete/SearchAutocomplete";
import { BRAND_LOGO_URL } from "@/shared/constants";
import { useAuth, useLoginModal } from "@/features/auth/hooks";
import { LogoutButton } from "@/features/auth";
import { useCart } from "@/features/cart/hooks";
import { useWishlist } from "@/features/wishlist/hooks";
import { useUserDropdown } from "@/shared/hooks";
import type { MainNavBarProps } from "@/shared/types";

/**
 * Main navigation bar with logo, category links, search, and action icons
 * Dark navy background with white text
 */
export const MainNavBar = memo(function MainNavBar(_props: MainNavBarProps): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const { itemCount: cartCount } = useCart();
  const navigate = useNavigate();
  const { isOpen: showUserDropdown, toggle: toggleUserDropdown, close: closeUserDropdown, containerRef: userDropdownRef } = useUserDropdown();

  const logoClassName = useMemo(() => (
    `h-10 sm:h-12 md:h-14 w-auto object-contain`
  ), []);

  const accountButtonStyle = useMemo(() => ({
    backgroundColor: "#374151",
    color: "#ffffff",
  }), []);

  return (
    <header className="relative w-full bg-[#0a1f44]">
      {/* Top Bar - Logo and Action Icons */}
      <div className="w-full flex justify-between items-center h-14 sm:h-16 px-3 sm:px-4">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <img src={BRAND_LOGO_URL} alt="Brand Logo" className={logoClassName} />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          <button type="button" onClick={openWishlist} className="relative flex items-center justify-center w-10 h-10 text-white" aria-label="Wishlist">
            <HeartIcon />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
              </span>
            )}
          </button>

          <button type="button" onClick={() => navigate("/cart")} className="relative flex items-center justify-center w-10 h-10 text-white" aria-label="Cart">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={toggleUserDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-teal-600 text-white"
                aria-expanded={showUserDropdown}
                aria-haspopup="true"
              >
                <UserIcon />
                <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/account" onClick={closeUserDropdown} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span>Profile</span>
                    </Link>
                    <Link to="/account/orders" onClick={closeUserDropdown} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span>Orders</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100">
                    <LogoutButton className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button type="button" onClick={openLoginModal} className="flex items-center gap-2 px-3 py-2 rounded-full" style={accountButtonStyle} aria-label="Sign In">
              <UserIcon />
              <span className="text-sm font-medium hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center gap-1 sm:gap-3 md:gap-4 px-3 sm:px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {([
          { label: "EYEGLASSES",  to: "/search/eyeglasses" },
          { label: "SUNGLASSES",  to: "/search/sunglasses" },
          { label: "COLLECTIONS", to: "/collections" },
          { label: "CONTACT",     to: "/search/contact-lenses" },
          { label: "STORES",      to: "/stores" },
          { label: "TRY @ HOME",  to: "/try-at-home" },
        ] as const).map(({ label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `relative text-xs sm:text-sm font-medium transition-colors pb-1 ${
                isActive
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full"
                  : "text-gray-300 hover:text-white"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Search Bar */}
      <div className="px-3 sm:px-4 pb-3">
        <SearchAutocomplete variant="dark" placeholder="Search" />
      </div>
    </header>
  );
});

MainNavBar.displayName = "MainNavBar";
