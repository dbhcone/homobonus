import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartService } from 'ng-shopping-cart';
import { Subscription } from 'rxjs';
import { TicketItem } from 'src/app/cart/ticket-item';
import { removeItem } from 'src/app/store/actions/cart.actions';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: TicketItem[] = [];
  subscription!: Subscription;
  constructor(private cart: CartService<TicketItem>, private store: Store<AppState>) {
    this.subscription = this.cart.onItemsChanged.subscribe((item) => {
      console.log('cart items changed', item)
      this.displayCartItems();
    })
  }

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;

  ngOnInit(): void {
    this.displayCartItems();
  }

  displayCartItems() {
    this.cartItems = this.cart.getItems();
  }

  displayCartTotal() {
    return this.cart.totalCost();
  }

  increment(ticketItem: TicketItem) {
    const items = this.cart.getItems();
    const index = items.findIndex((itm) => {itm.id === ticketItem.id});
    ticketItem.quantity += 1;
    this.cartItems.splice(index, 1, ticketItem);
    console.log('to increase');
  }

  decrement(ticketItem: TicketItem) {
    const items = this.cart.getItems();
    const index = items.findIndex((itm) => {itm.id === ticketItem.id});
    ticketItem.quantity -= 1;
    this.cartItems.splice(index, 1, ticketItem);
    console.log('to decrease');
  }

  remove(ticketItem: TicketItem) {
    this.cart.removeItem(ticketItem.id);
    this.store.dispatch(removeItem({itemid: ticketItem.id}));
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
