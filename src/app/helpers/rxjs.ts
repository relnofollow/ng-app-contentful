import { Observable, Subject, defer, finalize } from 'rxjs';

export function prepare<T>(
  callback: () => void
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> =>
    defer(() => {
      callback();
      return source;
    });
}

export function indicate<T>(
  loadingSubject: Subject<boolean>
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => {
    return source.pipe(
      prepare(() => loadingSubject.next(true)),
      finalize(() => loadingSubject.next(false))
    );
  };
}
