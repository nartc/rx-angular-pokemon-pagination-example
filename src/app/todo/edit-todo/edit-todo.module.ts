import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LetModule} from "@rx-angular/template";
import { EditTodoComponent } from './edit-todo.component';
import { RouterModule } from '@angular/router';

const routes = [{ path: '', component: EditTodoComponent }];

@NgModule({
  declarations: [EditTodoComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LetModule],
})
export class EditTodoModule {}
