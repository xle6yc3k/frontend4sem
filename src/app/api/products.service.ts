import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = 'http://localhost:3001/products';

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadProducts() {
    this.http.get<Product[]>(this.API_URL).subscribe({
      next: (data) => this.productsSubject.next(data),
      error: (err) => console.error('Ошибка при загрузке товаров', err),
    });
  }

  private categorySubject = new BehaviorSubject<string>('Все');
  public category$ = this.categorySubject.asObservable();

  setCategory(category: string) {
    this.categorySubject.next(category);
  }

  private sortBySubject = new BehaviorSubject<string>('default');
  public sortBy$ = this.sortBySubject.asObservable();

  setSortBy(sortBy: string) {
    this.sortBySubject.next(sortBy);
  }

  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }
}
