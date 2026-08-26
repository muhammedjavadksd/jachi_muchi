import { memo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Container } from "@/shared/components/Container/Container";
import { HeartIcon, CartIcon } from "@/shared/components/Icons";
import { SearchAutocomplete } from "@/features/product/components/SearchAutocomplete/SearchAutocomplete";
import { useAuth, useLoginModal } from "@/features/auth/hooks";
import { LogoutButton } from "@/features/auth";
import { useCart } from "@/features/cart/hooks";
import { useWishlist } from "@/features/wishlist/hooks";
import { useUserDropdown } from "@/shared/hooks";
import { BRAND_LOGO_URL } from "@/shared/constants";
import { SEARCH_CATEGORIES } from "@/features/product/constants";

/**
 * Promotion header for search/listing pages
 * Light themed header with category navigation bar
 * Memoized to prevent unnecessary re-renders
 */
export const PromotionHeader = memo(function PromotionHeader(): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const { itemCount: cartCount } = useCart();
  const navigate = useNavigate();
  const { isOpen: showUserDropdown, toggle: toggleUserDropdown, close: closeUserDropdown, containerRef: userDropdownRef } = useUserDropdown();

  const categoryLinks = SEARCH_CATEGORIES.map((category) => (
    <NavLink
      key={category.id}
      to={category.link}
      className={({ isActive }) =>
        `relative text-xs font-semibold whitespace-nowrap transition-colors pb-2 ${
          isActive
            ? "text-teal-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-700 after:rounded-full"
            : "text-gray-800 hover:text-teal-700"
        }`
      }
    >
      {category.label}
    </NavLink>
  ));

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navigation Bar */}
      <div className="w-full bg-white border-b border-gray-200">
        <Container className="flex items-center justify-between h-12 sm:h-16 py-2 sm:py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={BRAND_LOGO_URL}
              alt="Brand Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchAutocomplete />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Track Orders - Hidden on mobile */}
            <Link
              to="/account/orders"
              className="hidden sm:block text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap"
            >
              Track Orders
            </Link>

            {/* Sign In / Profile */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={toggleUserDropdown}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 rounded-full text-sm font-medium text-white hover:bg-teal-700"
                  aria-expanded={showUserDropdown}
                  aria-haspopup="true"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
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
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/account" onClick={closeUserDropdown} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Profile
                      </Link>
                      <Link to="/account/orders" onClick={closeUserDropdown} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Orders
                      </Link>
                    </div>
                    <div className="border-t border-gray-100">
                      <LogoutButton className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50" iconSize={16} />
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
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-teal-600 text-white text-[10px] font-bold rounded-full">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
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

