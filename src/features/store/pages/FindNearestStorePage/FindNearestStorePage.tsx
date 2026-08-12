import { memo, useMemo, useState, useCallback } from "react";
import { PromotionHeader, Footer, WhatsAppButton } from "@/components";
import { Container } from "@/shared/components/Container/Container";
import { HEADER_SPACER_HEIGHT } from "@/shared/constants";
import { getStores, findNearestStore } from "@/features/store/api/storeApi";
import type { Store } from "@/features/store/types";

type LocationStatus = "idle" | "loading" | "denied" | "error" | "success" | "empty";

const toRad = (deg: number): number => (deg * Math.PI) / 180;

const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const FindNearestStorePage = memo(function FindNearestStorePage(): JSX.Element {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [nearestStore, setNearestStore] = useState<Store | null>(null);
  const [userLat, setUserLat] = useState<number>(0);
  const [userLng, setUserLng] = useState<number>(0);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [distance, setDistance] = useState<number>(0);

  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  const handleFindNearest = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        const result = await findNearestStore(lat, lng);
        if (result) {
          const dist = getDistance(lat, lng, result.store.lat, result.store.lng);
          setDistance(dist);
          setNearestStore(result.store);
          setStatus("success");
        } else {
          setStatus("empty");
        }
        const all = await getStores();
        const active = all.filter((s) => s.isActive);
        setAllStores(active);
      },
      (err) => {
        if (err.code === 1) {
          setStatus("denied");
        } else {
          setStatus("error");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const sortedStores = useMemo(() => {
    if (userLat === 0 && userLng === 0) return allStores;
    return [...allStores].sort((a, b) => {
      const da = getDistance(userLat, userLng, a.lat, a.lng);
      const db = getDistance(userLat, userLng, b.lat, b.lng);
      return da - db;
    });
  }, [allStores, userLat, userLng]);

  return (
    <div className="w-full flex flex-col min-h-screen">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container>
          <div className="py-8 md:py-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Find Your Nearest Store
              </h1>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Click the button below to detect your location and find the closest store near you
              </p>
            </div>

            {status === "idle" && (
              <div className="text-center">
                <button
                  onClick={handleFindNearest}
                  className="px-10 py-4 bg-teal-600 text-white font-semibold rounded-2xl text-lg hover:bg-teal-700 transition-all active:scale-[0.985]"
                >
                  Find Nearest Store
                </button>
              </div>
            )}

            {status === "loading" && (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Detecting your location...</p>
              </div>
            )}

            {(status === "denied" || status === "error") && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                  <p className="text-red-700 font-medium mb-2">Location access denied</p>
                  <p className="text-red-600 text-sm mb-4">
                    {status === "denied"
                      ? "Please enable location permission in your browser and try again."
                      : "Could not detect your location. Please try again."}
                  </p>
                  <button
                    onClick={handleFindNearest}
                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {status === "empty" && (
              <div className="text-center py-12">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                  <p className="text-gray-700 font-medium">No stores available near you</p>
                </div>
              </div>
            )}

            {status === "success" && nearestStore && (
              <div className="max-w-lg mx-auto mb-12">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  {nearestStore.images && nearestStore.images.length > 0 && (
                    <img
                      src={nearestStore.images[0]}
                      alt={nearestStore.name}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{nearestStore.name}</h2>
                    <p className="text-gray-600 text-sm mb-1">{nearestStore.address}</p>
                    <p className="text-gray-600 text-sm mb-3">{nearestStore.city}</p>
                    {nearestStore.phone && (
                      <p className="text-gray-600 text-sm mb-3">{nearestStore.phone}</p>
                    )}
                    <p className="text-teal-600 font-semibold text-sm mb-4">
                      {distance.toFixed(1)} km away from you
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${nearestStore.lat},${nearestStore.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full py-3 bg-teal-600 text-white font-semibold rounded-xl text-center hover:bg-teal-700 transition-all"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            )}

            {(status === "success" || status === "empty" || status === "error" || status === "denied") && (
              <div className="border-t border-gray-200 pt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Our Stores</h2>
                {sortedStores.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No stores available</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedStores.map((store) => {
                      const dist =
                        userLat !== 0 || userLng !== 0
                          ? getDistance(userLat, userLng, store.lat, store.lng)
                          : null;
                      return (
                        <div
                          key={store._id}
                          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                        >
                          <h3 className="font-semibold text-gray-900 mb-1">{store.name}</h3>
                          <p className="text-sm text-gray-500 mb-1">{store.address}, {store.city}</p>
                          {dist !== null && (
                            <p className="text-xs text-teal-600 font-medium mb-2">
                              {dist.toFixed(1)} km away
                            </p>
                          )}
                          {store.phone && (
                            <p className="text-sm text-gray-500">{store.phone}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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

FindNearestStorePage.displayName = "FindNearestStorePage";
