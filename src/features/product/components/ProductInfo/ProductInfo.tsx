import { memo, useState, useMemo } from "react";
import type { ProductDetailData } from "@/features/product/types";

interface ProductInfoProps {
  product: ProductDetailData;
  onSelectLens: () => void;
}

export const ProductInfo = memo(function ProductInfo({
  product,
  onSelectLens,
}: ProductInfoProps): JSX.Element {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : null
  );
  const [techOpen, setTechOpen] = useState(false);

  const colorList = useMemo(() => product.colors || [], [product.colors]);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {product.rating && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-700 text-white text-xs font-bold rounded">
              {product.rating}
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
          {product.ratingCount && (
            <span className="text-gray-500 text-xs">{product.ratingCount} Reviews</span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
        {product.subtitle && (
          <p className="text-gray-500 text-sm mt-0.5">{product.subtitle}</p>
        )}
      </div>

      {product.description && (
        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{product.price}</span>
        {product.oldPrice && product.oldPrice > product.price && (
          <>
            <span className="text-base text-gray-400 line-through">₹{product.oldPrice}</span>
            <span className="text-sm font-semibold text-green-600">
              {product.discount || Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% off
            </span>
          </>
        )}
      </div>

      {colorList.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Color: <span className="text-gray-900">{selectedColor}</span>
          </p>
          <div className="flex gap-2.5">
            {colorList.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === c.name
                    ? "border-teal-600 ring-2 ring-teal-200 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: c.hex || "#ccc" }}
                title={c.name}
                aria-label={c.name}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onSelectLens}
        className="w-full py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-[0.985] text-base"
      >
        SELECT LENS
      </button>

      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setTechOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900 text-sm">Technical Information</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${techOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {techOpen && (
          <div className="px-5 pb-4 text-sm text-gray-600 space-y-1 animate-[fadeIn_0.2s_ease-out]">
            {product.brand && <p>Brand: {product.brand}</p>}
            {product.frameType && <p>Frame Type: {product.frameType}</p>}
            {product.shape && <p>Shape: {product.shape}</p>}
            {product.inStock !== undefined && (
              <p className={product.inStock ? "text-green-600" : "text-red-500"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ProductInfo.displayName = "ProductInfo";
