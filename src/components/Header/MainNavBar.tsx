import { memo, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  /** Memoize header class based on scroll state */
  const headerClassName = useMemo(() => (
    `h-full flex justify-between items-center ${
      isScrolled ? "bg-white shadow-md" : "bg-black"
    }`
  ), [isScrolled]);
  // const headerClassName = useMemo(() => (
  //   `w-full h-[70px] transition-colors duration-300 ${
  //     isScrolled ? "bg-white shadow-md" : "bg-black"
  //   }`
  // ), [isScrolled]);

  /** Memoize logo class based on scroll state */
  const logoClassName = useMemo(() => (
    `h-6 sm:h-7 md:h-8 w-auto transition-all duration-300 ${isScrolled ? "" : "brightness-0 invert"}`
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
      const isCollections = category === "Collections";
      // Slightly smaller on tablet and below, normal on desktop
      const linkClass =
        "text-xs lg:text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-300";

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

      if (isCollections) {
        return (
          <Link
            key={category}
            to="/collections"
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
    <header className='w-full h-[60px] sm:h-[70px] transition-colors duration-300 '>
    {/* <header className={headerClassName}> */}
      <Container className={headerClassName}>
      {/* <Container className="h-full flex justify-between items-center"> */}
        {/* Logo and Navigation */}
        {/* <div className="flex items-center gap-10"> */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-10 min-w-0">          {/* Mobile menu placeholder (icon only for now) */}
          <button className="lg:hidden p-2 text-xl" aria-label="Menu">
            ☰
          </button>
          <div className="flex items-center shrink-0">
            <img
              src={BRAND_LOGO_URL}
              alt="Brand Logo"
              className={logoClassName}
            />
          </div>
          {/* <nav className="flex items-center gap-8"> */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6 flex-shrink min-w-0">            {navLinks}
          </nav>
        </div>

        {/* Search and Action Icons */}
        {/* <div className="flex items-center gap-5"> */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Search Input */}
          <div
className="hidden md:flex items-center gap-2 h-10 bg-gray-100 rounded-md px-3 flex-1 min-w-0 max-w-[400px]"            style={{ paddingLeft: "20px" }}
          >
            <SearchIcon className="flex-shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="border-none bg-transparent outline-none text-sm text-gray-700 w-full h-full min-w-0"
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
            type="button"
            onClick={() => navigate("/cart")}
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
