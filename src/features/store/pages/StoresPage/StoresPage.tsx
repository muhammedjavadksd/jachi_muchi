import { memo, useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PromotionHeader, Footer, WhatsAppButton } from "@/components";
import { Container } from "@/shared/components/Container/Container";
import { HEADER_SPACER_HEIGHT } from "@/shared/constants";
import { getStores, findNearestStore } from "@/features/store/api/storeApi";
import type { Store } from "@/features/store/types";
import { getImageUrl } from "@/shared/utils/image";

const ALL = "All";

const PLACEHOLDER_IMG = "https://placehold.co/600x400/f6f6f6/999999?text=Store";

function storeImg(images?: string[]): string {
  return getImageUrl(images?.[0] ?? null, PLACEHOLDER_IMG);
}

export const StoresPage = memo(function StoresPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const serviceFilter = searchParams.get("service");
  const [selectedCity, setSelectedCity] = useState(ALL);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearestStore, setNearestStore] = useState<Store | null>(null);
  const [nearestDistance, setNearestDistance] = useState<number>(0);
  const [locating, setLocating] = useState(false);

  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(allStores.map((s) => s.city).filter(Boolean))).sort();
    return [ALL, ...unique];
  }, [allStores]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getStores()
      .then((data) => {
        if (!mounted) return;
        setAllStores(data || []);
      })
      .catch(() => {
        if (!mounted) return;
        setAllStores([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const handleFindNearest = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const result = await findNearestStore(lat, lng);
        if (result) {
          setNearestStore(result.store);
          setNearestDistance(result.distance);
          if (result.store.city) setSelectedCity(result.store.city);
          setTimeout(() => {
            const el = document.getElementById(`store-${result.store._id}`);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);
        } else {
          toast.error("Could not find nearest store. Try again.");
        }
        setLocating(false);
      },
      () => {
        toast.error("Please allow location access to find nearest store");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleClearNearest = useCallback(() => {
    setNearestStore(null);
    setNearestDistance(0);
  }, []);

  const buttonLabel = useMemo(() => {
    if (locating) return "Detecting location...";
    if (nearestStore) return `Nearest: ${nearestStore.name} (${nearestDistance.toFixed(1)} km)`;
    return "Find Nearest Store";
  }, [locating, nearestStore, nearestDistance]);

  const filteredStores = useMemo(() => {
    let stores = allStores;
    if (selectedCity !== ALL) {
      stores = stores.filter((s) => s.city === selectedCity);
    }
    if (serviceFilter === "free-eye-testing") {
      stores = stores.filter((s) => s.services?.includes("Free Eye Testing"));
    }
    return stores;
  }, [selectedCity, allStores, serviceFilter]);

  return (
    <div className="w-full flex flex-col min-h-screen">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container>
          <div className="py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Our Stores</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFindNearest}
                  disabled={locating}
                  className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all disabled:opacity-60 whitespace-nowrap"
                >
                  {buttonLabel}
                </button>
                {nearestStore && (
                  <button
                    onClick={handleClearNearest}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-all font-bold text-lg"
                    title="Clear nearest store"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCity === city ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {city === ALL ? "All Cities" : city}
                </button>
              ))}
            </div>

            {nearestStore && (
              <div className="mb-6 bg-teal-50 border border-teal-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-40 shrink-0">
                    <img
                    src={storeImg(nearestStore.images)}
                      alt={nearestStore.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <span className="inline-block bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      Nearest Store
                    </span>
                    <h3 className="font-semibold text-gray-900 text-lg">{nearestStore.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{nearestStore.address}</p>
                    <p className="text-sm text-gray-600">{nearestStore.phone}</p>
                    <p className="text-teal-700 font-semibold text-sm mt-2">
                      {nearestDistance.toFixed(1)} km away from you
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${nearestStore.lat},${nearestStore.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-all"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading stores...</div>
            ) : filteredStores.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No stores found in this city.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStores.map((store) => {
                  const isNearest = nearestStore?._id === store._id;
                  return (
                    <div
                      id={`store-${store._id}`}
                      key={store._id}
                      className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
                        isNearest ? "border-teal-500 ring-2 ring-teal-200" : "border-gray-200"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={storeImg(store.images)}
                          alt={store.name}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                        />
                        {isNearest && (
                          <div className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            Nearest Store  {nearestDistance.toFixed(1)} km away
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{store.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{store.address}</p>
                        <p className="text-sm text-gray-600 mb-1">
                          {store.city}{store.state ? `, ${store.state}` : ""}{store.pincode ? ` - ${store.pincode}` : ""}
                        </p>
                        <p className="text-sm text-gray-700 font-medium mt-2">{store.phone}</p>
                        <a
                          href={`https://www.google.com/maps?q=${store.lat},${store.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl text-center hover:bg-teal-700 transition-all"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

StoresPage.displayName = "StoresPage";
