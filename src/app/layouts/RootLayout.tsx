import { memo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { BottomNav } from "./BottomNav";
import { BOTTOM_NAV_EXCLUDED_PREFIXES } from "./constants";

/**
 * Root layout rendered once for every storefront route. Owns the single
 * site-wide header and the mobile-only bottom navigation so they cannot be
 * imported per page; pages only handle their own content and a spacer that
 * offsets the fixed header.
 */
export const RootLayout = memo(function RootLayout(): JSX.Element {
  const location = useLocation();
  const showBottomNav = !BOTTOM_NAV_EXCLUDED_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  return (
    <>
      <SiteHeader />
      <div className={showBottomNav ? "pb-20 md:pb-0" : undefined}>
        <Outlet />
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
});

RootLayout.displayName = "RootLayout";