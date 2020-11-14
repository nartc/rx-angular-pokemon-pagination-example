import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { RxState, selectSlice } from '@rx-angular/state';
import { Subject } from 'rxjs';
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
}

@Injectable()
export class TodoStateService extends RxState<TodoState> {
  private readonly $selected = new Subject<number>();
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
    this.initEffect();
    this.paginationEffect();
    this.queryEffect();

    this.hold(this.$selected.pipe(distinctUntilChanged()), (selectedId) => {
      if (selectedId) {
        // TODO: rx-angular bug. Waiting on vendor fix
        this.ngZone.run(() => {
          this.router.navigate(['/todo', selectedId]);
        });
      }
    });
  }

  setSelected(id: number): void {
    this.$selected.next(id);
  }

  private initEffect(): void {
    const getTodos = this.todoService.getTodos().pipe(
      map(({ data, status }) => ({
        status,
        todos: data,
        filteredTodos: data,
        total: data.length,
      })),
    );
    this.connect(getTodos);
  }

  private paginationEffect(): void {
    const effect = this.select(
      selectSlice(['limit', 'offset', 'filteredTodos']),
    ).pipe(
      withLatestFrom(this.select('total')),
      map(([{ limit, offset, filteredTodos }, total]) => {
        if (total < limit) return filteredTodos;
        return filteredTodos.slice(offset, limit + offset);
      }),
    );
    this.connect('pagedTodos', effect);
  }

  private queryEffect(): void {
    const effect = this.select('query').pipe(
      distinctUntilChanged(),
      withLatestFrom(this.select('todos')),
      map(([query, todos]) => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) return todos;
        return this.filter(todos, trimmed);
      }),
      map((todos) => ({ filteredTodos: todos, total: todos.length })),
    );
    this.connect(effect);
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
