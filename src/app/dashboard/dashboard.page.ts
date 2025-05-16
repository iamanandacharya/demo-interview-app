import { Component, OnInit } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  IonAvatar,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { AfterViewInit, OnDestroy } from '@angular/core';
import { catchError, concatMap, debounceTime, distinctUntilChanged, filter, from, map, mergeMap, Observable, of, retry, Subscription, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ProductService } from '../providers/product.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AuthService } from '../providers/auth-service.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NetworkService } from '../providers/network.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  searchText: string = '';  // Bind the search text to filter the products
  allProducts: any[] = []; // Full list fetched once
  items: any[] = [];       // Items currently displayed
  batchSize = 15;
  currentIndex = 0;
  private productSub: Subscription | undefined;
  // items: any[] = [];
  constructor(
    private productService: ProductService,
    private iab: InAppBrowser,
    private authService: AuthService,
    private route: Router,
    private navCtrl: NavController,
    private networkService: NetworkService
  ) {

  }
  handleInput(event: Event) {
    const filteredProduct = this.allProducts.filter(product => {
      product.title.toLowerCase().includes(this.searchText.toLowerCase());
    })
    this.items = [];
    this.currentIndex = 0;
    this.allProducts  = filteredProduct;
    this.loadNextBatch();
  }
  // first take full list of data
  // first take 100 data
  // 2nd scroll take 101 to 200
  // 3rd scroll take upto remaining length is 0

  ngOnInit() {
    this.networkService.getNetworkStatus().then((data) => {
     console.log(data) 
    })
    
  }
    ionViewDidEnter() {
       this.generateItems();

    }
    ionViewDidLeave() {
      this.productSub?.unsubscribe();
    }
  openBrowser() {
    const browser = this.iab.create('https://iamanandacharya.github.io/anand.github.io/');
    
    browser.close();  
  }
  // first take full list of data
  // first take 10 data
  // 2nd scroll take 11 to 20
  // 3rd scroll take upto remaining length is 0
  private generateItems() {
    this.productSub = this.productService.getProducts()
      .pipe(
        map((response: any) => response?.products || []),
        catchError(() => of([]))
      )
      .subscribe((products: any[]) => {
        this.allProducts = products;
        console.log('prod' + products.length)  // Store full list
        this.loadNextBatch();  // Load first batch (0-10)
      });
  }
  loadNextBatch(event?: InfiniteScrollCustomEvent) {

    // Uses slice(start, end) to get the next 100 items from allProducts starting from currentIndex.
    const nextBatch = this.allProducts.slice(this.currentIndex, this.currentIndex + this.batchSize); // 0 to 10
    // Moves the starting point forward by 100 for the next scroll.
    this.items = [...this.items, ...nextBatch];
    this.currentIndex += this.batchSize;

    // If the function was called by infinite scroll event, we mark it complete to reset the scroll spinner.
    if (event) {
      event.target.complete();

      // Disable if all items are loaded
      if (this.currentIndex >= this.allProducts.length) {
        event.target.disabled = true;
      }
    }
  }

  // Called automatically by Ionic when scroll reaches bottom.
  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.loadNextBatch(event);
  }

logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('login');
}
gotoProductPage(item: any) {
  // data showing in url
  // this.navCtrl.navigateForward(['/single-product', item])
  
  // data not showing in url
  this.route.navigate(['/single-product'],
     { state: {
      data: item
     } });
}
gotoPosts() {
  this.navCtrl.navigateForward(['/posts'])
}
}
