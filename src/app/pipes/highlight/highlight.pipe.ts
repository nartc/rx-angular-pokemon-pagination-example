import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: string | number, query: string): string {
    if (!query) return value.toString();
    const regex = new RegExp(query, 'gi');
    return value.toString().replace(regex, `<mark>${query}</mark>`);
  }
}
