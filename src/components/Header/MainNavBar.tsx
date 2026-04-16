import { memo, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, HeartIcon, CartIcon, UserIcon } from "../icons";
import { BRAND_LOGO_URL, NAV_CATEGORIES } from "../../lib/constants";
import { useWishlist } from "../../context/WishlistContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { useAuth } from "../../context/AuthContext";
import type { MainNavBarProps } from "../../types";

interface MegaMenuColumn {
  title: string;
  subtitle?: string;
  bannerImage?: string;
  items: {
    label: string;
    link: string;
    thumbnail?: string;
    price?: number;
  }[];
}

interface MegaMenuData {
  [key: string]: MegaMenuColumn[];
}

const MEGA_MENU_DATA: MegaMenuData = {
  "Eyeglasses": [
    {
      title: "MEN Eyeglasses",
      subtitle: "Starting ₹699",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/men_eyeglass.jpg",
      items: [
        { label: "Rectangle", link: "/search/eyeglasses?shape=rectangle&gender=men", price: 699 },
        { label: "Aviator", link: "/search/eyeglasses?shape=aviator&gender=men", price: 899 },
        { label: "Round", link: "/search/eyeglasses?shape=round&gender=men", price: 799 },
        { label: "Square", link: "/search/eyeglasses?shape=square&gender=men", price: 749 },
        { label: "Clubmaster", link: "/search/eyeglasses?shape=clubmaster&gender=men", price: 999 },
      ]
    },
    {
      title: "WOMEN Eyeglasses",
      subtitle: "Starting ₹699",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/women_eyeglass.jpg",
      items: [
        { label: "Cateye", link: "/search/eyeglasses?shape=cateye&gender=women", price: 699 },
        { label: "Rectangle", link: "/search/eyeglasses?shape=rectangle&gender=women", price: 749 },
        { label: "Round", link: "/search/eyeglasses?shape=round&gender=women", price: 799 },
        { label: "Oval", link: "/search/eyeglasses?shape=oval&gender=women", price: 699 },
      ]
    },
    {
      title: "KIDS Eyeglasses",
      subtitle: "Starting ₹499",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/kids_eyeglass.jpg",
      items: [
        { label: "Rectangle", link: "/search/eyeglasses?shape=rectangle&gender=kids", price: 499 },
        { label: "Round", link: "/search/eyeglasses?shape=round&gender=kids", price: 549 },
        { label: "Cat Eye", link: "/search/eyeglasses?shape=cat-eye&gender=kids", price: 599 },
      ]
    },
  ],
  "Sunglasses": [
    {
      title: "MEN Sunglasses",
      subtitle: "Polarized with UV Protection",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/men_sun.jpg",
      items: [
        { label: "Aviator", link: "/search/sunglasses?shape=aviator&gender=men", price: 999 },
        { label: "Wayfarer", link: "/search/sunglasses?shape=wayfarer&gender=men", price: 899 },
        { label: "Sports", link: "/search/sunglasses?shape=sports&gender=men", price: 1299 },
        { label: "Rectangle", link: "/search/sunglasses?shape=rectangle&gender=men", price: 849 },
        { label: "Round", link: "/search/sunglasses?shape=round&gender=men", price: 799 },
      ]
    },
    {
      title: "WOMEN Sunglasses",
      subtitle: "Stylish & UV Protected",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/women_sun.jpg",
      items: [
        { label: "Cat Eye", link: "/search/sunglasses?shape=cat-eye&gender=women", price: 899 },
        { label: "Aviator", link: "/search/sunglasses?shape=aviator&gender=women", price: 999 },
        { label: "Round", link: "/search/sunglasses?shape=round&gender=women", price: 749 },
        { label: "Wayfarer", link: "/search/sunglasses?shape=wayfarer&gender=women", price: 849 },
      ]
    },
    {
      title: "KIDS Sunglasses",
      subtitle: "UV 400 Protection",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/kids_sun.jpg",
      items: [
        { label: "Aviator", link: "/search/sunglasses?shape=aviator&gender=kids", price: 599 },
        { label: "Wayfarer", link: "/search/sunglasses?shape=wayfarer&gender=kids", price: 549 },
        { label: "Sports", link: "/search/sunglasses?shape=sports&gender=kids", price: 699 },
      ]
    },
  ],
  "Collections": [
    {
      title: "Premium Collection",
      subtitle: "Premium Eyewear",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/jj.jpg",
      items: [
        { label: "John Jacobs", link: "/brands/john-jacobs", price: 3499 },
        { label: "Lenskart Studio", link: "/brands/lenskart-studio", price: 2999 },
        { label: "Oliver Peoples", link: "/brands/oliver-peoples", price: 4999 },
      ]
    },
    {
      title: "Value Collection",
      subtitle: "Affordable Style",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/vc.jpg",
      items: [
        { label: "Vincent Chase", link: "/brands/vincent-chase", price: 1299 },
        { label: "Lenskart Air", link: "/brands/lenskart-air", price: 2499 },
        { label: "Rampage", link: "/brands/rampage", price: 999 },
      ]
    },
    {
      title: "Specialty Lenses",
      subtitle: "Advanced Optics",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/lens.jpg",
      items: [
        { label: "Blue Light", link: "/search/blue-light", price: 1499 },
        { label: "Photochromic", link: "/search/photochromic", price: 1999 },
        { label: "Progressive", link: "/search/progressive", price: 2499 },
      ]
    },
  ],
  "Contact": [
    {
      title: "Contact Lenses",
      subtitle: "Clear Vision",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/contacts.jpg",
      items: [
        { label: "Daily Disposables", link: "/search/contact-lenses?type=daily", price: 599 },
        { label: "Monthly Lenses", link: "/search/contact-lenses?type=monthly", price: 799 },
        { label: "Color Contacts", link: "/search/contact-lenses?type=color", price: 999 },
      ]
    },
    {
      title: "Solutions",
      subtitle: "Lens Care",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/solution.jpg",
      items: [
        { label: "Cleaning Solution", link: "/search/solution", price: 199 },
        { label: "Eye Drops", link: "/search/eye-drops", price: 149 },
        { label: "Lens Case", link: "/search/lens-case", price: 99 },
      ]
    },
    {
      title: "Eye Care",
      subtitle: "Professional Care",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/eyecare.jpg",
      items: [
        { label: "Eye Test", link: "/home-try-on", price: 99 },
        { label: "Digital Retinography", link: "/search/digital-retino", price: 299 },
        { label: "Cornea Check", link: "/search/cornea-check", price: 199 },
      ]
    },
  ],
  "Stores": [
    {
      title: "Delhi NCR",
      subtitle: "15+ Stores",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/delhi.jpg",
      items: [
        { label: "Rajouri Garden", link: "/stores/rajouri-garden", price: undefined },
        { label: "Nehru Place", link: "/stores/nehru-place", price: undefined },
        { label: "Cyber Hub", link: "/stores/cyber-hub", price: undefined },
      ]
    },
    {
      title: "Mumbai",
      subtitle: "20+ Stores",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/mumbai.jpg",
      items: [
        { label: "Phoenix Mall", link: "/stores/phoenix-mall", price: undefined },
        { label: "High Street Phoenix", link: "/stores/high-street", price: undefined },
        { label: "Bandra", link: "/stores/bandra", price: undefined },
      ]
    },
    {
      title: "Bangalore",
      subtitle: "12+ Stores",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/bangalore.jpg",
      items: [
        { label: "ORR Junction", link: "/stores/orr-junction", price: undefined },
        { label: "MG Road", link: "/stores/mg-road", price: undefined },
        { label: "Whitefield", link: "/stores/whitefield", price: undefined },
      ]
    },
  ],
  "Try @ Home": [
    {
      title: "Home Eye Test",
      subtitle: "At Your Doorstep",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/home_eye.jpg",
      items: [
        { label: "Book Eye Test", link: "/home-try-on", price: 99 },
        { label: "Frame Trial", link: "/try-at-home", price: 0 },
        { label: "How It Works", link: "/how-it-works", price: undefined },
      ]
    },
    {
      title: "Store Experience",
      subtitle: "Visit Us",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/store_exp.jpg",
      items: [
        { label: "Find Nearest Store", link: "/store-locator", price: undefined },
        { label: "Book Appointment", link: "/book-appointment", price: undefined },
        { label: "Virtual Try-On", link: "/3d-try-on", price: 0 },
      ]
    },
    {
      title: "Online Services",
      subtitle: "Digital Access",
      bannerImage: "https://static.lenskart.com/media/desktop/img/menu_banner/online.jpg",
      items: [
        { label: "Video Consultation", link: "/video-consult", price: 199 },
        { label: "Chat with Expert", link: "/chat-expert", price: 0 },
        { label: "Order Tracking", link: "/order-tracking", price: undefined },
      ]
    },
  ],
};

