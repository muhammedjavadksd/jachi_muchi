import { memo, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "@/shared/components";
import { getCollections } from "@/features/collections/api/collectionApi";
import { getImageUrl } from "@/shared/utils/image";

const HEADER_SPACER_HEIGHT = 140;
const PLACEHOLDER_IMAGE = "/category/image.png";

export const CollectionsPage = memo(function CollectionsPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollections()
      .then((data) => setCollections(data.filter((c: any) => c.isActive)))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 sm:py-8 lg:py-12">
        <Container className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 sm:gap-2">
              <li><Link to="/" className="hover:text-teal-600 transition-colors">Homepage</Link></li>
              <li aria-hidden>/</li>
              <li className="text-gray-900 font-medium" aria-current="page">Collections</li>
            </ol>
          </nav>

          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight uppercase">
              Collections
            </h1>
            <p className="mt-2 sm:mt-3 text-gray-600 text-xs sm:text-sm lg:text-base max-w-xl mx-auto px-2 sm:px-4">
              Explore our eyewear collections and collaborations. Find the perfect style for every look.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg sm:rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : collections.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No collections available.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
              {collections.map((collection) => (
                <Link
                  key={collection._id}
                  to={`/search?collection=${collection.slug}`}
                  className="group relative block aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-gray-100"
                >
                  <img
                    src={collection.bannerImage ? getImageUrl(collection.bannerImage) : PLACEHOLDER_IMAGE}
                    alt={collection.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4 text-white font-semibold text-xs sm:text-sm lg:text-base drop-shadow-sm leading-tight sm:leading-normal">
                    {collection.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

CollectionsPage.displayName = "CollectionsPage";
