import { memo, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartIcon, CartIcon, UserIcon } from "../icons";
import { SearchAutocomplete } from "../SearchAutocomplete/SearchAutocomplete";
import { BRAND_LOGO_URL, NAV_CATEGORIES } from "../../lib/constants";
import { useWishlist } from "../../context/WishlistContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import type { MainNavBarProps } from "../../types";

/**
 * Main navigation bar with logo, category links, search, and action icons
 * Dark navy background with white text
 */
export const MainNavBar = memo(function MainNavBar(_props: MainNavBarProps): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const logoClassName = useMemo(() => (
    `h-6 sm:h-7 md:h-8 w-auto`
  ), []);

  const accountButtonStyle = useMemo(() => ({
    backgroundColor: "#374151",
    color: "#ffffff",
  }), []);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

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
            <div className="relative" onMouseEnter={() => setShowUserDropdown(true)} onMouseLeave={() => setShowUserDropdown(false)}>
              <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-teal-600 text-white">
                <UserIcon />
                <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/account" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span>Profile</span>
                    </Link>
                    <Link to="/account/orders" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span>Orders</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100">
                    <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m-8.25 4H3m12-8.25a4.5 4.5 0 010 8.25H8.25a4.5 4.5 0 010-8.25H15" /></svg>
                      <span>Logout</span>
                    </button>
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
        {NAV_CATEGORIES.map((category) => (
          <span
            key={category}
            className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer"
          >
            {category.toUpperCase()}
          </span>
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
