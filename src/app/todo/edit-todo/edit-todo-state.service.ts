import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { pluck, switchMap } from 'rxjs/operators';
import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';

export interface EditTodoState {
  status: 'loading' | 'success';
  data: Todo;
}

@Injectable()
export class EditTodoStateService extends RxState<EditTodoState> {
  readonly vm$ = this.select();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly todoService: TodoService,
  ) {
    super();
    this.getTodoEffect();
  }

  private getTodoEffect() {
    const effect = this.route.params.pipe(
      pluck('id'),
      switchMap((id: string) => this.todoService.getTodo(id)),
    );
    this.connect(effect);
  }
}
