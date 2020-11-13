import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { toApiResponse } from '../utils/to-api-response.util';
import { Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private cached$: Observable<{ status: 'loading' | 'success'; data: Todo[] }>;

  constructor(private readonly http: HttpClient) {}

  getTodos(): Observable<{ status: 'loading' | 'success'; data: Todo[] }> {
    if (this.cached$ == null) {
      this.cached$ = this.http
        .get('https://jsonplaceholder.typicode.com/todos')
        .pipe(
          toApiResponse<Todo[]>([]),
          shareReplay({ refCount: true, bufferSize: 1 }),
        );
    }
    return this.cached$;
  }

  getTodo(
    id: string,
  ): Observable<{ status: 'loading' | 'success'; data: Todo }> {
    return this.http
      .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .pipe(toApiResponse<Todo>(null));
  }
}
