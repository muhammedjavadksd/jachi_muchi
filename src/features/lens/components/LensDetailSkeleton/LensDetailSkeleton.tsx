import { memo, useMemo } from "react";
import { Footer, WhatsAppButton } from "@/components";
import { Container } from "@/shared/components";
import { HEADER_SPACER_HEIGHT } from "@/shared/constants";

export const LensDetailSkeleton = memo(function LensDetailSkeleton(): JSX.Element {
  const spacerStyle = useMemo(
    () => ({ height: `var(--header-offset, ${HEADER_SPACER_HEIGHT}px)` }),
    []
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div style={spacerStyle} />
      <main className="flex-1">
        <Container className="py-6 md:py-10">
          <div
            className="grid gap-8 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-12"
            aria-busy="true"
            aria-label="Loading lens details"
          >
            <div>
              <div className="aspect-square w-full animate-pulse rounded-2xl bg-[#f6f6f6] sm:aspect-[4/3] lg:max-h-[620px]" />
              <div className="mt-4 flex justify-center gap-3">
                <div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
                <div className="h-9 w-32 animate-pulse rounded-full bg-gray-100" />
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-7 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 flex gap-2">
                <div className="h-7 w-20 animate-pulse rounded-full bg-gray-100" />
                <div className="h-7 w-24 animate-pulse rounded-full bg-gray-100" />
                <div className="h-7 w-16 animate-pulse rounded-full bg-gray-100" />
              </div>
              <div className="mt-6 h-10 w-44 animate-pulse rounded bg-gray-200" />
              <div className="mt-5 h-12 w-full animate-pulse rounded-xl bg-gray-100" />
              <div className="mt-6 h-36 w-full animate-pulse rounded-2xl bg-[#f6f6f6]" />
              <div className="mt-6 h-14 w-full animate-pulse rounded-xl bg-gray-100" />
              <div className="mt-6 h-14 w-full animate-pulse bg-gray-200" />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

LensDetailSkeleton.displayName = "LensDetailSkeleton";
