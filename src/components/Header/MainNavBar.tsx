import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, HeartIcon, CartIcon, UserIcon, CameraIcon, LocationIcon } from "../icons";
import { BRAND_LOGO_URL } from "../../lib/constants";
import { useWishlist } from "../../context/WishlistContext";
import { useLoginModal } from "../../context/LoginModalContext";

/**
 * Compact mobile-friendly navigation bar
 * Location selector | Search with Camera | Icons
 */
export const MainNavBar = memo(function MainNavBar({ isScrolled }: { isScrolled?: boolean }): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className={`w-full ${isScrolled ? "bg-white" : "bg-white"} shadow-sm`}>
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Location Selector */}
        <button className="flex items-center gap-1 flex-shrink-0">
          <LocationIcon className="w-4 h-4 text-gray-700" />
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-500 leading-none">Deliver to</span>
            <span className="text-xs font-semibold text-gray-900 leading-tight">Bangalore 56001</span>
          </div>
          <svg className="w-3 h-3 text-gray-400 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </button>

        {/* Search Bar with Camera */}
        <div 
          className={`flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 mx-1 transition-all ${
            searchFocused ? "ring-2 ring-blue-500 bg-white" : ""
          }`}
        >
          <SearchIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search eyewear..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {/* Camera Icon */}
          <button className="flex-shrink-0 p-1" aria-label="Camera search">
            <CameraIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Wishlist */}
          <button
            onClick={openWishlist}
            className="relative p-2 text-gray-700"
            aria-label="Wishlist"
          >
            <HeartIcon className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full">
                {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 text-gray-700"
            aria-label="Cart"
          >
            <CartIcon className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center bg-blue-600 text-white text-[9px] font-bold rounded-full">
              0
            </span>
          </button>

          {/* Profile */}
          <button
            onClick={openLoginModal}
            className="p-2 text-gray-700"
            aria-label="Sign In"
          >
            <UserIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
});

MainNavBar.displayName = "MainNavBar";
