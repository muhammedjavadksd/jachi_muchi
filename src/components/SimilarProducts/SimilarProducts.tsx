import { memo, useMemo, useEffect, useState } from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import { Grid } from "../Grid/Grid";
import { getSimilarProducts } from "../../api/product";
import { getImageUrl } from "../../lib/image";

interface SimilarProductsProps {
  productId?: string;
}

const DUMMY_ITEMS = [
  { id: "1", name: "Retro Square Frame", price: 2999, oldPrice: 5999, image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop" },
  { id: "2", name: "Classic Aviator", price: 3499, oldPrice: 6999, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop" },
  { id: "3", name: "Modern Round Glasses", price: 2499, oldPrice: 4999, image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=300&fit=crop" },
  { id: "4", name: "Elegant Cat Eye", price: 3999, oldPrice: 7999, image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=300&fit=crop" },
];

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
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.slice(0, 4).map((p: any) => ({
        images: p.images?.length ? p.images.map((img: string) => getImageUrl(img)) : ["https://placehold.co/400x300?text=Product"],
        name: p.name || "",
        price: p.price || 0,
        originalPrice: p.mrp > p.price ? p.mrp : undefined,
        discount: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : undefined,
        rating: p.rating || 0,
        reviews: p.reviewCount || 0,
        link: `/product/${p._id}`,
      }));
    }

    return DUMMY_ITEMS.map((item) => ({
      images: [item.image],
      name: item.name,
      price: item.price,
      originalPrice: item.oldPrice,
      link: `/product/${item.id}`,
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
