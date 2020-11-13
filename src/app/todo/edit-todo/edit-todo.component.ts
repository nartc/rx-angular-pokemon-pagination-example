import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EditTodoStateService } from './edit-todo-state.service';

@Component({
  selector: 'app-edit-todo',
  template: `
    <ng-container *rxLet="vm$; let vm">
      <h4 *ngIf="vm.status === 'loading'">Loading...</h4>
      <app-todo-form
        *ngIf="vm.status === 'success'"
        [todo]="vm.data"
      ></app-todo-form>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EditTodoStateService],
})
export class EditTodoComponent {
  vm$ = this.editTodoStateService.vm$;

  constructor(private readonly editTodoStateService: EditTodoStateService) {}
}
