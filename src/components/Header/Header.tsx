import { memo } from "react";
import { TopUtilityHeader } from "./TopUtilityHeader";
import { MainNavBar } from "./MainNavBar";
import { MobileSearchOverlay } from "./MobileSearchOverlay";
import { PromoBanner } from "./PromoBanner";
import type { HeaderProps } from "../../types";

/**
 * Fixed header with compact mobile layout
 */
export const Header = memo(function Header({ isScrolled }: HeaderProps): JSX.Element {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Promo Banner Strip */}
      <PromoBanner />
      
      {/* Main Navbar with Search */}
      <MainNavBar 
        isScrolled={isScrolled} 
      />
    </div>
  );
});

Header.displayName = "Header";
