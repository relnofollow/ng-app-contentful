import { Injectable } from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { ContentTypeField } from 'contentful';
import { Document } from '@contentful/rich-text-types';

@Injectable({
  providedIn: 'root',
})
export class ContentfulResolverService {
  public resolveRichText(fieldValue: Document): string {
    return documentToHtmlString(fieldValue);
  }
}
