import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent {
  @Output() filterChange = new EventEmitter<string>();

  categories = ['Все', 'electronics', 'clothing', 'books'];

  setFilter(category: string) {
    this.filterChange.emit(category);
  }
}
