import { createReducer, on } from '@ngrx/store';
import { ProductState, initialState } from '../product.state';
import * as ProductActions from '../actions/product.actions';


export const productReducer = createReducer(
  initialState,
  // Load Products reducers (unchanged)
  on(ProductActions.loadProducts, (state) => ({ ...state, loading: true, error: null })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    loading: false,
    products: products.reduce((entities, product) => ({ ...entities, [product.id!]: product }), {}),
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Product reducers
  on(ProductActions.createProduct, (state) => ({ ...state, loading: true, error: null })),
  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: { ...state.products, [product.id!]: product },
  })),
  on(ProductActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Product reducers
  on(ProductActions.updateProduct, (state) => ({ ...state, loading: true, error: null })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: { ...state.products, [product.id!]: product },
  })),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Product reducers
  on(ProductActions.deleteProduct, (state) => ({ ...state, loading: true, error: null })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => {
    const { [id]: removedProduct, ...remainingProducts } = state.products;
    return {
      ...state,
      loading: false,
      products: remainingProducts,
      selectedProductId: null, // Clear selected ID after deletion
    };
  }),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Set Selected Product ID reducer
  on(ProductActions.setSelectedProductId, (state, { id }) => ({
    ...state,
    selectedProductId: id,
  }))
);