import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-todo',
  template: `
    <app-todo-form></app-todo-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTodoComponent {}
