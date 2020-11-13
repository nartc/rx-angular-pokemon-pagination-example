import { Observable, pipe, UnaryFunction } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export function toApiResponse<TData>(
  initialValue: TData,
): UnaryFunction<
  Observable<TData>,
  Observable<{ status: 'loading' | 'success'; data: TData }>
> {
  return pipe(
    map((data: TData) => ({ status: 'success' as const, data })),
    startWith({ status: 'loading' as const, data: initialValue }),
  );
}
