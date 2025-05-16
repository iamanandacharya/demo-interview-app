import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../product.state';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectAllProductsArray = createSelector(
  selectProductState,
  (state) => Object.values(state.products) // Convert the object to an array for display
);

export const selectProductsLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductState,
  (state) => state.error
);

export const selectSelectedProductId = createSelector(
  selectProductState,
  (state) => state.selectedProductId
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  selectSelectedProductId,
  (state, selectedId) => (selectedId ? state.products[selectedId] : null)
);