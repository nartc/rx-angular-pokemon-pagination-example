import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoFormModule } from '../components/todo-form/todo-form.module';
import { AddTodoComponent } from './add-todo.component';

const routes = [{ path: '', component: AddTodoComponent }];

@NgModule({
  declarations: [AddTodoComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TodoFormModule],
})
export class AddTodoModule {}
