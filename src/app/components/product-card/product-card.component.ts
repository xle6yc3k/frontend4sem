import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../api/products.service';
import { CartService } from '../../api/cart.service';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]  
})
export class ProductCardComponent {
  @Input() product!: Product;
  constructor(private cartService: CartService) {}
  addToCart() {
    this.cartService.addToCart(this.product);
  }  
}
