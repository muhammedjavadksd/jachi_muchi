// src/data/store.data.ts

export interface Store {
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

export const stores: Store[] = [
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

