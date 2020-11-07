import { Injectable } from '@angular/core';
import {CartItem} from '../common/cart-item';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCard(theCardItem: CartItem) {
    // check if we already have the item in our card
    let alreadyExistsInCard: boolean = false;
    let existingCardItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // find the item in the card based on item id
      existingCardItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCardItem.id);

      //check if we found it
      alreadyExistsInCard = (existingCardItem != undefined);
    }

    if (alreadyExistsInCard) {
      //increment the quantity of item
      existingCardItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(theCardItem);
    }

    // conpute cart total price and total quality

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.uniPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // pulish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log card data just for the debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCardItem of this.cartItems) {
      const subTotalPrice = tempCardItem.quantity * tempCardItem.uniPrice;
      console.log(`name: ${tempCardItem.name}, quantity: ${tempCardItem.quantity}, unitPrice: ${tempCardItem.uniPrice}, subtotalPrice=${subTotalPrice}`);
    }

    console.log(`total price: ${totalPriceValue.toFixed(2)}, totalQuality: ${totalQuantityValue}`);
    console.log('--------');
  }

  decrementQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity--;

    if (tempCartItem.quantity === 0) {
      this.remove(tempCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex((tempCartItem => tempCartItem.id == theCartItem.id));
    // if found, remove the item from the given array
    if( itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
