import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './providers/login.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers, Storage } from '@ionic/storage';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NetworkService } from './providers/network.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { productReducer } from './product-list/ngrx-store/reducers/product.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(
      {
        name: '__mydb',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      }
    ),
    ReactiveFormsModule,
    FormsModule, 
    StoreModule.forRoot({ products: productReducer }),
    EffectsModule.forRoot([]), 
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })],
  providers: [
    provideHttpClient(),
    InAppBrowser,
    NetworkService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true // You can have multiple interceptors
    },
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    }, 
      LoginService
    ],
  bootstrap: [AppComponent],
})
export class AppModule { }
