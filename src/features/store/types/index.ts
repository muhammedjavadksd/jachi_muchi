export interface Store {
  _id?: string;
  id?: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  phone: string;
  email?: string;
  timings?: string;
  timing?: string;
  images?: string[];
  services?: string[];
  lat: number;
  lng: number;
  isActive: boolean;
  location?: {
    type: string;
    coordinates: number[];
  };
}
