import { memo, useMemo, useEffect, useState } from "react";
import { ProductCard } from "@/features/product/components/ProductCard/ProductCard";
import { Grid } from "@/shared/components/Grid/Grid";
import { getSimilarProducts } from "@/features/product/api/productApi";
import { getImageUrl } from "@/shared/utils/image";

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

    return apiProducts
      .filter((p: any) => p.images?.some((img: string) => img && img.trim() !== ""))
      .slice(0, 4).map((p: any) => ({
      images: p.images?.length ? p.images.map((img: string) => getImageUrl(img)) : ["https://placehold.co/400x300?text=Product"],
      name: p.name || "",
      price: p.price || 0,
      originalPrice: p.mrp > p.price ? p.mrp : undefined,
      discount: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : undefined,
      rating: p.rating || 0,
      reviews: p.reviewCount || 0,
      link: `/product/${p._id}`,
    }));
  }, [apiProducts]);

  if (items.length === 0) return <></>;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Similar Products</h2>
      <Grid columns={4} gap={6}>
        {items.map((item, i) => (
          <ProductCard
            key={item.link || i}
            images={item.images}
            name={item.name}
            price={item.price}
            originalPrice={item.originalPrice}
            discount={item.discount}
            rating={item.rating}
            reviews={item.reviews}
            link={item.link}
          />
        ))}
      </Grid>
    </section>
  );
});

SimilarProducts.displayName = "SimilarProducts";