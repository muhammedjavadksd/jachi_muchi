import { memo, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../Container/Container";
import { PhoneIcon, SearchIcon, HeartIcon, CartIcon } from "../icons";
import { useWishlist } from "../../context/WishlistContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { useAuth } from "../../context/AuthContext";
import { 
  UTILITY_LINKS, 
  SUPPORT_PHONE, 
  BRAND_LOGO_URL,
  SEARCH_CATEGORIES 
} from "../../lib/constants";

/**
 * Promotion header for search/listing pages
 * Light themed header with category navigation bar
 * Memoized to prevent unnecessary re-renders
 */
export const PromotionHeader = memo(function PromotionHeader(): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

  /** Memoize utility links */
  const utilityLinksElements = useMemo(() => (
    UTILITY_LINKS.map((link) => (
      <span key={link} className="flex items-center">
        <a
          href={`#${link.toLowerCase().replace(/ /g, "-")}`}
          className="hover:underline"
        >
          {link}
        </a>
      </span>
    ))
  ), []);

  /** Memoize category links */
  const categoryLinks = useMemo(() => (
    SEARCH_CATEGORIES.map((category) => (
      <a
        key={category.id}
        href={category.link}
        className={`text-xs font-semibold whitespace-nowrap transition-colors hover:text-teal-700 ${
          category.id === "sale" ? "text-red-500" : "text-gray-800"
        }`}
      >
        {category.label}
      </a>
    ))
  ), []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Utility Bar */}
      <div className="w-full bg-white border-b border-gray-100">
        <Container className="flex justify-between h-8 items-center">
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-600">
            {utilityLinksElements}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-800 font-medium">
            <PhoneIcon className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">{SUPPORT_PHONE}</span>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-white border-b border-gray-200">
        <Container className="flex items-center justify-between h-12 sm:h-16 py-2 sm:py-0">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={BRAND_LOGO_URL}
              alt="Brand Logo"
              className="h-5 sm:h-6 w-auto"
            />
          </a>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="flex items-center h-10 bg-gray-50 border border-gray-200 rounded-md px-4 w-full">
              <SearchIcon className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Track Orders - Hidden on mobile */}
            <a 
              href="/track-orders" 
              className="hidden sm:block text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap"
            >
              Track Orders
            </a>

            {/* Sign In / Profile */}
            {isAuthenticated && user ? (
              <div className="relative" onMouseEnter={() => setShowUserDropdown(true)} onMouseLeave={() => setShowUserDropdown(false)}>
                <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 rounded-full text-sm font-medium text-white hover:bg-teal-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
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
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-800 hover:bg-gray-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              type="button"
              onClick={openWishlist}
              className="relative text-gray-700 hover:text-gray-900 p-1"
              aria-label="Wishlist"
            >
              <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              type="button"
              onClick={() => navigate("/cart")}
              className="relative text-gray-700 hover:text-gray-900 p-1"
              aria-label="Cart"
            >
              <CartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                4
              </span>
            </button>
          </div>
        </Container>
      </div>

      {/* Category Navigation Bar */}
      <div className="w-full bg-white border-b border-gray-200">
        <Container className="flex items-center justify-between h-10 overflow-x-auto">
          {/* Category Links - Horizontal scroll on mobile */}
          <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
            {categoryLinks}
          </nav>

          {/* Feature Badges - Hide on small mobile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden xs:block px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] sm:text-xs font-bold rounded">
              3D TRY ON
            </span>
            <span className="hidden xs:block px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-900 text-white text-[10px] sm:text-xs font-bold rounded">
              BLU
            </span>
            <span className="hidden xs:block px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] sm:text-xs font-bold rounded">
              GOLD
            </span>
          </div>
        </Container>
      </div>
    </div>
  );
});

PromotionHeader.displayName = "PromotionHeader";
