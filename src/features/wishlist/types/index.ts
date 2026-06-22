export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  link: string;
  price: number;
}

export interface ApiWishlistItem {
  _id?: string;
  id?: string;
  productId: string;
  name: string;
  image: string;
  link: string;
  price: number;
  addedAt?: string;
}

export interface AddToWishlistRequest {
  productId: string;
  name: string;
  image: string;
  link: string;
  price: number;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  data?: ApiWishlistItem[];
}

export interface WishlistItemResponse {
  success: boolean;
  message: string;
  data?: ApiWishlistItem;
}
