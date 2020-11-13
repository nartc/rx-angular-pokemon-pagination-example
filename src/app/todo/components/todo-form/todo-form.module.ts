import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoFormComponent } from './todo-form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [TodoFormComponent],
  exports: [TodoFormComponent],
})
export class TodoFormModule {}
