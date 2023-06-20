import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentTypeField } from 'contentful';

@Component({
  selector: 'app-view-entry',
  templateUrl: './view-entry.component.html',
  styleUrls: ['./view-entry.component.scss'],
})
export class ViewEntryComponent {
  public isLoading = false;
  public fieldAndTypePairs: [Record<string, any>, ContentTypeField][] | null =
    null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      entryTitle: string;
      entryId: string;
      contentTypeId: string;
      isDraft: boolean;
    },
    private contentfulService: ContentfulService
  ) {
    from(
      Promise.all([
        this.contentfulService.getEntry(data.entryId, data.isDraft),
        this.contentfulService.getContentType(data.contentTypeId),
      ])
    )
      .pipe(takeUntilDestroyed())
      .subscribe(([entry, contentType]) => {
        this.fieldAndTypePairs = [];

        for (let [key, value] of Object.entries(entry.fields)) {
          const meta = contentType.fields.find((field) => field.id === key)!;
          this.fieldAndTypePairs.push([value, meta]);
        }
      });
  }
}
