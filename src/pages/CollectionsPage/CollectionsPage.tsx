import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";

const HEADER_SPACER_HEIGHT = 140;

/** Placeholder image for collection tiles when no asset is set */
const PLACEHOLDER_IMAGE = "/category/image.png";

const COLLECTIONS: { name: string; image?: string; link: string }[] = [
  { name: "AIR", link: "/search?collection=air" },
  { name: "ESSENTIAL", link: "/search?collection=essential" },
  { name: "THE ONE", link: "/search?collection=the-one" },
  { name: "Graph Belle", link: "/search?collection=graph-belle" },
  { name: "John Dillinger", link: "/search?collection=john-dillinger" },
  { name: "K.moriyama", link: "/search?collection=kmoriyama" },
  { name: "Junni", link: "/search?collection=junni" },
  { name: "BLACK × BLACK", link: "/search?collection=black" },
  { name: "MOVE", link: "/search?collection=move" },
  { name: "AUR", link: "/search?collection=aur" },
  { name: "PC", link: "/search?collection=pc" },
  { name: "Vuttohru", link: "/search?collection=vuttohru" },
  { name: "Stranger Things", link: "/search?collection=stranger-things" },
  { name: "Harry Potter", link: "/search?collection=harry-potter" },
  { name: "SQUID GAME", link: "/search?collection=squid-game" },
  { name: "Tom & Jerry", link: "/search?collection=tom-jerry" },
  { name: "Pompompurin", link: "/search?collection=pompompurin" },
  { name: "Toy Story", link: "/search?collection=toy-story" },
  { name: "Hello Kitty", link: "/search?collection=hello-kitty" },
  { name: "Kuromi", link: "/search?collection=kuromi" },
  { name: "Demon Slayer", link: "/search?collection=demon-slayer" },
  { name: "Frozen", link: "/search?collection=frozen" },
  { name: "Fluff & Fun", link: "/search?collection=fluff-fun" },
  { name: "HUAWEI Eyewear", link: "/search?collection=huawei" },
  { name: "FREAK STORE", link: "/search?collection=freak-store" },
];

/**
 * Collections (brands) page – grid of collection tiles with image and name overlay
 */
export const CollectionsPage = memo(function CollectionsPage(): JSX.Element {
  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 sm:py-12">
        <Container className="max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-teal-600 transition-colors">
                  Homepage
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-gray-900 font-medium" aria-current="page">
                Collections
              </li>
            </ol>
          </nav>

          {/* Title and intro */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight uppercase">
              Collections
            </h1>
            <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Explore our eyewear collections and collaborations. Find the perfect style for every look.
            </p>
          </div>

          {/* Collections grid – 4 columns, image + text overlay */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {COLLECTIONS.map((collection) => (
              <Link
                key={collection.name}
                to={collection.link}
                className="group relative block aspect-square overflow-hidden rounded-xl bg-gray-100"
              >
                <img
                  src={collection.image || PLACEHOLDER_IMAGE}
                  alt={collection.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Gradient overlay for text readability */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  aria-hidden
                />
                <span className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white font-semibold text-sm sm:text-base drop-shadow-sm">
                  {collection.name}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

CollectionsPage.displayName = "CollectionsPage";
