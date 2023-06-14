import { Component, OnInit } from '@angular/core';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { ContentType } from 'contentful';
import { MatDialog } from '@angular/material/dialog';
import { ContentTypeJsonComponent } from '../content-type-json/content-type-json.component';

@Component({
  selector: 'app-content-types-list',
  templateUrl: './content-types-list.component.html',
  styleUrls: ['./content-types-list.component.scss'],
})
export class ContentTypesListComponent implements OnInit {
  public contentTypes: ContentType[] = [];
  public columnsToDisplay = ['name', 'fields', 'json'];

  constructor(
    private contentfulService: ContentfulService,
    private dialog: MatDialog
  ) {}

  public async ngOnInit() {
    const contentTypesCollection =
      await this.contentfulService.getContentTypes();
    this.contentTypes = contentTypesCollection.items;
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
