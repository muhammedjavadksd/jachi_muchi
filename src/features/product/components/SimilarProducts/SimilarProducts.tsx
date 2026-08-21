import { memo, useMemo, useEffect, useState } from "react";
import { ProductCard } from "@/features/product/components/ProductCard/ProductCard";
import { Grid } from "@/shared/components/Grid/Grid";
import { getSimilarProducts } from "@/features/product/api/productApi";
import { getImageUrl } from "@/shared/utils/image";
import type { ColorVariant } from "@/shared/types";

interface SimilarProductsProps {
  productId?: string;
}

export const SimilarProducts = memo(function SimilarProducts({
  productId,
}: SimilarProductsProps): JSX.Element {
  const [apiProducts, setApiProducts] = useState<any[] | null>(null);

  useEffect(() => {
    if (!productId) {
      setApiProducts(null);
      return;
    }
    getSimilarProducts(productId)
      .then((list) => setApiProducts(Array.isArray(list) ? list : []))
      .catch(() => setApiProducts(null));
  }, [productId]);

  const items = useMemo(() => {
    if (!apiProducts || apiProducts.length === 0) return [];

    const colorMap: Record<string, string> = {
      black: "#000000", blue: "#1e40af", pink: "#ec4899", red: "#dc2626",
      green: "#16a34a", gold: "#d4a017", silver: "#c0c0c0", grey: "#6b7280",
      brown: "#8b4513", transparent: "#f0f0f0", purple: "#7c3aed",
      "rose-gold": "#b76e79", gunmetal: "#2c3539", white: "#ffffff",
    };

    return apiProducts
      .filter((p: any) => p.images?.some((img: string) => img && img.trim() !== ""))
      .slice(0, 4).map((p: any) => {
        const rawVariants = p.variants || p.colors || [];
        const colors: ColorVariant[] = rawVariants.map((v: any) => ({
          colorCode: colorMap[v.color?.toLowerCase()] || v.colorCode || v.hex || v.image || "#888888",
          image: getImageUrl(v.image || p.images?.[0]),
        }));

        const mrp = p.mrp || p.originalPrice || p.compareAtPrice || 0;
        const productPrice = p.price || 0;
        const discountPct = mrp > productPrice ? Math.round(((mrp - productPrice) / mrp) * 100) : 0;

        return {
          images: p.images?.length ? p.images.map((img: string) => getImageUrl(img)) : ["https://placehold.co/400x300?text=Product"],
          name: p.name || "",
          description: p.description || undefined,
          price: productPrice,
          originalPrice: mrp > productPrice ? mrp : undefined,
          discount: discountPct > 0 ? discountPct : undefined,
          rating: p.rating || undefined,
          reviews: p.reviewCount || p.reviews || undefined,
          colors: colors.length > 0 ? colors : undefined,
          link: `/product/${p._id}`,
        };
      });
  }, [apiProducts]);

  if (items.length === 0) return <></>;

  return (
    <section id="similar">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Similar Products</h2>
      <Grid columns={4} gap={6}>
        {items.map((item, i) => (
          <ProductCard
            key={item.link || i}
            images={item.images}
            name={item.name}
            description={item.description}
            price={item.price}
            originalPrice={item.originalPrice}
            discount={item.discount}
            rating={item.rating}
            reviews={item.reviews}
            colors={item.colors}
            link={item.link}
            showViewButton
          />
        ))}
      </Grid>
    </section>
  );
});

SimilarProducts.displayName = "SimilarProducts";