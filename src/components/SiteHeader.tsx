import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// React's KeyboardEvent is aliased because the bare name is the DOM
// KeyboardEvent used by the document-level Escape listeners below.
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Truck, Heart, ShoppingBag, User, Package, LogOut, X } from "lucide-react";
import { Container } from "@/shared/components/Container/Container";
import { MobileSearchBar } from "@/components/MobileSearchBar";
import { useAuth, useLoginModal, useLogoutConfirm } from "@/features/auth/hooks";
import { LogoutConfirmDialog } from "@/features/auth/components/LogoutConfirmDialog/LogoutConfirmDialog";
import { useCart } from "@/features/cart/hooks";
import { useWishlist } from "@/features/wishlist/hooks";
import { HEADER_NAV_ITEMS } from "@/shared/constants";
import { ROUTE_PATHS } from "@/shared/constants/routes";

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
  const { isAuthenticated, user } = useAuth();
  const { itemCount: cartCount, loading: isCartLoading } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Sign Out asks for confirmation first (BUG-006) instead of signing out on
  // click. The dialog owns its own overlay, so it renders alongside the header.
  //
  // `triggerRef` is the element focus returns to when the dialog closes. It is
  // attached to the account trigger rather than the Sign Out row, because that
  // row unmounts as soon as the account menu collapses (BUG-015) — focusing a
  // detached node is a silent no-op, which would drop keyboard users on <body>
  // after cancelling. The account trigger is always mounted.
  const {
    isOpen: isSignOutConfirmOpen,
    isLoggingOut: isSigningOut,
    triggerRef: accountTriggerRef,
    open: openSignOutConfirm,
    cancel: cancelSignOut,
    confirm: confirmSignOut,
  } = useLogoutConfirm();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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

  // Publish the header's real rendered height as `--header-height` on <html>.
  // Every page's top spacer consumes it (through `--header-offset` in
  // styles.css), so content clears the fixed header automatically — including
  // below `md`, where the mobile search bar made the header taller. A
  // ResizeObserver keeps it correct across breakpoints and future header
  // changes instead of a hard-coded pixel offset.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${el.offsetHeight}px`
      );
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-height");
    };
  }, []);

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

  const activeCategoryId = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const [root, slug] = parts;
    if (root === "search" && slug) {
      const match = HEADER_NAV_ITEMS.find((item) => item.link === location.pathname);
      return match ? match.id : null;
    }
    if (root === "category" && slug && HEADER_NAV_IDS.includes(slug)) return slug;
    if (root === "online-eye-test") return "home-eye-test";
    // The store-locator branch is compared against the shared route constant, so
    // both store pages (/stores and /find-nearest-store) keep the "Store
    // Locator" pill highlighted and the highlight follows the path if it ever
    // changes (BUG-024).
    if (
      location.pathname === ROUTE_PATHS.storeLocator ||
      location.pathname === ROUTE_PATHS.findNearestStore
    ) {
      return "store-locator";
    }
    if (root === "moi-approved-eye-test-qatar") return "moi-approved";
    return null;
  }, [location.pathname]);

  // Spread with `[...name]` so a name starting with a surrogate pair (an emoji,
  // some accented scripts) is not cut in half by charAt.
  const trimmedName = user?.name?.trim() ?? "";
  const initial = trimmedName ? ([...trimmedName][0]?.toUpperCase() ?? "") : "";
  const firstName = user?.name?.split(" ")[0] ?? "";

  // BUG-015: the account menu was a <div>/<span> pair with no click handler at
  // all. It only ever appeared because the panel was revealed by a CSS
  // `group-hover:` rule, which means it was dead on touch (no hover, no handler
  // to fall back on), unreachable by keyboard, and had no aria-expanded state.
  //
  // It is now driven by real state behind a real <button>, so click, tap,
  // Enter/Space, outside click and Escape all work, and the panel is a real
  // role="menu" to match the aria-haspopup="menu" it advertises.
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuId = "site-header-account-menu";

  const closeAccountMenu = useCallback((returnFocus = false) => {
    setIsAccountMenuOpen(false);
    if (returnFocus) accountTriggerRef.current?.focus();
  }, []);

  const toggleAccountMenu = useCallback(() => {
    setIsAccountMenuOpen((prev) => !prev);
  }, []);

  // Activating any row navigates or acts, so the panel is no longer needed.
  const collapseAccountMenu = useCallback(() => setIsAccountMenuOpen(false), []);

  // Signed out (or logged out) there is no account trigger left, so the panel
  // must not survive the session that owned it.
  useEffect(() => {
    if (!isAuthenticated) setIsAccountMenuOpen(false);
  }, [isAuthenticated]);

  // Outside click and Escape, mirroring the search overlay's handling. The
  // setTimeout defers listener registration so the click that opened the menu
  // is not immediately read as an outside click.
  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        closeAccountMenu();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Stopped so the search overlay's own Escape handler does not also fire.
      e.stopPropagation();
      closeAccountMenu(true);
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
  }, [isAccountMenuOpen, closeAccountMenu]);

  /**
   * Arrow/Home/End navigation across the menu rows. Bound to the wrapper rather
   * than the panel so it works while focus is still on the trigger, where
   * currentIndex is -1 and ArrowDown lands on the first row.
   */
  const handleAccountMenuKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const rows = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
    );
    if (rows.length === 0) return;

    e.preventDefault();
    if (e.key === "Home") {
      rows[0].focus();
      return;
    }
    if (e.key === "End") {
      rows[rows.length - 1].focus();
      return;
    }
    const current = rows.indexOf(document.activeElement as HTMLElement);
    const next = current + (e.key === "ArrowDown" ? 1 : -1);
    rows[(next + rows.length) % rows.length].focus();
  }, []);

  return (
    <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
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
        <Container className="relative grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-3 py-2 md:py-3 h-[78px] md:h-[88px]">
          {/* Left cluster — Search + Track Order */}
          <div className="flex items-center justify-start gap-1.5 md:gap-[22px] min-w-0">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-ink hover:text-teal transition-colors p-1.5 md:p-0"
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
            className="flex flex-col items-center justify-center text-center min-w-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0"
          >
            <div className="relative w-[66px] h-[50px] md:w-[82px] md:h-[62px] overflow-hidden shrink-0 mx-auto">
              <img
                src="/logo.png"
                alt=""
                className="absolute left-1/2 top-1/2 w-[142px] md:w-[176px] max-w-none -translate-x-1/2 -translate-y-1/2"
              />
            </div>
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
              <div
                ref={accountMenuRef}
                className="relative"
                onKeyDown={handleAccountMenuKeyDown}
              >
                <button
                  ref={accountTriggerRef}
                  type="button"
                  onClick={toggleAccountMenu}
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                  aria-controls={isAccountMenuOpen ? accountMenuId : undefined}
                  aria-label={
                    firstName ? `Account menu, signed in as ${firstName}` : "Account menu"
                  }
                  className="flex min-h-[40px] min-w-[40px] items-center gap-2 rounded-full p-1 cursor-pointer transition-colors hover:bg-teal-tint/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                >
                  {/* Both spans are decorative: the accessible name comes from
                      the button's aria-label, so the trigger reads as one control
                      rather than an initial plus a stray name. */}
                  <span
                    aria-hidden="true"
                    className="w-8 h-8 shrink-0 rounded-full bg-amber text-white flex items-center justify-center text-sm font-bold"
                  >
                    {initial || "U"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden lg:inline text-sm font-medium text-ink max-w-28 truncate"
                  >
                    {firstName}
                  </span>
                </button>
                <div
                  id={accountMenuId}
                  role="menu"
                  aria-label="Account"
                  className={`absolute right-0 top-full mt-2 w-[200px] rounded-xl bg-white shadow-lg border border-line overflow-hidden transition-all duration-200 z-50 ${
                    isAccountMenuOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible translate-y-1"
                  }`}
                >
                  <Link
                    to="/account/info"
                    role="menuitem"
                    onClick={collapseAccountMenu}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-teal-tint transition-colors focus-visible:outline-none focus-visible:bg-teal-tint"
                  >
                    <User className="w-4 h-4 text-teal" aria-hidden="true" />
                    My Profile
                  </Link>
                  <Link
                    to="/account/orders"
                    role="menuitem"
                    onClick={collapseAccountMenu}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-teal-tint transition-colors focus-visible:outline-none focus-visible:bg-teal-tint"
                  >
                    <Package className="w-4 h-4 text-teal" aria-hidden="true" />
                    My Orders
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      collapseAccountMenu();
                      openWishlist();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-teal-tint transition-colors text-left focus-visible:outline-none focus-visible:bg-teal-tint"
                  >
                    <Heart className="w-4 h-4 text-teal" aria-hidden="true" />
                    Wishlist
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      // Collapse first: the dialog is a sibling overlay, and
                      // keeping the panel open would only trap focus behind it.
                      collapseAccountMenu();
                      openSignOutConfirm();
                    }}
                    disabled={isSigningOut}
                    aria-haspopup="dialog"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-teal-tint transition-colors text-left border-t border-line disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:bg-teal-tint"
                  >
                    <LogOut className="w-4 h-4 text-teal" aria-hidden="true" />
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
              // BUG-012/BUG-014: the label used to be a static "Cart", so a screen
              // reader user got no indication the badge had moved. It now names
              // the current total, reports "loading" while a cart fetch is in
              // flight, and the badge is a polite live region so every confirmed
              // add/remove/quantity change is announced.
              aria-label={
                isCartLoading && cartCount === 0
                  ? "Cart, loading"
                  : `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
              }
              className="relative flex items-center justify-center rounded-full bg-teal text-white hover:bg-teal-deep hover:-translate-y-px transition-all duration-150 p-2.5 md:pl-4 md:pr-5 md:py-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden md:inline ml-2 text-sm font-semibold">Cart</span>
              {/* A pending load shows a placeholder rather than nothing, so an
                  empty-looking badge is never mistaken for a confirmed 0. */}
              {isCartLoading && cartCount === 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber/70 animate-pulse"
                />
              ) : (
                cartCount > 0 && (
                  <span
                    aria-live="polite"
                    aria-atomic="true"
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber text-white text-[11px] font-bold flex items-center justify-center"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile search entry — below the top row, above the category strip */}
      <div className="md:hidden bg-white px-4 pt-3 pb-3">
        <MobileSearchBar />
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
                  // `aria-current` mirrors the amber active pill so assistive tech
                  // announces which section the visitor is on — previously the
                  // highlight was colour-only (BUG-024).
                  aria-current={isActive ? "page" : undefined}
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

      {/* Sign-out confirmation. Portalled to document.body, so it escapes this
          z-50 fixed bar and the dropdown's overflow-hidden clipping. */}
      <LogoutConfirmDialog
        isOpen={isSignOutConfirmOpen}
        isLoggingOut={isSigningOut}
        onCancel={cancelSignOut}
        onConfirm={confirmSignOut}
        returnFocusRef={accountTriggerRef}
      />
    </div>
  );
});

SiteHeader.displayName = "SiteHeader";