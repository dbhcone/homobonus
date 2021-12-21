import { createAction, props } from '@ngrx/store';

const addCartItem = createAction(
  'Cart [Add Item]',
  props<{
    cart: {
      id: string;
      eventId: string;
      price: number;
      name: string;
      quantity: number;
    };
  }>()
);

const increaseQuantity = createAction(
  'Cart [Increase Quantity]',
  props<{
    itemid: string;
    quantity: number;
  }>()
);

const removeItem = createAction('Cart [Remove Item]', props<{itemid: string}>())

const clearCart = createAction('Cart [Clear Cart]');

export { addCartItem, increaseQuantity, removeItem, clearCart };
