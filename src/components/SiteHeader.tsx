import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Truck, Heart, ShoppingBag, User, Package, LogOut, X } from "lucide-react";
import { Container } from "@/shared/components/Container/Container";
import { useAuth, useLoginModal } from "@/features/auth/hooks";
import { useCart } from "@/features/cart/hooks";
import { useWishlist } from "@/features/wishlist/hooks";
import { HEADER_NAV_ITEMS } from "@/shared/constants";

export const SITE_HEADER_SPACER_HEIGHT = 132;

const HEADER_NAV_IDS: string[] = HEADER_NAV_ITEMS.map((item) => item.id);

/**
 * Site-wide header/navbar. Rendered once from the root layout so every
 * storefront route shares the identical logo, search/track row, account menu,
 * cart and amber-highlighted category pills. The active pill is derived from
 * the current route (pathname), never hardcoded.
 */
export const SiteHeader = memo(function SiteHeader(): JSX.Element {
  const { open: openWishlist, items: wishlistItems } = useWishlist();
  const { open: openLoginModal } = useLoginModal();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
    const handlePointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    const timerId = setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
    }, 0);
    return () => {
      clearTimeout(timerId);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  const handleSearchSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = query.trim();
      setSearchOpen(false);
      setQuery("");
      if (trimmed) {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, navigate]
  );

  const handleSignOut = useCallback(() => {
    void logout();
  }, [logout]);

  const activeCategoryId = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const [root, slug] = parts;
    if (root === "search" && slug) {
      const match = HEADER_NAV_ITEMS.find((item) => item.link === location.pathname);
      return match ? match.id : null;
    }
    if (root === "category" && slug && HEADER_NAV_IDS.includes(slug)) return slug;
    if (root === "online-eye-test") return "home-eye-test";
    if (root === "stores") return "store-locator";
    return null;
  }, [location.pathname]);

  const initial = user?.name?.trim().charAt(0)?.toUpperCase() ?? "";
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Search overlay — slides down from the top of the viewport */}
      <div className="fixed inset-x-0 top-0 z-[60] pointer-events-none">
        <div
          ref={panelRef}
          className={`bg-teal-deep transition-transform duration-[280ms] ease-out ${
            searchOpen ? "translate-y-0" : "-translate-y-full"
          } pointer-events-auto`}
        >
          <Container className="flex items-end justify-between gap-4 py-5 md:py-6">
            <form onSubmit={handleSearchSubmit} className="flex-1 min-w-0">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search glasses, lenses, brands..."
                aria-label="Search products"
                className="w-full bg-transparent text-white text-lg md:text-xl placeholder:text-white/40 border-b-2 border-white/40 focus:border-amber focus:outline-none pb-2"
              />
            </form>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </Container>
        </div>
      </div>

      {/* Row 1 — main header row */}
      <div className="bg-white border-b border-line">
        <Container className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-3 py-2 md:py-3 h-[78px] md:h-[88px]">
          {/* Left cluster — Search + Track Order */}
          <div className="flex items-center justify-start gap-1.5 md:gap-[22px] min-w-0">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              className="flex items-center gap-2 text-sm font-medium text-ink hover:text-teal transition-colors p-1.5 md:p-0"
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline">Search</span>
            </button>
            <Link
              to="/track"
              className="flex items-center gap-2 text-sm font-medium text-ink hover:text-teal transition-colors p-1.5 md:p-0"
            >
              <Truck className="w-5 h-5" />
              <span className="hidden md:inline">Track Order</span>
            </Link>
          </div>

          {/* Center — Logo */}
          <Link
            to="/"
            aria-label="Jachi & Muchi home"
            className="flex flex-col items-center justify-center text-center min-w-0"
          >
            <img src="/logo.png" alt="" className="h-[38px] md:h-[44px] w-auto shrink-0" />
            <span className="mt-[1px] text-[15px] md:text-[17px] font-bold leading-none tracking-[0.5px] text-teal-deep font-brand whitespace-nowrap">
              JACHI &amp; MUCHI
            </span>
            <span className="mt-[1px] text-[8px] md:text-[9px] font-medium leading-none tracking-[2px] text-amber uppercase font-brand whitespace-nowrap">
              Premium Eyewear
            </span>
          </Link>

          {/* Right cluster — Wishlist + Account + Cart */}
          <div className="flex items-center justify-end gap-2 md:gap-[22px] min-w-0">
            {/* Wishlist */}
            <button
              type="button"
              onClick={openWishlist}
              aria-label="Wishlist"
              className="relative flex items-center justify-center text-ink hover:text-teal transition-colors p-1.5"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-amber text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                </span>
              )}
            </button>

            {/* Account menu */}
            {isAuthenticated && user ? (
              <div className="group relative">
                <div className="flex items-center gap-2 p-1 cursor-pointer">
                  <span className="w-8 h-8 rounded-full bg-amber text-white flex items-center justify-center text-sm font-bold">
                    {initial}
                  </span>
                  <span className="hidden lg:inline text-sm font-medium text-ink max-w-28 truncate">
                    {firstName}
                  </span>
                </div>
                <div className="absolute right-0 top-full mt-2 w-[200px] rounded-xl bg-white shadow-lg border border-line overflow-hidden opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <Link to="/account/info" className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-teal-tint transition-colors">
                    <User className="w-4 h-4 text-teal" />
                    My Profile
                  </Link>
                  <Link to="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-teal-tint transition-colors">
                    <Package className="w-4 h-4 text-teal" />
                    My Orders
                  </Link>
                  <button
                    type="button"
                    onClick={openWishlist}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-teal-tint transition-colors text-left"
                  >
                    <Heart className="w-4 h-4 text-teal" />
                    Wishlist
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-teal-tint transition-colors text-left border-t border-line"
                  >
                    <LogOut className="w-4 h-4 text-teal" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                aria-label="Sign in"
                className="flex items-center gap-2 text-sm font-medium text-ink hover:text-teal transition-colors p-1.5"
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">Sign In</span>
              </button>
            )}

            {/* Cart pill */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              aria-label="Cart"
              className="relative flex items-center justify-center rounded-full bg-teal text-white hover:bg-teal-deep hover:-translate-y-px transition-all duration-150 p-2.5 md:pl-4 md:pr-5 md:py-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden md:inline ml-2 text-sm font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber text-white text-[11px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Row 2 — category pills */}
      <nav className="bg-white border-b border-line">
        <Container>
          <div className="flex items-center justify-start md:justify-center gap-1.5 py-1 overflow-x-auto scrollbar-hide whitespace-nowrap">
            {HEADER_NAV_ITEMS.map((item) => {
              const isActive = item.id === activeCategoryId;
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                    isActive
                      ? "bg-amber text-ink"
                      : "text-ink/70 hover:bg-teal-tint hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </nav>
    </div>
  );
});

SiteHeader.displayName = "SiteHeader";