import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-todo',
  template: `
    <h1>Add Todo</h1>
    <app-todo-form></app-todo-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTodoComponent {}
