import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container } from "../Container/Container";
import { SearchIcon, HeartIcon, CartIcon, UserIcon } from "../icons";
import { BRAND_LOGO_URL, NAV_CATEGORIES } from "../../lib/constants";
import { useWishlist } from "../../context/WishlistContext";
import { useLoginModal } from "../../context/LoginModalContext";
import type { MainNavBarProps } from "../../types";

/**
 * Main navigation bar with logo, category links, search, and action icons
 * Changes background color based on scroll position
 * Memoized to only re-render when isScrolled changes
 */
export const MainNavBar = memo(function MainNavBar({ isScrolled }: MainNavBarProps): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();

  /** Memoize header class based on scroll state */
  const headerClassName = useMemo(() => (
    `w-full h-[70px] transition-colors duration-300 ${
      isScrolled ? "bg-white shadow-md" : "bg-black"
    }`
  ), [isScrolled]);

  /** Memoize logo class based on scroll state */
  const logoClassName = useMemo(() => (
    `h-7 w-auto transition-all duration-300 ${isScrolled ? "" : "brightness-0 invert"}`
  ), [isScrolled]);

  /** Memoize text color style based on scroll state */
  const textColorStyle = useMemo(() => ({ 
    color: isScrolled ? "#111827" : "#ffffff" 
  }), [isScrolled]);

  /** Memoize account button style based on scroll state */
  const accountButtonStyle = useMemo(() => ({
    backgroundColor: isScrolled ? "#e5e7eb" : "#374151",
    color: isScrolled ? "#111827" : "#ffffff",
  }), [isScrolled]);

  /** Memoize navigation links to prevent recreation */
  const navLinks = useMemo(() => (
    NAV_CATEGORIES.map((category) => {
      const isTryAtHome = category === "Try @ Home";
      const linkClass = "text-md font-medium whitespace-nowrap transition-colors duration-300";
      if (isTryAtHome) {
        return (
          <Link
            key={category}
            to="/try-at-home"
            className={linkClass}
            style={textColorStyle}
          >
            {category}
          </Link>
        );
      }
      return (
        <a
          key={category}
          href={`#${category.toLowerCase().replace(/ /g, "-")}`}
          className={linkClass}
          style={textColorStyle}
        >
          {category}
        </a>
      );
    })
  ), [textColorStyle]);

  return (
    <header className={headerClassName}>
      <Container className="h-full flex justify-between items-center">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-10">
          <div className="flex items-center">
            <img
              src={BRAND_LOGO_URL}
              alt="Brand Logo"
              className={logoClassName}
            />
          </div>
          <nav className="flex items-center gap-8">
            {navLinks}
          </nav>
        </div>

        {/* Search and Action Icons */}
        <div className="flex items-center gap-5">
          {/* Search Input */}
          <div
            className="flex items-center gap-4 h-10 bg-gray-100 rounded-md pr-4 min-w-[280px]"
            style={{ paddingLeft: "20px" }}
          >
            <SearchIcon className="flex-shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="border-none bg-transparent outline-none text-sm text-gray-700 w-full h-full"
            />
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={openWishlist}
            className="relative flex items-center justify-center w-10 h-10 transition-colors duration-300"
            style={textColorStyle}
            aria-label="Wishlist"
          >
            <HeartIcon />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            className="flex items-center justify-center w-10 h-10 transition-colors duration-300"
            style={textColorStyle}
            aria-label="Cart"
          >
            <CartIcon />
          </button>

          {/* Sign In / Account */}
          <button
            type="button"
            onClick={openLoginModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300"
            style={accountButtonStyle}
            aria-label="Sign In"
          >
            <UserIcon />
            <span className="text-sm font-medium hidden sm:inline">Sign In</span>
          </button>
        </div>
      </Container>
    </header>
  );
});

MainNavBar.displayName = "MainNavBar";
