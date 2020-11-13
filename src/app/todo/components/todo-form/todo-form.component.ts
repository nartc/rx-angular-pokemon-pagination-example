import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../../todo.model';

@Component({
  selector: 'app-todo-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-control">
        <label for="title">Title</label>
        <input id="title" type="text" formControlName="title" />
        <small *ngIf="form.get('title').touched && form.get('title').errors">
          Title must not be empty
        </small>
      </div>
      <div class="form-control">
        <label for="completed">
          <input id="completed" type="checkbox" formControlName="completed" />
          Complete
        </label>
      </div>
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
  styles: [
    `
      .form-control {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        width: 50%;
      }

      button {
        display: block;
        width: 50%;
      }

      small {
        color: red;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent implements OnInit {
  @Input() todo?: Todo;

  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.todo?.title ?? '', Validators.required],
      completed: [this.todo?.completed ?? false],
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
