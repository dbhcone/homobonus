import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartService } from 'ng-shopping-cart';
import Swal from 'sweetalert2';
import { Events } from '../api/endpoints';
import { TicketItem } from '../cart/ticket-item';
import { addCartItem } from '../store/actions/cart.actions';
import { AppState } from '../store/app.state';
import { Client } from '../utils/client';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  constructor(private cart: CartService<TicketItem>, private client: Client, private store: Store<AppState>) {}

  alreadyInCart(ticketId: string) {
    const item = this.cart.getItem(ticketId);
    return item !== undefined ? true : false;
  }

  getTicket(ticketId: string) {
    return this.client.GET(`${Events.getPrice}/${ticketId}`);
  }

  addToCart(ticketId: string) {
    if (this.alreadyInCart(ticketId)) {
      Swal.fire({
        title: 'Item already in cart',
        icon: 'error',
        toast: true,
        timer: 3000,
      });
      return;
    }
    this.getTicket(ticketId).subscribe(
      async (res: any) => {
        console.log('res to add', res)
        const data = res.data;
        const {_id, event, pricing} = data;
        let ticketItem = new TicketItem({
          id: _id,
          name: event.title,
          ticketName: pricing.name,
          image: '',
          quantity: 1,
          price: pricing.amount,
          eventId: event._id
        });
        this.cart.addItem(ticketItem);
        this.store.dispatch(addCartItem({cart: {...ticketItem}}))

        Swal.fire({
          title: 'Item added to cart',
          toast: true,
          timer: 4000,
        });
      },
      (err: any) => {
        Swal.fire({
          title: err.error.message,
          toast: true,
          timer: 4000,
        });
      }
    );
  }

  increaseQuantity(ticketItem: TicketItem) {
    ticketItem.quantity += 1;
  }

  decreaseQuantity(ticketItem: TicketItem) {
    ticketItem.quantity -= 1;
  }
}
