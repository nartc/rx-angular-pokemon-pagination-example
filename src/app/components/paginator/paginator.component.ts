import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface Pagination {
  page: number;
  pageCount: number;
  rows: number;
  first: number;
  totalRecords?: number;
}

/**
 * Simplified PrimeNG Paginator component
 */

@Component({
  selector: 'app-paginator',
  template: `
    <div class="paginator">
      <button
        type="button"
        [disabled]="currentPage === 1"
        (click)="changePageToFirst($event)"
        class="paginator-first"
      >
        <span><<</span>
      </button>
      <button
        type="button"
        [disabled]="currentPage === 1"
        (click)="changePageToPrev($event)"
        class="paginator-prev"
      >
        <span><</span>
      </button>
      <span class="paginator-pages">
        <button
          type="button"
          *ngFor="let pageLink of pageLinks"
          class="paginator-page"
          [class.highlight]="pageLink == currentPage"
          (click)="onPageLinkClick($event, pageLink)"
        >
          {{ pageLink }}
        </button>
      </span>
      <button
        type="button"
        [disabled]="currentPage === lastPage"
        (click)="changePageToNext($event)"
        class="paginator-next"
      >
        <span>></span>
      </button>
      <button
        type="button"
        [disabled]="currentPage === lastPage"
        (click)="changePageToLast($event)"
        class="paginator-last"
      >
        <span>>></span>
      </button>
      <select
        [(ngModel)]="rows"
        class="paginator-rows-per-page"
        (ngModelChange)="onRppChange()"
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
export class PaginatorComponent implements OnInit, OnChanges {
  get totalRecords(): number {
    return this._totalRecords;
  }

  @Input()
  set totalRecords(value: number) {
    this._totalRecords = value;
    this.lastPage = Math.ceil(value / this.rows);
  }

  private _totalRecords = 0;

  @Input() currentPage = 1;

  @Output() onPageChange = new EventEmitter<Pagination>();

  get rows() {
    return this._rows;
  }

  @Input()
  set rows(rows: number) {
    this._rows = rows;
    this.lastPage = Math.ceil(this.totalRecords / rows);
  }

  private _rows = 0;

  @Input() rowsPerPageOptions: number[] = [];

  pageLinks: number[];

  paginatorState: any;

  _first: number = 0;

  lastPage = this.currentPage;

  ngOnInit() {
    this.updatePaginatorState();
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.totalRecords) {
      this.updatePageLinks();
      this.updatePaginatorState();
      this.updateFirst();
    }

    if (simpleChange.first) {
      this._first = simpleChange.first.currentValue;
      this.updatePageLinks();
      this.updatePaginatorState();
    }

    if (simpleChange.rows) {
      this.updatePageLinks();
      this.updatePaginatorState();
    }
  }

  @Input() get first(): number {
    return this._first;
  }

  set first(val: number) {
    this._first = val;
  }

  isFirstPage() {
    return this.getPage() === 0;
  }

  isLastPage() {
    return this.getPage() === this.getPageCount() - 1;
  }

  getPageCount() {
    return Math.ceil(this._totalRecords / this.rows) || 1;
  }

  calculatePageLinkBoundaries() {
    let numberOfPages = this.getPageCount(),
      visiblePages = numberOfPages;

    //calculate range, keep current in middle if necessary
    let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2)),
      end = Math.min(numberOfPages - 1, start + visiblePages - 1);

    //check when approaching to last page
    const delta = end - start + 1;
    start = Math.max(0, start - delta);

    return [start, end];
  }

  updatePageLinks() {
    this.pageLinks = [];
    let boundaries = this.calculatePageLinkBoundaries(),
      start = boundaries[0],
      end = boundaries[1];

    for (let i = start; i <= end; i++) {
      this.pageLinks.push(i + 1);
    }
  }

  changePage(p: number) {
    const pc = this.getPageCount();
    const rows = Number(this.rows);

    if (p >= 0 && p <= pc) {
      this._first = rows * p;
      const state = {
        page: p,
        first: this.first,
        rows: rows,
        pageCount: pc,
      };
      this.updatePageLinks();

      this.onPageChange.emit(state);
      this.updatePaginatorState();
    }
  }

  updateFirst() {
    const page = this.getPage();
    if (page > 0 && this._totalRecords && this.first >= this._totalRecords) {
      Promise.resolve(null).then(() => this.changePage(page - 1));
    }
  }

  getPage(): number {
    const dummy = Math.floor(this.first / this.rows);
    return dummy === 0 ? dummy + 1 : dummy;
  }

  changePageToFirst(event) {
    if (!this.isFirstPage()) {
      this.changePage(1);
    }

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
    if (!this.isLastPage()) {
      this.changePage(this.getPageCount());
    }

    event.preventDefault();
  }

  onPageLinkClick(event, page) {
    this.changePage(page);
    event.preventDefault();
  }

  onRppChange() {
    this.changePage(this.getPage());
  }

  updatePaginatorState() {
    this.paginatorState = {
      page: this.getPage(),
      pageCount: this.getPageCount(),
      rows: Number(this.rows),
      first: this.first,
      totalRecords: this._totalRecords,
    };
  }
}
