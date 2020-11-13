import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EditTodoStateService } from './edit-todo-state.service';

@Component({
  selector: 'app-edit-todo',
  template: `
    <ng-container *rxLet="vm$; let vm">
      <pre>{{ vm | json }}</pre>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EditTodoStateService],
})
export class EditTodoComponent {
  vm$ = this.editTodoStateService.vm$;

  constructor(private readonly editTodoStateService: EditTodoStateService) {}
}
