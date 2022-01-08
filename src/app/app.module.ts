import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StoreModule } from '@ngrx/store';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ShoppingCartModule } from 'ng-shopping-cart';
import { NgxSimpleCountdownModule } from 'ngx-simple-countdown';
import { cartReducer } from './store/reducers/cart.reducers';
import { userProfileReducer, userReducer } from './store/reducers/user.reducers';
import { TicketItem } from './cart/ticket-item';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        NgxSkeletonLoaderModule,
        ShoppingCartModule.forRoot({
            itemType: TicketItem,
            serviceType: 'localStorage',
            serviceOptions: {
                storageKey: 'HomoBonoShoppingCart',
                clearOnError: true
            }
        }),
        StoreModule.forRoot({ cart: cartReducer, userObj: userReducer, userProfile: userProfileReducer }),
        ZXingScannerModule,
        NgxSimpleCountdownModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
