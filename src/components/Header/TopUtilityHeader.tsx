import { memo, useMemo } from "react";
import { Container } from "../Container/Container";
import { PhoneIcon } from "../icons";
import { UTILITY_LINKS, SUPPORT_PHONE } from "../../lib/constants";

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
      <Container className="flex justify-between h-10 items-center">
        <div className="flex items-center gap-4 text-xs text-black">
          {utilityLinksElements}
        </div>
        <div className="flex items-center gap-2 text-xs text-black">
          <PhoneIcon className="text-black" />
          <span className="font-medium">{SUPPORT_PHONE}</span>
        </div>
      </Container>
    </div>
  );
});

TopUtilityHeader.displayName = "TopUtilityHeader";
