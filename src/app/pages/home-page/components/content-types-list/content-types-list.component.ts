import { Component, OnInit } from '@angular/core';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { ContentType } from 'contentful';
import { MatDialog } from '@angular/material/dialog';
import { ContentTypeJsonComponent } from '../../dialogs/content-type-json/content-type-json.component';
import { BehaviorSubject, first, from } from 'rxjs';
import { indicate } from 'src/app/helpers/rxjs';

@Component({
  selector: 'app-content-types-list',
  templateUrl: './content-types-list.component.html',
  styleUrls: ['./content-types-list.component.scss'],
})
export class ContentTypesListComponent implements OnInit {
  public contentTypes: ContentType[] | null = [];
  public columnsToDisplay = ['name', 'fields', 'json'];
  public loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private contentfulService: ContentfulService,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    from(this.contentfulService.getContentTypes())
      .pipe(indicate(this.loading$), first())
      .subscribe((contentTypesCollection) => {
        this.contentTypes = contentTypesCollection.items;
      });
  }

  public openContentTypeJsonDialog(contentType: ContentType): void {
    this.dialog.open(ContentTypeJsonComponent, {
      height: '400px',
      width: '600px',
      autoFocus: false,
      data: {
        contentTypeId: contentType.sys.id,
        contentTypeName: contentType.name,
      },
    });
  }
}
