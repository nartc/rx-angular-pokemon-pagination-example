import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-query',
  template: `
    <input
      class="query"
      type="text"
      [placeholder]="placeholder"
      [formControl]="queryControl"
    />
  `,
  styles: [
    `
      .query {
        width: 50%;
        margin: 1rem 0.5rem 1rem 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryComponent {
  @Input() placeholder: string;

  queryControl = new FormControl('');
  @Output() query: Observable<string> = this.queryControl.valueChanges.pipe(
    debounceTime(250),
  );
}
