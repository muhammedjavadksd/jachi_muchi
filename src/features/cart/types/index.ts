export interface CartItemData {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  lens?: {
    name: string;
    price: number;
  };
  lensPrice?: number;
  transition?: {
    transitionId: string;
    name: string;
    color: string;
  } | null;
  transitionPrice?: number;
  totalPrice: number;
  powerType?: string;
}
