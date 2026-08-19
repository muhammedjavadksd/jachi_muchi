import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/shared/lib/axios";
import { getOffers, getProductOffers, calculateOfferDiscount } from "@/features/offer/services/offerEngine";
import { getImageUrl } from "@/shared/utils/image";
import type { Offer } from "@/features/offer/types";

const COLOR_MAP: Record<string, string> = {
  black: "#000000", blue: "#1e40af", pink: "#ec4899", red: "#dc2626",
  green: "#16a34a", gold: "#d4a017", silver: "#c0c0c0", grey: "#6b7280",
  brown: "#8b4513", transparent: "#f0f0f0", purple: "#7c3aed",
  "rose-gold": "#b76e79", gunmetal: "#2c3539", white: "#ffffff",
};

const OFFER_LABEL: Record<string, (o: Offer) => string> = {
  percentage: (o) => `${o.discountValue}% off`,
  flat: (o) => `₹${o.discountValue} off`,
  bogo: (o) => `Buy ${o.buyQuantity || 1} Get ${o.getQuantity || 1}`,
};

interface DynamicColor {
  colorCode: string;
  image: string;
  name: string;
  size?: string;
  stock?: number;
  _id?: string;
}

interface SafeProduct {
  _id: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  images: string[];
  // rotation360Images: string[]; // [HIDDEN] Commented out — 360° removed; uncomment to restore
  colors: DynamicColor[];
  specs: { label: string; value: string }[];
}

export function useProductDetail() {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [techOpen, setTechOpen] = useState(false);
  const [lensPanelOpen, setLensPanelOpen] = useState(false);
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOffers().then(setOffers).catch(() => {});
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setSelectedColorIndex(0);
    setCurrentImageIndex(0);
  }, [product]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColorIndex]);

  const variants = product?.variants || [];

  const dynamicColors: DynamicColor[] = useMemo(() =>
    variants.length > 0
      ? variants.map((v: any) => ({
          colorCode: COLOR_MAP[v.color?.toLowerCase()] || v.colorCode || "#888888",
          image: v.image ? getImageUrl(v.image) : getImageUrl(product?.images?.[0]),
          name: v.color, size: v.size, stock: v.stock, _id: v._id,
        }))
      : [],
    [variants, product]
  );

  const selectedVariant = useMemo(() =>
    variants.find((v: any) => v.color === dynamicColors[selectedColorIndex]?.name) || variants[0],
    [variants, dynamicColors, selectedColorIndex]
  );

  const dynamicSpecs = useMemo(() => [
    { label: "Brand", value: product?.brand?.name || product?.brand || "N/A" },
    { label: "Category", value: product?.category?.name || product?.category || "N/A" },
    { label: "Shape", value: product?.shape || "N/A" },
    { label: "Frame Type", value: product?.frameType || "N/A" },
    { label: "Frame Color", value: dynamicColors[selectedColorIndex]?.name || "N/A" },
  ], [product, dynamicColors, selectedColorIndex]);

  const safeProduct: SafeProduct = useMemo(() => {
    const baseImages = product?.images?.length
      ? product.images.map((img: string) => getImageUrl(img))
      : ["/placeholder.png"];
    const variantImage = selectedVariant?.image
      ? getImageUrl(selectedVariant.image)
      : null;
    const images = variantImage && !baseImages.includes(variantImage)
      ? [variantImage, ...baseImages]
      : baseImages;
    // [HIDDEN] 360° image transformation — uncomment to restore
    // const rotation360Images = product?.rotation360Images?.length
    //   ? product.rotation360Images.map((img: string) => getImageUrl(img))
    //   : [];
    return {
      _id: product?._id || "",
      brand: product?.brand?.name || product?.brand || "",
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      originalPrice: product?.mrp > product?.price ? product.mrp : 0,
      discount: product?.mrp > product?.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
      rating: product?.rating || 0,
      reviews: product?.reviewCount || 0,
      images,
      // rotation360Images, // [HIDDEN] Commented out — 360° removed; uncomment to restore
      colors: dynamicColors,
      specs: dynamicSpecs,
    };
  }, [product, dynamicColors, dynamicSpecs, selectedVariant]);

  const handleColorClick = useCallback((index: number) => setSelectedColorIndex(index), []);

  const goToNext = useCallback(() => setCurrentImageIndex(p => (p + 1) % safeProduct.images.length), [safeProduct.images.length]);
  const goToPrev = useCallback(() => setCurrentImageIndex(p => (p - 1 + safeProduct.images.length) % safeProduct.images.length), [safeProduct.images.length]);
  const goToImage = useCallback((index: number) => setCurrentImageIndex(index), []);

  const toggleTech = useCallback(() => setTechOpen(prev => !prev), []);
  const openLensPanel = useCallback(() => setLensPanelOpen(true), []);
  const closeLensPanel = useCallback(() => setLensPanelOpen(false), []);

  const getOfferLabel = useCallback((offer: Offer): string => {
    return (OFFER_LABEL[offer.offerType] || ((_o: Offer) => "Special offer"))(offer);
  }, []);

  return {
    id,
    product,
    loading,
    offers,
    safeProduct,
    selectedColorIndex,
    currentImageIndex,
    techOpen,
    lensPanelOpen,
    dynamicColors,
    selectedVariant,
    handleColorClick,
    goToNext,
    goToPrev,
    goToImage,
    toggleTech,
    openLensPanel,
    closeLensPanel,
    getProductOffers,
    calculateOfferDiscount,
    getOfferLabel,
  };
}
