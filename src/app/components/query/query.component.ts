import {
  Attribute,
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

  @Input() set currentQuery(query: string) {
    if (query === '') {
      this.queryControl.setValue('', { emitEvent: false });
    }
  }

  queryControl = new FormControl('');
  @Output() query: Observable<string>;

  constructor(@Attribute('debounce') debounce: string) {
    this.query = this.queryControl.valueChanges.pipe(
      debounceTime(debounce ? Number(debounce) : 250),
    );
  }
}
