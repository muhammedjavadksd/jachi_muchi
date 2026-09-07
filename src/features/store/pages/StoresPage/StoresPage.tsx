import { memo, useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Phone, X } from "lucide-react";
import { Footer, WhatsAppButton } from "@/components";
import { Container } from "@/shared/components/Container/Container";
import { HEADER_SPACER_HEIGHT } from "@/shared/constants";
import { getStores, findNearestStore } from "@/features/store/api/storeApi";
import type { Store } from "@/features/store/types";
import { getImageUrl } from "@/shared/utils/image";

const ALL = "All";

const DEFAULT_STORE_HOURS = "10:00 AM – 9:00 PM";

const PLACEHOLDER_IMG = "https://placehold.co/600x400/f6f6f6/999999?text=Store";

function storeImg(images?: string[]): string {
  return getImageUrl(images?.[0] ?? null, PLACEHOLDER_IMG);
}

function storeAddress(store: Store): string {
  return [store.address, store.city, store.state, store.pincode].filter(Boolean).join(", ");
}

function mapsUrl(store: Store): string {
  return `https://www.google.com/maps?q=${store.lat},${store.lng}`;
}

const StoreRow = memo(function StoreRow({ store, index }: { store: Store; index: number }): JSX.Element {
  const photoOnRight = index % 2 === 1;
  const hours = store.timings || store.timing || DEFAULT_STORE_HOURS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] md:gap-10 py-8 md:py-10 border-b border-[#e7e7e7] last:border-b-0">
      <div className={photoOnRight ? "md:order-2" : "md:order-1"}>
        <img
          src={storeImg(store.images)}
          alt={store.name}
          loading="lazy"
          className="w-full h-52 md:w-[260px] md:h-[180px] rounded-2xl object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
        />
      </div>

      <div className={`mt-6 md:mt-0 ${photoOnRight ? "md:order-1" : "md:order-2"}`}>
        <span className="inline-block rounded-full bg-[#e0a638] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {store.city}
        </span>
        <h3 className="mt-4 font-serif text-2xl font-bold text-[#1a2733]">{store.name}</h3>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7683]">Address</p>
            <p className="mt-1.5 leading-relaxed text-[#1a2733]">{storeAddress(store)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7683]">Hours</p>
            <p className="mt-1.5 leading-relaxed text-[#1a2733]">{hours}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={mapsUrl(store)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#137266] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f5f55]"
          >
            <MapPin className="w-4 h-4" />
            Get Directions
          </a>
          {store.phone && (
            <span className="flex items-center gap-2 text-sm text-[#6b7683]">
              <Phone className="w-4 h-4 text-[#137266]" />
              {store.phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

StoreRow.displayName = "StoreRow";

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
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container>
          <div className="py-10 md:py-14">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#1a2733]">
                  Our Stores
                </h1>
                <p className="mt-3 text-base md:text-lg text-[#6b7683]">
                  Find a Jachi Muchi store near you for eye checkups, fittings and repairs.
                </p>
              </div>
              <button
                type="button"
                onClick={handleFindNearest}
                disabled={locating}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#137266] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0f5f55] disabled:opacity-60"
              >
                <MapPin className="w-5 h-5" />
                {buttonLabel}
              </button>
            </div>

            {/* City chips + result count */}
            <div className="flex items-center gap-4">
              <div className="flex-1 overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max">
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setSelectedCity(city)}
                      className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                        selectedCity === city
                          ? "bg-[#137266] border-[#137266] text-white"
                          : "bg-white border-[#e7e7e7] text-[#1a2733] hover:border-[#137266] hover:text-[#137266]"
                      }`}
                    >
                      {city === ALL ? "All Cities" : city}
                    </button>
                  ))}
                </div>
              </div>
              <p className="shrink-0 text-sm font-medium text-[#6b7683]">
                {filteredStores.length} {filteredStores.length === 1 ? "store" : "stores"}
              </p>
            </div>

            {/* Nearest store callout */}
            {nearestStore && (
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#137266]/30 bg-[#137266]/[0.05] px-5 py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-[#137266]" />
                  <div>
                    <p className="font-semibold text-[#1a2733]">{nearestStore.name}</p>
                    <p className="text-sm text-[#6b7683]">
                      Your nearest store &middot; {nearestDistance.toFixed(1)} km away
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={mapsUrl(nearestStore)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#137266] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f5f55]"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </a>
                  <button
                    type="button"
                    onClick={handleClearNearest}
                    aria-label="Clear nearest store"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7683] transition-colors hover:bg-white hover:text-[#1a2733]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Store list */}
            <div className="mt-4">
              {loading ? (
                <p className="py-20 text-center text-[#6b7683]">Loading stores...</p>
              ) : filteredStores.length === 0 ? (
                <p className="py-20 text-center text-[#6b7683]">No stores found in this city.</p>
              ) : (
                filteredStores.map((store, index) => (
                  <StoreRow key={store._id ?? store.id ?? `${store.name}-${index}`} store={store} index={index} />
                ))
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

StoresPage.displayName = "StoresPage";