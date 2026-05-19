import { memo, useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";
import { HEADER_SPACER_HEIGHT } from "../../lib/constants";
import { getStores } from "@/api/store";
import type { Store } from "@/types";


const PlaceholderMap = ({ lat, lng, storeName }: { lat: number; lng: number; storeName: string }) => (
  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
    <div className="text-center p-4">
      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11v3" />
      </svg>
      <p className="text-sm text-gray-500">{storeName}</p>
      <p className="text-xs text-gray-400">Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</p>
    </div>
  </div>
);

const ALL = "All";

export const StoresPage = memo(function StoresPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const serviceFilter = searchParams.get("service");
  const [selectedCity, setSelectedCity] = useState(ALL);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  const cities = useMemo(() => {
    let stores = allStores.filter((s) => s.isActive);
    if (serviceFilter === "free-eye-testing") {
      stores = stores.filter((s) => s.services?.includes("Free Eye Testing"));
    }
    const unique = Array.from(new Set(stores.map((s) => s.city).filter(Boolean))).sort();
    return [ALL, ...unique];
  }, [allStores, serviceFilter]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getStores()
      .then((data) => {
        if (!mounted) return;
        setAllStores((data || []).filter((s) => s.isActive));
      })
      .catch(() => {
        if (!mounted) return;
        setAllStores([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Stores</h1>
            {/* <p className="text-gray-600 mb-6">Visit us at any of our 100+ stores across India for eye tests and frame trials</p> */}

            {/* City Filter */}
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
          </div>
        </Container>

        {/* Map & Store List Section */}
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Map */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[calc(100vh-280px)] lg:sticky lg:top-[140px] bg-gray-100">
            {selectedStore ? (
              <PlaceholderMap lat={selectedStore.lat ?? selectedStore.location?.lat ?? 0} lng={selectedStore.lng ?? selectedStore.location?.lng ?? 0} storeName={selectedStore.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center p-6">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11v3" />
                  </svg>
                  <p className="text-gray-500">Select a store from the list to view on map</p>
                  <p className="text-sm text-gray-400 mt-2">Google Maps integration available</p>
                </div>
              </div>
            )}
          </div>

          {/* Store List */}
          <div className="w-full lg:w-1/2 lg:pl-6 pb-8">
            <Container>
              <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading stores...</div>
                    ) : (
                      filteredStores.map((store: Store) => (
                        <button
                          key={store._id}
                          onClick={() => setSelectedStore(store)}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${
                            selectedStore?._id === store._id ? "border-teal-600 bg-teal-50" : "border-gray-200 bg-white hover:border-teal-400 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{store.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">{store.address}</p>
                              <p className="text-sm text-gray-500">{store.city}</p>
                          
                              <div className="flex flex-wrap gap-2 mt-2">
                                {store.services?.map((service: string) => (
                                  <span key={service} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{service}</span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-900 font-medium">{store.phone}</p>
                              <p className="text-xs text-gray-500 mt-1">{store.timings || store.timing}</p>
                            </div>
                          </div>

                          {/* Book Slot Button */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex gap-2">
                              <Link
                                to="/stores"
                                className="flex-1 py-2 px-4 bg-teal-600 text-white text-sm font-medium rounded-lg text-center hover:bg-teal-700"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Book Slot
                              </Link>
                              <a
                                href={`https://www.google.com/maps?q=${store.lat},${store.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 px-4 border border-teal-600 text-teal-600 text-sm font-medium rounded-lg text-center hover:bg-teal-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Get Directions
                              </a>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
            </Container>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

StoresPage.displayName = "StoresPage";