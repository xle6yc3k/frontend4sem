import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductsService, Product } from '../../api/products.service';
import { SortPanelComponent } from '../sort-panel/sort-panel.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import {
  trigger,
  transition,
  query,
  stagger,
  animate,
  style,
  animateChild
} from '@angular/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    FilterPanelComponent,
    SortPanelComponent,
    SearchBarComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  animations: [
    trigger('listStagger', [
      transition(':enter', [
        query('@cardAnimation', stagger(100, animateChild()), { optional: true })
      ])
    ])
  ]  
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedCategory: string = 'Все';
  sortBy: string = 'default';
  searchQuery: string = '';
  isLoading = true;

  constructor(public productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.loadProducts();

    this.productsService.products$.subscribe((products) => {
      this.products = products;
    });

    this.productsService.products$.subscribe((products) => {
      this.products = products;
      this.isLoading = false;
    });    

    this.productsService.category$.subscribe((category) => {
      this.selectedCategory = category;
    });

    this.productsService.sortBy$.subscribe((sortBy) => {
      this.sortBy = sortBy;
    });
    
    this.productsService.searchQuery$.subscribe((query) => {
      this.searchQuery = query;
    });    
  }
  

  get finalProducts(): Product[] {
    let filtered = this.selectedCategory === 'Все'
      ? this.products
      : this.products.filter((p: Product) => p.category === this.selectedCategory);
  
    let searched = filtered.filter((p: Product) =>
      p.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  
    switch (this.sortBy) {
      case 'priceAsc':
        return [...searched].sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return [...searched].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...searched].sort((a, b) => b.rating - a.rating);
      default:
        return searched;
    }
  }   
}



