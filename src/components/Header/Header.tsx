import { memo } from "react";
import { TopUtilityHeader } from "./TopUtilityHeader";
import { MainNavBar } from "./MainNavBar";
import type { HeaderProps } from "../../types";

/**
 * Fixed header component containing utility header and main navigation
 * Stays fixed at top of viewport with z-index for overlay
 * Memoized to prevent unnecessary re-renders
 */
export const Header = memo(function Header({ isScrolled }: HeaderProps): JSX.Element {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <TopUtilityHeader />
      <MainNavBar isScrolled={isScrolled} />
    </div>
  );
});

Header.displayName = "Header";
