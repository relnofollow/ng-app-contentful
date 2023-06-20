import { Component, Input, OnInit } from '@angular/core';
import { ContentTypeField } from 'contentful';
import { ContentfulResolverService } from 'src/app/services/contentful-resolver/contentful-resolver.service';
import { Document } from '@contentful/rich-text-types';

@Component({
  selector: 'app-contentful-field',
  templateUrl: './contentful-field.component.html',
  styleUrls: ['./contentful-field.component.scss'],
})
export class ContentfulFieldComponent implements OnInit {
  @Input({ required: true }) fieldValue!: Record<string, any>;
  @Input({ required: true }) contentTypeField!: ContentTypeField;

  public richText: string | undefined;

  constructor(private resolverService: ContentfulResolverService) {}

  public ngOnInit(): void {
    if (this.contentTypeField.type === 'RichText') {
      this.richText = this.resolverService.resolveRichText(
        <Document>this.fieldValue
      );
    }
  }
}
