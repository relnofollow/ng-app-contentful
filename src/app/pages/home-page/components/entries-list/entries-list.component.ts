import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ContentfulEntriesQuery,
  ContentfulService,
} from 'src/app/services/contentful/contentful.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  first,
  from,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ContentType, EntryCollection } from 'contentful';
import { indicate } from 'src/app/helpers/rxjs';
import { PageEvent } from '@angular/material/paginator';
import { PagingParameters } from 'src/app/models/PagingParameters';

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.scss'],
})
export class EntriesListComponent {
  public entries: any[] | null = null;

  public totalEntriesLength: number | undefined;
  public pageSize = 5;
  public pageIndex = 0;

  public loading$ = new Subject<boolean>();
  public contentTypes$!: Observable<ContentType[]>;
  public pagingParameters$ = new Subject<PagingParameters>();

  public columnsToDisplay = ['title', 'contentType'];

  public showDraftControl = new FormControl<boolean>(false, {
    nonNullable: true,
  });
  public searchByTitleControl = new FormControl<string>('', {
    nonNullable: true,
  });

  constructor(private contentfulService: ContentfulService) {
    combineLatest([
      this.getTitleFilterObservable(),
      this.getPagingParametersObservable(),
      this.getIsDraftObservable(),
    ])
      .pipe(
        takeUntilDestroyed(),
        switchMap(() =>
          from(
            this.contentfulService.getEntries(this.getQueryParameters())
          ).pipe(indicate(this.loading$))
        )
      )
      .subscribe((entries) => {
        this.setEntries(entries);
      });

    this.contentTypes$ = from(this.contentfulService.getContentTypes()).pipe(
      takeUntilDestroyed(),
      map((response) => response.items),
      shareReplay(1)
    );
  }

  public onPaginatorChange(event: PageEvent): void {
    const { pageSize, pageIndex } = event;

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;

    this.pagingParameters$.next({ pageSize, pageIndex });
  }

  private getTitleFilterObservable(): Observable<string> {
    return this.searchByTitleControl.valueChanges.pipe(
      startWith(this.searchByTitleControl.value),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.resetPageIndex())
    );
  }

  private getPagingParametersObservable(): Observable<PagingParameters> {
    return this.pagingParameters$.pipe(
      startWith({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      })
    );
  }

  private getIsDraftObservable(): Observable<boolean> {
    return this.showDraftControl.valueChanges.pipe(
      startWith(this.showDraftControl.value),
      tap(() => this.resetPageIndex())
    );
  }

  private getQueryParameters(): ContentfulEntriesQuery {
    return {
      isDraft: this.showDraftControl.value,
      titleFilter: this.searchByTitleControl.value,
      pagingParameters: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      },
    };
  }

  private setEntries(entries: EntryCollection<any, undefined, string>) {
    this.totalEntriesLength = entries.total;

    this.contentTypes$.pipe(first()).subscribe((contentTypes) => {
      this.entries = entries.items.map((entry) => ({
        ...entry,
        contentType: contentTypes.find(
          (contentType) => contentType.sys.id === entry.sys.contentType.sys.id
        ),
      }));
    });
  }

  private resetPageIndex(): void {
    this.pageIndex = 0;
  }
}
