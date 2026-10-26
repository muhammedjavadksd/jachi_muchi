import { memo, useEffect, useMemo, useState } from "react";
import type { LensBrand } from "@/features/lens/types";
import { getImageUrl } from "@/shared/utils/image";

interface BrandStepProps {
  brands: LensBrand[];
  loading: boolean;
  error: string | null;
  selectedBrand: LensBrand | null;
  onSelect: (brand: LensBrand) => void;
  onBack: () => void;
  onRetry: () => void;
}

const BRAND_SEARCH_THRESHOLD = 6;

function getLensCountLabel(count: number): string {
  return `${count} ${count === 1 ? "lens" : "lenses"}`;
}

interface BrandLogoProps {
  name: string;
  logo?: string;
}

const BrandLogo = memo(function BrandLogo({ name, logo }: BrandLogoProps): JSX.Element {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [logo]);

  if (!logo || failed) {
    return (
      <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl font-semibold text-teal-700">
        {name.trim().charAt(0).toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
      <img
        src={getImageUrl(logo)}
        alt=""
        loading="lazy"
        className="h-full w-full object-contain p-2"
        onError={() => setFailed(true)}
      />
    </span>
  );
});

BrandLogo.displayName = "BrandLogo";

interface BrandCardProps {
  brand: LensBrand;
  selected: boolean;
  onSelect: (brand: LensBrand) => void;
}

const BrandCard = memo(function BrandCard({
  brand,
  selected,
  onSelect,
}: BrandCardProps): JSX.Element {
  const count = brand.lensCount ?? 0;
  const countLabel = getLensCountLabel(count);

  return (
    <button
      type="button"
      onClick={() => onSelect(brand)}
      aria-label={`Select ${brand.name}, ${countLabel}`}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.99] ${
        selected
          ? "border-teal-600 bg-teal-50"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-teal-600 hover:shadow-lg"
      }`}
    >
      <BrandLogo name={brand.name} logo={brand.logo} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-gray-900">{brand.name}</span>
        <span className="mt-1.5 inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
          {countLabel}
        </span>
      </span>
      <svg
        className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-teal-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
});

BrandCard.displayName = "BrandCard";

export const BrandStep = memo(function BrandStep({
  brands,
  loading,
  error,
  selectedBrand,
  onSelect,
  onBack,
  onRetry,
}: BrandStepProps): JSX.Element {
  const [query, setQuery] = useState("");
  const showSearch = !loading && !error && brands.length > BRAND_SEARCH_THRESHOLD;

  const filteredBrands = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return brands;
    return brands.filter((brand) => brand.name.toLowerCase().includes(term));
  }, [brands, query]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading brands">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-md"
          >
            <span className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-xl bg-gray-200" />
            <span className="flex-1 space-y-3">
              <span className="block h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              <span className="block h-5 w-20 animate-pulse rounded-full bg-gray-100" />
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center" role="alert">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.82A2 2 0 004.63 20h14.74a2 2 0 001.74-3.32l-7.4-12.82a2 2 0 00-3.42 0z" />
          </svg>
        </span>
        <p className="text-sm text-gray-600">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl border border-teal-600 px-5 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
        >
          Try again
        </button>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7" />
          </svg>
        </span>
        <p className="text-sm text-gray-500">No brands available for this option</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {showSearch && (
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brands"
            aria-label="Search brands"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
        </div>
      )}

      {filteredBrands.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          No brands match your search.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredBrands.map((brand) => (
            <BrandCard
              key={brand._id}
              brand={brand}
              selected={selectedBrand?._id === brand._id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
});

BrandStep.displayName = "BrandStep";
