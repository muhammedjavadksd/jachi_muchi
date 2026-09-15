import { memo, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Footer, WhatsAppButton, AccountSidebar } from "@/app/layouts";
import { Container } from "@/shared/components/Container/Container";

const HEADER_SPACER_HEIGHT = 132;

export const AccountLayout = memo(function AccountLayout(): JSX.Element {
  const spacerStyle = useMemo(() => ({
    height: `${HEADER_SPACER_HEIGHT}px`
  }), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white overflow-x-hidden">
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