/**
 * Main navigation bar with logo, category links, search, and action icons
 * Changes background color based on scroll position
 * Memoized to only re-render when isScrolled changes
 */
export const MainNavBar = memo(function MainNavBar({ isScrolled }: MainNavBarProps): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (category: string) => {
    if (MEGA_MENU_DATA[category]) {
      setActiveDropdown(category);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  /** Render mega menu */
  const renderMegaMenu = (category: string) => {
    const columns = MEGA_MENU_DATA[category];
    if (!columns || columns.length === 0) return null;

    return (
      <div 
        ref={dropdownRef}
        className="absolute left-0 top-full w-full bg-gray-50 shadow-2xl z-50 overflow-hidden"
        onMouseEnter={() => handleMouseEnter(category)}
        onMouseLeave={handleMouseLeave}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-4">
            {columns.map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col">
                {/* Banner Section */}
                <div className="relative h-32 bg-white rounded-lg overflow-hidden mb-3 group cursor-pointer" onClick={() => navigate(`/search/${category.toLowerCase().replace(/ /g, '-')}`)}>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent z-10" />
                  <div className="absolute left-3 top-3 z-20">
                    <h3 className="text-base font-bold text-white">{column.title}</h3>
                    {column.subtitle && (
                      <p className="text-xs text-gray-200">{column.subtitle}</p>
                    )}
                  </div>
                  {column.bannerImage ? (
                    <img src={column.bannerImage} alt={column.title} className="absolute right-0 top-0 w-24 h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-teal-500 to-teal-600" />
                  )}
                </div>

                {/* Items List */}
                <div className="flex flex-col bg-white rounded-lg overflow-hidden">
                  {column.items.map((item, itemIdx) => (
                    <button
                      key={itemIdx}
                      onClick={() => navigate(item.link)}
                      className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {item.thumbnail && (
                          <img src={item.thumbnail} alt={item.label} className="w-8 h-8 rounded object-cover" />
                        )}
                        <span className="text-sm text-gray-700 group-hover:text-teal-600 font-medium">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.price !== undefined && (
                          <span className="text-xs text-gray-500">
                            {item.price === 0 ? 'Free' : item.price ? `₹${item.price}` : null}
                          </span>
                        )}
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /** Memoize navigation links */
  const navLinks = useMemo(() => (
    NAV_CATEGORIES.map((category) => {
      const hasMegaMenu = !!MEGA_MENU_DATA[category];
      const linkClass = `text-xs lg:text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-300 relative ${hasMegaMenu ? 'cursor-pointer hover:text-teal-400' : ''}`;

      return (
        <div 
          key={category} 
          className="relative h-full flex items-center"
          onMouseEnter={() => handleMouseEnter(category)}
          onMouseLeave={handleMouseLeave}
        >
          {category === "Try @ Home" && (
            <Link to="/try-at-home" className={linkClass} style={textColorStyle}>
              {category}
            </Link>
          )}
          {category === "Collections" && (
            <Link to="/collections" className={linkClass} style={textColorStyle}>
              {category}
            </Link>
          )}
          {category !== "Try @ Home" && category !== "Collections" && (
            <span className={linkClass} style={textColorStyle}>
              {category}
            </span>
          )}
          
          {hasMegaMenu && activeDropdown === category && renderMegaMenu(category)}
        </div>
      );
    })
  ), [textColorStyle, activeDropdown]);

  return (
    <header className="relative w-full h-[60px] sm:h-[70px] transition-colors duration-300">
      <div className={`w-full flex justify-between items-center h-full px-4 ${headerClassName}`}>
        {/* Logo and Navigation */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-10 min-w-0">
          <button className="lg:hidden p-2 text-xl" aria-label="Menu">
            ☰
          </button>
          <div className="flex items-center shrink-0">
            <img src={BRAND_LOGO_URL} alt="Brand Logo" className={logoClassName} />
          </div>
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6 flex-shrink min-w-0 h-full">
            {navLinks}
          </nav>
        </div>

        {/* Search and Action Icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 h-10 bg-gray-100 rounded-md px-3 flex-1 min-w-0 max-w-[400px]" style={{ paddingLeft: "20px" }}>
            <SearchIcon className="flex-shrink-0" />
            <input type="text" placeholder="What are you looking for?" className="border-none bg-transparent outline-none text-sm text-gray-700 w-full h-full min-w-0" />
          </div>

          <button type="button" onClick={openWishlist} className="relative flex items-center justify-center w-10 h-10 transition-colors duration-300" style={textColorStyle} aria-label="Wishlist">
            <HeartIcon />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
              </span>
            )}
          </button>

          <button type="button" onClick={() => navigate("/cart")} className="flex items-center justify-center w-10 h-10 transition-colors duration-300" style={textColorStyle} aria-label="Cart">
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
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3-3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
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
            <button type="button" onClick={openLoginModal} className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300" style={accountButtonStyle} aria-label="Sign In">
              <UserIcon />
              <span className="text-sm font-medium hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mega Menu - Rendered at header level for full-width */}
      {activeDropdown && renderMegaMenu(activeDropdown)}
    </header>
  );
});

MainNavBar.displayName = "MainNavBar";
