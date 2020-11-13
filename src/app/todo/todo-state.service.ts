import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { RxState, selectSlice } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';
import { getCompleteStatus } from '../utils/get-complete-status.util';
import { PaginationState } from '../utils/pagination-state.model';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

export interface TodoState extends PaginationState {
  status: 'loading' | 'success';
  todos: Todo[];
  filteredTodos: Todo[];
  pagedTodos: Todo[];
  selected: number;
}

@Injectable()
export class TodoStateService extends RxState<TodoState> {
  readonly vm$ = this.select(
    selectSlice([
      'status',
      'pagedTodos',
      'currentPage',
      'limit',
      'offset',
      'total',
      'query',
    ]),
  );

  constructor(
    private readonly todoService: TodoService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
  ) {
    super();
    this.set({
      total: 0,
      currentPage: 1,
      limit: 20,
      offset: 0,
      query: '',
      pagedTodos: [],
      filteredTodos: [],
      todos: [],
    });
    this.connect(
      this.todoService.getTodos().pipe(
        map(({ data, status }) => ({
          status,
          todos: data,
          filteredTodos: data,
          total: data.length,
        })),
      ),
    );
    this.connect(this.queryEffect$());
    this.connect('pagedTodos', this.pagedEffect$());
    this.hold(
      this.select('selected').pipe(distinctUntilChanged()),
      (selectedId) => {
        if (selectedId) {
          // TODO: rx-angular bug. Waiting on vendor fix
          this.ngZone.run(() => {
            this.router.navigate(['/todo', selectedId]);
          });
        }
      },
    );
  }

  private pagedEffect$() {
    return this.select(selectSlice(['limit', 'offset', 'filteredTodos'])).pipe(
      withLatestFrom(this.select('total')),
      map(([{ limit, offset, filteredTodos }, total]) => {
        if (total < limit) return filteredTodos;
        return filteredTodos.slice(offset, limit + offset);
      }),
    );
  }

  private queryEffect$(): Observable<{ filteredTodos: Todo[]; total: number }> {
    return this.select('query').pipe(
      distinctUntilChanged(),
      withLatestFrom(this.select('todos')),
      map(([query, todos]) => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) return todos;
        return this.filter(todos, trimmed);
      }),
      map((todos) => ({ filteredTodos: todos, total: todos.length })),
    );
  }

  private filter(todos, trimmed: string): Todo[] {
    return todos.filter(
      ({ id, title, completed }) =>
        title.toLowerCase().includes(trimmed) ||
        id.toString().includes(trimmed) ||
        getCompleteStatus(completed).toLowerCase().includes(trimmed),
    );
  }
}
