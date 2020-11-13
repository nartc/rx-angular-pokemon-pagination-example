import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-todo',
  template: `add`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTodoComponent {}
