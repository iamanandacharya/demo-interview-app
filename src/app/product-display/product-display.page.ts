import { Component, OnInit } from '@angular/core';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}
interface Posts {
  id: number;
  name: string;
  description: string;
  title: string
}
@Component({
  selector: 'app-product-display',
  templateUrl: './product-display.page.html',
  styleUrls: ['./product-display.page.scss'],
  standalone: false
})
export class ProductDisplayPage implements OnInit {
  products: Product[] = [
    { id: 1, name: 'Laptop', description: 'Powerful laptop for work', price: 1200 },
    { id: 2, name: 'Mouse', description: 'Ergonomic wireless mouse', price: 25 },
    { id: 3, name: 'Keyboard', description: 'Mechanical gaming keyboard', price: 75 },
  ];
    posts: Posts[] = [
    { id: 1, name: 'Laptop', description: 'Powerful laptop for work', title: 'posts1' },
    { id: 2, name: 'Mouse', description: 'Ergonomic wireless mouse', title: 'posts2' },
    { id: 3, name: 'Keyboard', description: 'Mechanical gaming keyboard', title: 'posts3' },
  ];

  selectedPosts: Posts | null = null;
  cartPostItems: Posts[] = [];

  selectedProduct: Product | null = null;
  cartItems: Product[] = [];
  constructor() { }

  ngOnInit() {
  }
 handleAddToCart(product: Product) {
    this.cartItems.push(product);
    console.log(`${product.name} added to cart! (Total items: ${this.cartItems.length})`);
    // In a real app, you might update a cart service or state management here
  }
   selectProductDetails(product: Product) {
    this.selectedProduct = product;
    console.log(`Selected product: ${product.name}`);
    // In a real app, you might navigate to a details page or update a modal
  }

  handliAddtoPost(post: Posts) {
    this.cartPostItems.push(post);
    console.log(`${post.name} added to cart! (Total items: ${this.cartPostItems.length})`);
  }
  selectPostDetails(post: Posts) {
    this.selectedPosts = post;
    console.log(`Selected product: ${post.name}`);
    // In a real app, you might navigate to a details page or update a modal
  }
}
