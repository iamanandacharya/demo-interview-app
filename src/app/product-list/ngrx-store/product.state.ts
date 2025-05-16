export interface Product {
  id?: number; // ID is optional for creation
  name: string;
  price: number;
  imageUrl: string;
}

export interface ProductState {
  products: { [id: number]: Product }; // Using an object for efficient lookups by ID
  loading: boolean;
  error: string | null;
  selectedProductId: number | null; // For update/delete operations
}

export const initialState: ProductState = {
  products: {},
  loading: false,
  error: null,
  selectedProductId: null,
};