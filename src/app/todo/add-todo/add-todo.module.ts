import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTodoComponent } from './add-todo.component';
import { RouterModule } from '@angular/router';

const routes = [{ path: '', component: AddTodoComponent }];

@NgModule({
  declarations: [AddTodoComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AddTodoModule {}
