import { Pipe, PipeTransform } from '@angular/core';
import { getCompleteStatus } from '../../utils/get-complete-status.util';

@Pipe({
  name: 'status',
})
export class TodoStatusPipe implements PipeTransform {
  transform(value: boolean): string {
    return getCompleteStatus(value);
  }
}
