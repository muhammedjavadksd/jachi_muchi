import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../Container/Container";
import { PhoneIcon, SearchIcon, HeartIcon, CartIcon } from "../icons";
import { useWishlist } from "../../context/WishlistContext";
import { useLoginModal } from "../../context/LoginModalContext";
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
  const navigate = useNavigate();

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
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {utilityLinksElements}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-800 font-medium">
            <PhoneIcon className="text-gray-600" />
            <span>{SUPPORT_PHONE}</span>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-white border-b border-gray-200">
        <Container className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={BRAND_LOGO_URL}
              alt="Brand Logo"
              className="h-6 w-auto"
            />
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="flex items-center h-10 bg-gray-50 border border-gray-200 rounded-md px-4">
              <SearchIcon className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Track Orders */}
            <a 
              href="/track-orders" 
              className="text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap"
            >
              Track Orders
            </a>

            {/* Sign In */}
            <button
              type="button"
              onClick={openLoginModal}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-800 hover:bg-gray-200"
            >
              <span>Sign In</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={openWishlist}
              className="relative text-gray-700 hover:text-gray-900"
              aria-label="Wishlist"
            >
              <HeartIcon />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                  {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              type="button"
              onClick={() => navigate("/cart")}
              className="relative text-gray-700 hover:text-gray-900"
              aria-label="Cart"
            >
              <CartIcon />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                4
              </span>
            </button>
          </div>
        </Container>
      </div>

      {/* Category Navigation Bar */}
      <div className="w-full bg-white border-b border-gray-200">
        <Container className="flex items-center justify-between h-10">
          {/* Category Links */}
          <nav className="flex items-center gap-6">
            {categoryLinks}
          </nav>

          {/* Feature Badges */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded">
              3D TRY ON
            </span>
            <span className="px-3 py-1 bg-blue-900 text-white text-xs font-bold rounded">
              BLU
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded">
              GOLD
            </span>
          </div>
        </Container>
      </div>
    </div>
  );
});

PromotionHeader.displayName = "PromotionHeader";
