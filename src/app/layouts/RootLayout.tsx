import { memo } from "react";
import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * Root layout rendered once for every storefront route. Owns the single
 * site-wide header so it cannot be imported per page; pages only handle their
 * own content and a spacer that offsets the fixed header.
 */
export const RootLayout = memo(function RootLayout(): JSX.Element {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
});

RootLayout.displayName = "RootLayout";