import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pagination } from '../components/paginator/paginator.component';
import { TodoStateService } from './todo-state.service';

@Component({
  selector: 'app-todo',
  template: `
    <ng-container *rxLet="vm$; let vm">
      <app-paginator
        [totalRecords]="vm.total"
        [rows]="vm.limit"
        [first]="vm.offset + vm.limit"
        [currentPage]="vm.currentPage"
        [rowsPerPageOptions]="[10, 20, 40, 80]"
        (onPageChange)="onPageChanged($event)"
      ></app-paginator>
      <app-query
        debounce="0"
        [placeholder]="'Filter todo...'"
        (query)="onQueryChanged($event)"
      ></app-query>
      <button [routerLink]="['/todo', 'add']">Add Todo</button>
      <table [class.overlay]="vm.status === 'loading'">
        <thead>
          <tr>
            <th class="border-bottom">Id</th>
            <th class="border-bottom">Title</th>
            <th class="border-bottom">Status</th>
            <th class="border-bottom">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let result of vm.pagedTodos">
            <td [innerHTML]="result.id | highlight: vm.query"></td>
            <td
              class="border-left"
              [innerHTML]="result.title | highlight: vm.query"
            ></td>
            <td
              class="border-left"
              [innerHTML]="result.completed | status | highlight: vm.query"
            ></td>
            <td class="border-left">
              <button (click)="onEditClicked(result.id)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </ng-container>
  `,
  styleUrls: ['../table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TodoStateService],
})
export class TodoComponent {
  vm$ = this.todoStateService.vm$;

  constructor(private readonly todoStateService: TodoStateService) {}

  onQueryChanged(query: string) {
    this.todoStateService.set(({ currentPage }) => {
      if (currentPage > 1) return { query, currentPage: 1, offset: 0 };
      return { query };
    });
  }

  onEditClicked(id: number) {
    this.todoStateService.set({ selected: id });
  }

  onPageChanged({ rows, page, first }: Pagination) {
    this.todoStateService.set(({ limit, total }) => {
      if (rows !== limit) {
        return {
          currentPage: 1,
          limit: rows,
          offset: 0,
        };
      }
      return {
        currentPage: page ? page : 1,
        limit: rows,
        offset: total < limit ? 0 : first - rows,
      };
    });
  }
}
