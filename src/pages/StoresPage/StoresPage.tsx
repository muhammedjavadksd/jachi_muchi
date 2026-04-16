import { memo, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";
import { HEADER_SPACER_HEIGHT } from "../../lib/constants";

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  timing: string;
  lat: number;
  lng: number;
  services: string[];
  image?: string;
}

const STORES: Store[] = [
  { id: "1", name: "Lenskart - Rajouri Garden", address: "JK Building, Near Metro Pillar, Main Market", city: "Delhi NCR", phone: "+91 9876543210", timing: "10:00 AM - 09:00 PM", lat: 28.6461, lng: 77.1197, services: ["Eye Test", "Frame Trial", "Contact Lenses"] },
  { id: "2", name: "Lenskart - Nehru Place", address: "Building No. 45, Near Metro Station", city: "Delhi NCR", phone: "+91 9876543211", timing: "10:00 AM - 09:00 PM", lat: 28.5541, lng: 77.2532, services: ["Eye Test", "Frame Trial"] },
  { id: "3", name: "Lenskart - Cyber Hub", address: "Tower B, Cyber City, Phase II", city: "Delhi NCR", phone: "+91 9876543212", timing: "10:00 AM - 09:00 PM", lat: 28.4950, lng: 77.0890, services: ["Eye Test", "Frame Trial", "Contact Lenses", "Repair"] },
  { id: "4", name: "Lenskart - Phoenix Mall", address: "Unit No. 208, 2nd Floor, Phoenix Mall", city: "Mumbai", phone: "+91 9876543213", timing: "11:00 AM - 09:00 PM", lat: 19.0760, lng: 72.8777, services: ["Eye Test", "Frame Trial", "Contact Lenses"] },
  { id: "5", name: "Lenskart - High Street Phoenix", address: "Ground Floor, High Street Phoenix", city: "Mumbai", phone: "+91 9876543214", timing: "11:00 AM - 09:00 PM", lat: 19.0170, lng: 72.8676, services: ["Eye Test", "Frame Trial"] },
  { id: "6", name: "Lenskart - Bandra", address: "22nd Road, Above Tanishq, Bandra West", city: "Mumbai", phone: "+91 9876543215", timing: "11:00 AM - 09:00 PM", lat: 19.0540, lng: 72.8407, services: ["Eye Test", "Frame Trial", "Contact Lenses"] },
  { id: "7", name: "Lenskart - ORR Junction", address: "Unit 101, Embassy Tech Village", city: "Bangalore", phone: "+91 9876543216", timing: "10:00 AM - 09:00 PM", lat: 12.9352, lng: 77.6245, services: ["Eye Test", "Frame Trial", "Contact Lenses"] },
  { id: "8", name: "Lenskart - MG Road", address: "No. 104, MG Road, Brigade Road", city: "Bangalore", phone: "+91 9876543217", timing: "10:00 AM - 09:00 PM", lat: 12.9750, lng: 77.6060, services: ["Eye Test", "Frame Trial"] },
  { id: "9", name: "Lenskart - Whitefield", address: "Phoenix Marketcity, Unit 308", city: "Bangalore", phone: "+91 9876543218", timing: "11:00 AM - 09:00 PM", lat: 12.9848, lng: 77.6406, services: ["Eye Test", "Frame Trial", "Contact Lenses"] },
  { id: "10", name: "Lenskart - T Nagar", address: "No. 45, Usman Road, T Nagar", city: "Chennai", phone: "+91 9876543219", timing: "10:00 AM - 09:00 PM", lat: 13.0325, lng: 80.2425, services: ["Eye Test", "Frame Trial"] },
  { id: "11", name: "Lenskart - Anna Nagar", address: "Block AA, Anna Nagar West", city: "Chennai", phone: "+91 9876543220", timing: "10:00 AM - 09:00 PM", lat: 13.0835, lng: 80.2095, services: ["Eye Test", "Frame Trial", "Contact Lenses"] },
  { id: "12", name: "Lenskart - Jubilee Hills", address: "Road No. 36, Jubilee Hills", city: "Hyderabad", phone: "+91 9876543221", timing: "10:00 AM - 09:00 PM", lat: 17.4125, lng: 78.4090, services: ["Eye Test", "Frame Trial", "Contact Lenses"] },
  { id: "13", name: "Lenskart - Gachibowli", address: "Unit 205, Gachibowli Circle", city: "Hyderabad", phone: "+91 9876543222", timing: "10:00 AM - 09:00 PM", lat: 17.4400, lng: 78.3500, services: ["Eye Test", "Frame Trial"] },
  { id: "14", name: "Lenskart - Kalyan Nagar", address: "No. 201, Kalyan Nagar", city: "Bangalore", phone: "+91 9876543223", timing: "10:00 AM - 09:00 PM", lat: 13.0235, lng: 77.6395, services: ["Eye Test", "Frame Trial", "Repair"] },
  { id: "15", name: "Lenskart - Andheri West", address: "Shop No. 6, Juhu Lane, Andheri West", city: "Mumbai", phone: "+91 9876543224", timing: "11:00 AM - 09:00 PM", lat: 19.1130, lng: 72.8680, services: ["Eye Test", "Frame Trial", "Contact Lenses"] },
];

const CITIES = ["All", "Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Hyderabad"];

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

export const StoresPage = memo(function StoresPage(): JSX.Element {
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const spacerStyle = useMemo(() => ({ height: `${HEADER_SPACER_HEIGHT}px` }), []);

  const filteredStores = useMemo(() => {
    if (selectedCity === "All") return STORES;
    return STORES.filter(s => s.city === selectedCity);
  }, [selectedCity]);

  return (
    <div className="w-full flex flex-col min-h-screen">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1">
        <Container>
          <div className="py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Stores</h1>
            <p className="text-gray-600 mb-6">Visit us at any of our 100+ stores across India for eye tests and frame trials</p>

            {/* City Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCity === city ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {city === "All" ? "All Cities" : city}
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
              <PlaceholderMap lat={selectedStore.lat} lng={selectedStore.lng} storeName={selectedStore.name} />
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
                {filteredStores.map(store => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedStore?.id === store.id ? "border-teal-600 bg-teal-50" : "border-gray-200 bg-white hover:border-teal-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{store.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{store.address}</p>
                        <p className="text-sm text-gray-500">{store.city}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {store.services.map(service => (
                            <span key={service} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{service}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 font-medium">{store.phone}</p>
                        <p className="text-xs text-gray-500 mt-1">{store.timing}</p>
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
                        <Link
                          to="/stores"
                          className="flex-1 py-2 px-4 border border-teal-600 text-teal-600 text-sm font-medium rounded-lg text-center hover:bg-teal-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Get Directions
                        </Link>
                      </div>
                    </div>
                  </button>
                ))}
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