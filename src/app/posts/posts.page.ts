import { Component, OnInit } from '@angular/core';
import {
  InfiniteScrollCustomEvent
} from '@ionic/angular/standalone';
import { catchError, map, of, Subscription } from 'rxjs';
import { NavController, ToastController } from '@ionic/angular';
import { NetworkService } from '../providers/network.service';
import { PostsService } from '../providers/posts.service';
import { Network } from '@capacitor/network';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: false
})
export class PostsPage implements OnInit {
  searchText: string = '';  // Bind the search text to filter the products
  allPosts: any[] = []; // Full list fetched once
  items: any[] = [];       // Items currently displayed
  batchSize = 15;
  currentIndex = 0;
  private postsSub: Subscription | undefined;
  isOnline: boolean = true;
  constructor(
    private postsService: PostsService,
    private navCtrl: NavController,
    private storage: Storage,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  // when to use ionic life cycle
  // first take network status then call api so call networkStatus in ionViewWillEnter then call api in ionViewDidEnter
  ionViewWillEnter() {
    // check and get network status
    this.setupNetworkListener();
  }
  ionViewDidEnter() {
    this.generateItems();
  }
  async generateItems() {
    console.log(this.isOnline)
    if (this.isOnline) {
      this.postsSub = await this.postsService.getPosts()
        .pipe(
          map((response: any) => response?.posts || []),
          catchError(() => of([]))
        )
        .subscribe((posts: any[]) => {
          this.allPosts = posts;
          console.log('prod' + posts)  // Store full list
          this.storage.set('posts', posts);
          this.loadNextBatch();  // Load first batch (0-10)
        });
    } else {
      const getData = await this.storage.get('posts').then((data) => {
        this.items = data;
        console.log('data is  present' + this.items);
      }).catch((error) => {
        console.log('data is not present' + error);
      }).finally(() => {
        console.log('data is coming from offline if its network is offline');
      })

    }
  }

  loadNextBatch(event?: InfiniteScrollCustomEvent) {
    // Uses slice(start, end) to get the next 100 items from allProducts starting from currentIndex.
    const nextBatch = this.allPosts.slice(this.currentIndex, this.currentIndex + this.batchSize); // 0 to 10
    // Moves the starting point forward by 100 for the next scroll.
    this.items = [...this.items, ...nextBatch];
    // this.storage.set('posts', this.items);
    this.currentIndex += this.batchSize;

    // If the function was called by infinite scroll event, we mark it complete to reset the scroll spinner.
    if (event) {
      event.target.complete();

      // Disable if all items are loaded
      if (this.currentIndex >= this.allPosts.length) {
        event.target.disabled = true;
      }
    }
  }
  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.loadNextBatch(event);
  }
  backPage() {
    this.navCtrl.pop();
  }

  async setupNetworkListener() {
    const status = await Network.getStatus();
    this.isOnline = status.connected;
    console.log('isOnline' + JSON.stringify(status));
    await Network.addListener('networkStatusChange', (status) => {
      this.isOnline = status.connected;
      this.openToast('Network status changed:');
      console.log('Network status changed:', this.isOnline);
    });
  }
  async openToast(msg: string) {
    const toast = await this.toastController.create({
      header: 'Header',
      message: msg,
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
    });
    toast.present();
  }
  gotoProdList() {
    this.navCtrl.navigateForward(['/product-list'])
  }

}
