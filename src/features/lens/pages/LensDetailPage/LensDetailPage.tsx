import { memo, useMemo } from "react";
import { Footer, WhatsAppButton } from "@/components";
import { Container, Price } from "@/shared/components";
import { HEADER_SPACER_HEIGHT } from "@/shared/constants";
import { NotFoundPage } from "@/features/account/pages/NotFoundPage/NotFoundPage";
import { LensDetailsAccordion } from "@/features/lens/components/LensDetailsAccordion/LensDetailsAccordion";
import { LensDetailGallery } from "@/features/lens/components/LensDetailGallery/LensDetailGallery";
import { LensDetailSkeleton } from "@/features/lens/components/LensDetailSkeleton/LensDetailSkeleton";
import { LensPurchaseSection } from "@/features/lens/components/LensPurchaseSection/LensPurchaseSection";
import { LensSimilarProducts } from "@/features/lens/components/LensSimilarProducts/LensSimilarProducts";
import { LENS_DETAIL_COPY } from "@/features/lens/constants";
import { useLensDetail } from "@/features/lens/hooks";
import {
  buildLensChips,
  buildLensSpecs,
  getLensId,
} from "@/features/lens/utils/detail";
import { getLensPricing } from "@/features/lens/utils/pricing";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8860b] focus-visible:ring-offset-2";

interface LensDetailErrorProps {
  onRetry: () => void;
}

const LensDetailError = memo(function LensDetailError({
  onRetry,
}: LensDetailErrorProps): JSX.Element {
  const spacerStyle = useMemo(
    () => ({ height: `var(--header-offset, ${HEADER_SPACER_HEIGHT}px)` }),
    []
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div style={spacerStyle} />
      <main className="flex flex-1 items-center justify-center py-16">
        <Container className="max-w-lg text-center">
          <div
            role="alert"
            className="rounded-2xl border border-gray-200 bg-[#fafafa] px-6 py-10"
          >
            <h1 className="text-xl font-semibold text-[#1a1a1a]">
              {LENS_DETAIL_COPY.errorTitle}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {LENS_DETAIL_COPY.errorMessage}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className={`mt-6 rounded-full border border-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white ${FOCUS_RING}`}
            >
              {LENS_DETAIL_COPY.retry}
            </button>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
});

LensDetailError.displayName = "LensDetailError";

export const LensDetailPage = memo(function LensDetailPage(): JSX.Element {
  const { lens, similar, similarLoading, status, retry } = useLensDetail();

  const spacerStyle = useMemo(
    () => ({ height: `var(--header-offset, ${HEADER_SPACER_HEIGHT}px)` }),
    []
  );

  const pricing = useMemo(() => (lens ? getLensPricing(lens) : null), [lens]);
  const chips = useMemo(() => (lens ? buildLensChips(lens) : []), [lens]);
  const specs = useMemo(() => (lens ? buildLensSpecs(lens) : []), [lens]);
  if (status === "loading") return <LensDetailSkeleton />;
  if (status === "not-found") return <NotFoundPage />;
  if (status === "error" || !lens || !pricing) {
    return <LensDetailError onRetry={retry} />;
  }

  const brandName = lens.brand?.name?.trim() ?? "";
  const detailKey = getLensId(lens) ?? lens.name;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pb-52 md:pb-0">
      <div style={spacerStyle} />

      <main className="flex-1 pb-10">
        <Container className="py-6 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-12">
            <div className="min-w-0">
              <LensDetailGallery
                key={`gallery-${detailKey}`}
                image={lens.image}
                name={lens.name}
              />
            </div>

            <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              <header>
                {brandName && (
                  <p className="text-sm text-gray-500">{brandName}</p>
                )}
                <h1 className="mt-1 text-[22px] font-semibold leading-tight text-[#1a1a1a]">
                  {lens.name}
                </h1>
              </header>

              {chips.length > 0 && (
                <ul
                  aria-label="Lens highlights"
                  className="mt-3 flex flex-wrap gap-1.5"
                >
                  {chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full border border-[#e8e8e8] bg-[#f7f7f7] px-2.5 py-1 text-[11px] font-medium text-gray-600"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5">
                <Price
                  value={pricing.currentPrice}
                  originalValue={pricing.originalPrice}
                  discount={pricing.discountPercent}
                  size="3xl"
                />
              </div>

              {/* <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-gray-100 bg-[#fafafa] px-4 py-3">
                <span className="text-sm text-gray-500">
                  {LENS_DETAIL_COPY.delivery}
                </span>
                <span className="text-sm font-medium text-[#1a1a1a]">
                  {deliveryText}
                </span>
              </div> */}

              <LensPurchaseSection key={`power-${detailKey}`} lens={lens} />

              <LensDetailsAccordion
                key={`details-${detailKey}`}
                description={lens.description}
                specs={specs}
              />
            </div>
          </div>

          {(similarLoading || similar.length > 0) && (
            <>
              <div className="my-10 border-t border-gray-200" />
              <LensSimilarProducts lenses={similar} loading={similarLoading} />
            </>
          )}
        </Container>
      </main>

      <Footer />
      <WhatsAppButton className="bottom-52 right-6 md:bottom-6 md:right-6" />
    </div>
  );
});

LensDetailPage.displayName = "LensDetailPage";
