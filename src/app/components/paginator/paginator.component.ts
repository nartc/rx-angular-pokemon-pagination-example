import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface Pagination {
  page: number;
  rows: number;
  first: number;
}

/**
 * Simplified PrimeNG Paginator component
 */

@Component({
  selector: 'app-paginator',
  template: `
    <div>
      <button
        type="button"
        [disabled]="currentPage === 1"
        (click)="changePageToFirst($event)"
      >
        <span><<</span>
      </button>
      <button
        type="button"
        [disabled]="currentPage === 1"
        (click)="changePageToPrev($event)"
      >
        <span><</span>
      </button>
      <span class="paginator-pages">
        <button
          type="button"
          *ngFor="let pageLink of pageLinks"
          [class.highlight]="pageLink === currentPage"
          (click)="onPageLinkClick($event, pageLink)"
        >
          {{ pageLink }}
        </button>
      </span>
      <button
        type="button"
        [disabled]="currentPage === lastPage || !lastPage"
        (click)="changePageToNext($event)"
      >
        <span>></span>
      </button>
      <button
        type="button"
        [disabled]="currentPage === lastPage || !lastPage"
        (click)="changePageToLast($event)"
      >
        <span>>></span>
      </button>
      <select
        [(ngModel)]="rows"
        (ngModelChange)="onRppChange()"
        class="paginator-rows-per-page"
      >
        <option *ngFor="let item of rowsPerPageOptions" [value]="item">
          {{ item }}
        </option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .highlight {
        background: aquamarine;
      }

      .paginator-rows-per-page {
        margin-left: 1rem;
      }
    `,
  ],
})
export class PaginatorComponent implements OnChanges {
  @Input() totalRecords = 0;
  @Input() rows = 0;
  @Input() currentPage = 1;
  @Input() rowsPerPageOptions: number[] = [];
  @Input() first: number;

  @Output() onPageChange = new EventEmitter<Pagination>();

  lastPage = this.currentPage;
  pageLinks: number[];

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.totalRecords || simpleChange.rows) {
      this.lastPage = Math.ceil(this.totalRecords / this.rows);
      this.updatePageLinks();
    }
  }

  changePageToFirst(event) {
    this.changePage(1);
    event.preventDefault();
  }

  changePageToPrev(event) {
    this.changePage(this.getPage() - 1);
    event.preventDefault();
  }

  changePageToNext(event) {
    this.changePage(this.getPage() + 1);
    event.preventDefault();
  }

  changePageToLast(event) {
    this.changePage(this.getPageCount());
    event.preventDefault();
  }

  onPageLinkClick(event, page) {
    this.changePage(page);
    event.preventDefault();
  }

  onRppChange() {
    this.changePage(this.getPage());
  }

  private changePage(p: number) {
    const pc = this.getPageCount();
    const rows = Number(this.rows);

    if (p >= 0 && p <= pc) {
      this.onPageChange.emit({
        page: p,
        first: rows * p,
        rows: rows,
      });
    }
  }

  private updatePageLinks() {
    this.pageLinks = [];
    let [start, end] = [0, this.getPageCount() - 1];

    for (let i = start; i <= end; i++) {
      this.pageLinks.push(i + 1);
    }

    if (!this.pageLinks.length && !!this.totalRecords) {
      this.pageLinks.push(1);
    }
  }

  private getPage(): number {
    const dummy = Math.floor(this.first / this.rows);
    return dummy === 0 ? dummy + 1 : dummy;
  }

  private getPageCount() {
    return Math.ceil(this.totalRecords / this.rows) || 1;
  }
}
