import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="pagination">
      <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">
        Précédent
      </button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">
        Suivant
      </button>
    </div>
  `,
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageChange.emit(newPage);
    }
  }
}
