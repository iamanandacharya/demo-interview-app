import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.page.html',
  styleUrls: ['./single-product.page.scss'],
  standalone: false
})
export class SingleProductPage implements OnInit {

  productData: any;
  constructor(private route: ActivatedRoute, private navCtrl: NavController
    , private router: Router
  ) { }

  ngOnInit() {
    // data showing in url
    //   this.route.params.subscribe(params => {
    //   console.log(params);
    //   this.productData = params;
    // })

    //// data not showing in url
    const nav = this.router.getCurrentNavigation();
    this.productData = nav?.extras?.state?.['data'];

  }


backPage() {
  this.navCtrl.pop();
}
}
