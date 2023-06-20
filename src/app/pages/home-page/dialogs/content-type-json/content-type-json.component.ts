import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { ContentType } from 'contentful';

@Component({
  selector: 'app-content-type-json',
  templateUrl: './content-type-json.component.html',
  styleUrls: ['./content-type-json.component.scss'],
})
export class ContentTypeJsonComponent implements OnInit {
  public contentType: ContentType | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { contentTypeId: string; contentTypeName: string },
    private contentfulService: ContentfulService
  ) {}

  public async ngOnInit(): Promise<void> {
    this.contentType = await this.contentfulService.getContentType(
      this.data.contentTypeId
    );
  }
}
