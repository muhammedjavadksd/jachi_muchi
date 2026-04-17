import { memo, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, HeartIcon, CartIcon, UserIcon } from "../icons";
import { BRAND_LOGO_URL, NAV_CATEGORIES } from "../../lib/constants";
import { useWishlist } from "../../context/WishlistContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { useAuth } from "../../context/AuthContext";

export const MainNavBar = memo(function MainNavBar({ isScrolled }: { isScrolled?: boolean }): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** Header style */
  const headerClassName = useMemo(() => (
    `w-full flex justify-between items-center px-4 ${
      isScrolled ? "bg-white shadow-md" : "bg-black"
    }`
  ), [isScrolled]);

  /** Logo style */
  const logoClassName = useMemo(() => (
    `h-7 w-auto ${isScrolled ? "" : "brightness-0 invert"}`
  ), [isScrolled]);

  /** Text color */
  const textColorStyle = useMemo(() => ({
    color: isScrolled ? "#111827" : "#ffffff"
  }), [isScrolled]);

  /** Account button style */
  const accountButtonStyle = useMemo(() => ({
    backgroundColor: isScrolled ? "#e5e7eb" : "#374151",
    color: isScrolled ? "#111827" : "#ffffff",
  }), [isScrolled]);

  return (
    <header className="relative w-full h-[70px]">
      <div className={headerClassName}>

        {/* LEFT SECTION */}
        <div className="flex items-center gap-6">
          <img src={BRAND_LOGO_URL} alt="Logo" className={logoClassName} />

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_CATEGORIES.map((category) => (
              <span
                key={category}
                className="cursor-pointer text-sm font-medium"
                style={textColorStyle}
                onMouseEnter={() => setActiveDropdown(category)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {category}
              </span>
            ))}
          </nav>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          {/* SEARCH */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm"
            />
          </div>

          {/* WISHLIST */}
          <button
            onClick={openWishlist}
            className="relative w-10 h-10 flex items-center justify-center"
          >
            <HeartIcon />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
              </span>
            )}
          </button>

          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="w-10 h-10 flex items-center justify-center"
          >
            <CartIcon />
          </button>

          {/* USER */}
          {isAuthenticated && user ? (
            <div
              className="relative"
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <button className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-full">
                <UserIcon />
                <span className="text-sm">{user.name}</span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                  <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                  <Link to="/account/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                  <Link to="/account/address" className="block px-4 py-2 hover:bg-gray-100">Address</Link>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              style={accountButtonStyle}
              className="px-4 py-2 rounded-full"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

MainNavBar.displayName = "MainNavBar";