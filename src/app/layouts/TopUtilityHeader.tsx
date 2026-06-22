import { memo, useMemo } from "react";
import { PhoneIcon } from "@/shared/components/Icons";
import { SUPPORT_PHONE } from "@/shared/constants";
import { UTILITY_LINKS } from "@/features/account/constants";

/**
 * Top utility header with secondary navigation links and contact info
 * Displays corporate links, store locator, and support phone number
 * Memoized as it contains static content that rarely changes
 */
export const TopUtilityHeader = memo(function TopUtilityHeader(): JSX.Element {
  /** Memoize utility links rendering to prevent recalculation */
  const utilityLinksElements = useMemo(() => (
    UTILITY_LINKS.map((link) => (
      <span key={link} className="flex items-center">
        <a
          href={`#${link.toLowerCase().replace(/ /g, "-")}`}
          className="hover:underline"
        >
          {link}
        </a>
      </span>
    ))
  ), []);

  return (
    <div className="w-full bg-white">
      <div className="w-full flex justify-between h-10 items-center px-4">
        <div className="hidden sm:flex items-center gap-4 text-xs text-black">
          {utilityLinksElements}
        </div>
        <div className="flex items-center gap-2 text-xs text-black">
          <PhoneIcon className="text-black" />
          <span className="font-medium">{SUPPORT_PHONE}</span>
        </div>
      </div>
    </div>
  );
});

TopUtilityHeader.displayName = "TopUtilityHeader";
