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
import { ContentType, EntryCollection, Entry } from 'contentful';
import { indicate } from 'src/app/helpers/rxjs';
import { PageEvent } from '@angular/material/paginator';
import { PagingParameters } from 'src/app/models/PagingParameters';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditEntryComponent } from '../../dialogs/edit-entry/edit-entry.component';
import { ViewEntryComponent } from '../../dialogs/view-entry/view-entry.component';

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.scss'],
})
export class EntriesListComponent {
  public entries: any[] | null = null;

  public INITIAL_SORT_DIRECTION = <SortDirection>'desc'; // const
  public totalEntriesLength: number | undefined;
  public pageSize = 5;
  public pageIndex = 0;

  public loading$ = new Subject<boolean>();
  public contentTypes$!: Observable<ContentType[]>;
  private pagingParameters$ = new Subject<PagingParameters>();
  private sortDirection$ = new Subject<SortDirection>();
  public sortDirection = this.INITIAL_SORT_DIRECTION;

  public columnsToDisplay = [
    'contentType',
    'title',
    'viewDetails',
    'updatedAt',
    'edit',
  ];

  public showDraftControl = new FormControl<boolean>(false, {
    nonNullable: true,
  });
  public searchByTitleControl = new FormControl<string>('', {
    nonNullable: true,
  });
  public contentTypeControl = new FormControl<string | null>(null);

  constructor(
    private contentfulService: ContentfulService,
    private dialog: MatDialog
  ) {
    combineLatest([
      this.getContentTypeObservable(),
      this.getTitleFilterObservable(),
      this.getPagingParametersObservable(),
      this.getSortDirectionObservable(),
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
      map((response) =>
        response.items.sort((item1, item2) =>
          item1.name.localeCompare(item2.name)
        )
      ),
      shareReplay(1)
    );
  }

  public onPaginatorChange(event: PageEvent): void {
    const { pageSize, pageIndex } = event;

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;

    this.pagingParameters$.next({ pageSize, pageIndex });
  }

  public onViewEntryClick(entry: Entry): void {
    this.dialog.open(ViewEntryComponent, {
      autoFocus: false,
      height: '400px',
      width: '600px',
      data: {
        entryTitle: entry.fields['title'],
        entryId: entry.sys.id,
        contentTypeId: entry.sys.contentType.sys.id,
        isDraft: this.showDraftControl.value,
      },
    });
  }

  public onEditEntryClick(entry: any): void {
    this.dialog.open(EditEntryComponent, {
      autoFocus: false,
      height: '400px',
      width: '600px',
    });
  }

  public onSortChange(event: Sort): void {
    // TODO: fix sorting arrow animation
    // for some reason the table header is re-rendered after sorting and
    // it blinks instead of animation
    this.sortDirection = event.direction;
    this.sortDirection$.next(event.direction);
  }

  private getContentTypeObservable(): Observable<string | null> {
    return this.contentTypeControl.valueChanges.pipe(
      startWith(null),
      distinctUntilChanged(),
      tap(() => this.resetPageIndex()),
      tap((value) => {
        if (!value) this.resetTitleFilter();
      })
    );
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

  private getSortDirectionObservable(): Observable<SortDirection> {
    return this.sortDirection$.pipe(
      startWith(this.INITIAL_SORT_DIRECTION),
      tap(() => this.resetPageIndex())
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
      contentTypeId: this.contentTypeControl.value,
      titleFilter: this.searchByTitleControl.value,
      pagingParameters: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      },
      order: this.sortDirection,
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

  private resetTitleFilter(): void {
    this.searchByTitleControl.setValue('');
  }
}
