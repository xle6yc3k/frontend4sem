import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './products.service';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  public total$ = this.totalSubject.asObservable();

  addToCart(product: Product) {
    const items = this.itemsSubject.getValue();
    const existing = items.find(item => item.id === product.id);

    let updated: CartItem[];

    if (existing) {
      updated = items.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [...items, { ...product, quantity: 1 }];
    }

    this.itemsSubject.next(updated);
    this.updateTotal(updated);
  }

  removeFromCart(product: Product) {
    let items = this.itemsSubject.getValue();
    const existing = items.find(item => item.id === product.id);

    if (!existing) return;

    if (existing.quantity > 1) {
      items = items.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      items = items.filter(item => item.id !== product.id);
    }

    this.itemsSubject.next(items);
    this.updateTotal(items);
  }

  clearCart() {
    this.itemsSubject.next([]);
    this.totalSubject.next(0);
  }

  private updateTotal(items: CartItem[]) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.totalSubject.next(total);
  }
}
