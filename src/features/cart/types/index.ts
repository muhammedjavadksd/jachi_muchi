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
  totalPrice: number;
  powerType?: string;
}
