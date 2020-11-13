import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { PaginatorModule } from '../components/paginator/paginator.module';
import { QueryModule } from '../components/query/query.module';
import { HighlightModule } from '../pipes/highlight/highlight.module';
import { TodoStatusPipe } from './pipes/todo-status.pipe';
import { TodoComponent } from './todo.component';

const routes = [
  {
    path: '',
    component: TodoComponent,
  },
  {
    path: 'add',
    loadChildren: () =>
      import('./add-todo/add-todo.module').then(
        ({ AddTodoModule }) => AddTodoModule,
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./edit-todo/edit-todo.module').then(
        ({ EditTodoModule }) => EditTodoModule,
      ),
  },
];

@NgModule({
  declarations: [TodoComponent, TodoStatusPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LetModule,
    PaginatorModule,
    QueryModule,
    HighlightModule,
  ],
})
export class TodoModule {}
