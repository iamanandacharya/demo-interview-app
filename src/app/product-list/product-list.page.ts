import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../product-list/ngrx-store/product.state';
import * as ProductActions from '../product-list/ngrx-store/actions/product.actions';
import * as ProductSelectors from '../product-list/ngrx-store/selectors/product.selectors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: false
})
export class ProductListPage implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedProduct$: Observable<Product | null>;
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  constructor(
    private navCtrl: NavController,
    private store: Store, private fb: FormBuilder
  ) { 
       this.products$ = this.store.select(ProductSelectors.selectAllProductsArray);
    this.loading$ = this.store.select(ProductSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductSelectors.selectProductsError);
    this.selectedProduct$ = this.store.select(ProductSelectors.selectSelectedProduct);

    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
    });

    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
    });

    // Pre-fill the edit form when a product is selected
    this.selectedProduct$.subscribe(product => {
      if (product) {
        this.editProductForm.patchValue(product);
      } else {
        this.editProductForm.reset();
      }
    });
  }

  ngOnInit() {
    this.loadProducts();
  }
    loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }
    createProduct(): void {
      console.log('asdad')
    if (this.addProductForm.valid) {
      this.store.dispatch(ProductActions.createProduct({ product: this.addProductForm.value }));
      this.addProductForm.reset();
    }
  }
    selectProduct(id: any): void {
    this.store.dispatch(ProductActions.setSelectedProductId({ id }));
  }
    updateProduct(id: number | undefined): void {
    if (this.editProductForm.valid && id !== undefined) {
      this.store.dispatch(ProductActions.updateProduct({ product: { id, ...this.editProductForm.value } }));
      this.clearSelectedProduct();
    }
  }
    deleteProduct(id: any): void {
    this.store.dispatch(ProductActions.deleteProduct({ id }));
  }
   clearSelectedProduct(): void {
    this.store.dispatch(ProductActions.setSelectedProductId({ id: null }));
  }
backPage() {
  this.navCtrl.pop()
}
}
