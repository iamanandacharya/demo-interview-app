import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as ProductActions from '../actions/product.actions';
import { Product } from '../product.state';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductEffects {
  private productsApiUrl = 'https://dummyjson.com/products'; // Your API endpoint

  // Load Products Effect (unchanged)
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.http.get<Product[]>(this.productsApiUrl).pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  // Create Product Effect
  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      switchMap(({ product }) =>
        this.http.post<Product>(this.productsApiUrl, product).pipe(
          map((newProduct) => ProductActions.createProductSuccess({ product: newProduct })),
          catchError((error) => of(ProductActions.createProductFailure({ error: error.message })))
        )
      )
    )
  );

  // Update Product Effect
  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      switchMap(({ product }) =>
        this.http.put<Product>(`${this.productsApiUrl}/${product.id}`, product).pipe(
          map((updatedProduct) => ProductActions.updateProductSuccess({ product: updatedProduct })),
          catchError((error) => of(ProductActions.updateProductFailure({ error: error.message })))
        )
      )
    )
  );

  // Delete Product Effect
  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap(({ id }) =>
        this.http.delete(`${this.productsApiUrl}/${id}`).pipe(
          map(() => ProductActions.deleteProductSuccess({ id })),
          catchError((error) => of(ProductActions.deleteProductFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}