import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { EditTodoComponent } from './edit-todo.component';

const routes = [{ path: '', component: EditTodoComponent }];

@NgModule({
  declarations: [EditTodoComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LetModule],
})
export class EditTodoModule {}
