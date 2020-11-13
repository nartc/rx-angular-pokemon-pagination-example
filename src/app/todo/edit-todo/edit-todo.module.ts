import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { TodoFormModule } from '../components/todo-form/todo-form.module';
import { EditTodoComponent } from './edit-todo.component';

const routes = [{ path: '', component: EditTodoComponent }];

@NgModule({
  declarations: [EditTodoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LetModule,
    TodoFormModule,
  ],
})
export class EditTodoModule {}
