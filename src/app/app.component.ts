import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit{
    public appPages = [
    {
      title: 'Notifications',
      url: '/notifications',
      icon: 'calendar',
    },
    {
      title: 'Posts',
      url: '/posts',
      icon: 'card',
    },
    {
      title: 'Barcode',
      url: '/barcode-scanner',
      icon: 'camera',
    },
    {
      title: 'product-display',
      url: '/product-display',
      icon: 'camera',
    }
  ];
  public selectedIndex = 0;

  constructor(
    private storage: Storage,
    public router: Router,

  ) {}
  ngOnInit(): void {
    this.storage.create();
  }
  callMenuMethod(selectedIndex: number) {
    console.log('selectedIndex ' + selectedIndex);
    if (selectedIndex === 5) {
      console.log('logout');
      const x = Math.floor((Math.random() * 4) + 1);

      const navigationExtras: NavigationExtras = {
        state: {
          cardId: Math.floor(Math.random() * 4 + 1),
        },
      };
      this.router.navigate(['/swipe-card'], navigationExtras);

      this.storage.set('random-card', x);
    }
    if (selectedIndex === 6) {
      console.log('logout');
      const x = Math.floor((Math.random() * 4) + 1);

      const navigationExtras: NavigationExtras = {
        state: {
          cardId: Math.floor(Math.random() * 4 + 1),
        },
      };
      this.router.navigate(['/demo-page'], navigationExtras);

      this.storage.set('random-card', x);
    }
  }
    whenOpenMenu() {}
}
