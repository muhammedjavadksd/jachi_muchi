import { memo, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartIcon, CartIcon, UserIcon } from "../icons";
import { BRAND_LOGO_URL, NAV_CATEGORIES } from "../../lib/constants";
import { useWishlist } from "../../context/WishlistContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { useAuth } from "../../context/AuthContext";
import type { MainNavBarProps } from "../../types";

/**
 * Main navigation bar with logo, category links, search, and action icons
 * Dark navy background with white text
 */
export const MainNavBar = memo(function MainNavBar(_props: MainNavBarProps): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const logoClassName = useMemo(() => (
    `h-6 sm:h-7 md:h-8 w-auto`
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

          <button type="button" onClick={() => navigate("/cart")} className="flex items-center justify-center w-10 h-10 text-white" aria-label="Cart">
            <CartIcon />
          </button>

          {isAuthenticated && user ? (
            <div className="relative" onMouseEnter={() => setShowUserDropdown(true)} onMouseLeave={() => setShowUserDropdown(false)}>
              <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-teal-600 text-white">
                <UserIcon />
                <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="py-2">
                    <Link to="/account" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span>My Account</span>
                    </Link>
                    <Link to="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span>My Orders</span>
                    </Link>
                    <Link to="/account/3d-model" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <span>My 3D Models</span>
                    </Link>
                    <Link to="/account/notifications" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      <span>Notifications</span>
                    </Link>
                    <Link to="/account/address" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11v3" /></svg>
                      <span>Manage Address</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100">
                    <Link to="/support" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Help & Support</span>
                    </Link>
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
        <div className="flex items-center gap-2 h-10 bg-[#162d5a] rounded-lg px-3">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400 min-w-0"
          />
          <button className="shrink-0 p-1" aria-label="Scan">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
});

MainNavBar.displayName = "MainNavBar";
