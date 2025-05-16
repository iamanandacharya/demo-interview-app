import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }
  getProducts(): Observable<any> {
    return this.http.get('https://dummyjson.com/products');
  }
  getProdcutById(id: number): Observable<any> {
    return this.http.get(`https://dummyjson.com/products/${id}`);
  }
  searchProducts(query: string): Observable<any> {
    return this.http.get<any>(`${'https://dummyjson.com/products/search'}?q=${'phone'}`);
  }
  getReciprAndPostData() {
    const recipesData = this.http.get('https://dummyjson.com/recipes');
    const postsData = this.http.get('https://dummyjson.com/posts');

    return forkJoin({recipe: recipesData, posts: postsData});
  } 
  editProduct(id: any) {

  }
}
