import { memo, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader, AccountSidebar } from "@/components";
import { Container } from "@/shared/components/Container/Container";

const PROMOTION_HEADER_HEIGHT = 140;

export const AccountLayout = memo(function AccountLayout(): JSX.Element {
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white overflow-x-hidden">
      <PromotionHeader />
      <div style={spacerStyle} />
      <main className="flex-1 py-6 md:py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div
              className="flex flex-col lg:flex-row gap-6 lg:gap-8"
              style={{ alignItems: "flex-start" }}
            >
              <AccountSidebar />
              <div className="flex-1 min-w-0">
                <Outlet />
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});
