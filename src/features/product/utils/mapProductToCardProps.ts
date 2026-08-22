import { getImageUrl } from "@/shared/utils/image";
import type { ProductCardProps } from "@/features/product/types";
import type { OfferBadge } from "@/features/offer/types";

const COLOR_SWATCHES: Record<string, string> = {
  black: "#000000",
  blue: "#1e40af",
  pink: "#ec4899",
  red: "#dc2626",
  green: "#16a34a",
  gold: "#d4a017",
  silver: "#c0c0c0",
  grey: "#6b7280",
  brown: "#8b4513",
  transparent: "#f0f0f0",
  purple: "#7c3aed",
  "rose-gold": "#b76e79",
  gunmetal: "#2c3539",
  white: "#ffffff",
};

export type ProductCardViewModel = ProductCardProps & {
  offerLabel?: string;
  offerBadgeColor?: string;
};

type OfferBadgeResolver = (productId: string, price: number) => OfferBadge | null;

export function mapProductToCardProps(
  product: Record<string, any>,
  getOfferBadge: OfferBadgeResolver
): ProductCardViewModel {
  const colors = (product.variants || []).map((variant: any) => ({
    colorCode:
      COLOR_SWATCHES[variant.color?.toLowerCase()] || variant.image || "#888888",
    /** Prefer the variant's own first gallery image; fall back to its
     *  single image field, then to the product's default image. */
    image: getImageUrl(variant.images?.[0] || variant.image || product.images?.[0]),
    name: variant.color,
  }));

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img: string) => getImageUrl(img))
      : ["/placeholder.png"];

  const discount = (() => {
    const d =
      product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;
    return d > 0 ? d : undefined;
  })();

  const offerBadge = getOfferBadge(product._id, product.price);

  return {
    images,
    name: product.name,
    description: product.description || "",
    price: product.price,
    originalPrice: product.mrp > product.price ? product.mrp : undefined,
    discount,
    rating: product.rating ?? product.ratingAverage ?? undefined,
    reviews: product.reviewCount ?? product.ratingCount ?? undefined,
    colors: colors.length > 0 ? colors : undefined,
    link: `/product/${product._id}`,
    offerLabel: offerBadge?.label,
    offerBadgeColor: offerBadge?.color,
  };
}
