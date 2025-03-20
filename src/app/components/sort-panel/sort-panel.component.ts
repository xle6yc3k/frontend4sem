import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-sort-panel',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
  templateUrl: './sort-panel.component.html',
  styleUrls: ['./sort-panel.component.scss']
})
export class SortPanelComponent {
  @Output() sortChange = new EventEmitter<string>();

  sortOptions = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'priceAsc', label: 'По цене (возрастание)' },
    { value: 'priceDesc', label: 'По цене (убывание)' },
    { value: 'rating', label: 'По рейтингу' }
  ];

  onSortChange(value: string) {
    this.sortChange.emit(value);
  }
}
