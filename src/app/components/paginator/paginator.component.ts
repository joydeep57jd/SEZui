import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements OnChanges {
  @Input() totalPage!: number;
  @Input() currentPage!: number;
  @Input() size!: number;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pages = signal<number[]>([]);
  pageSizes = [10, 25, 50, 100];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['totalPage']?.currentValue ||
      changes['currentPage']?.currentValue
    ) {
      this.calculatePageArray();
    }
  }

  calculatePageArray() {
    const maxVisiblePages = 5;
    const pages: number[] = [];

    if (this.totalPage <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPage; i++) {
        pages.push(i);
      }
    } else {
      let startPage = this.currentPage - Math.floor(maxVisiblePages / 2);
      let endPage = this.currentPage + Math.floor(maxVisiblePages / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = startPage + maxVisiblePages - 1;
      }

      if (endPage > this.totalPage) {
        endPage = this.totalPage;
        startPage = endPage - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    this.pages.set(pages);
  }

  gotoPage(page: number) {
    if (page > 0 && page <= this.totalPage && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  changePageSize(size: string) {
    this.pageSizeChange.emit(+size);
  }
}
