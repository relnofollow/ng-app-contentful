import { Injectable } from '@angular/core';
import { ContentTypeCollection, ContentType, createClient } from 'contentful';
import { PagingParameters } from 'src/app/models/PagingParameters';

const CONFIG = {
  space: '',
  accessToken: '',
  previewAccessToken: '',
  previewHost: '',
  contentTypeIds: {
    product: 'product',
  },
};

export type ContentfulEntriesQuery = {
  isDraft: boolean;
  titleFilter?: string;
  pagingParameters?: PagingParameters;
};

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private cdaClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken,
  });

  private cpaClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.previewAccessToken,
    host: CONFIG.previewHost,
  });

  constructor() {}

  public async getContentTypes(): Promise<ContentTypeCollection> {
    return this.cdaClient.getContentTypes();
  }

  public async getContentType(contentTypeId: string): Promise<ContentType> {
    return this.cdaClient.getContentType(contentTypeId);
  }

  public async getEntries({
    isDraft = false,
    titleFilter,
    pagingParameters,
  }: ContentfulEntriesQuery) {
    const client = isDraft ? this.cpaClient : this.cdaClient;
    const query = {};

    if (titleFilter) {
      Object.assign(query, {
        content_type: 'product',
        'fields.title[match]': titleFilter,
      });
    }

    if (pagingParameters) {
      const { pageSize, pageIndex } = pagingParameters;

      Object.assign(query, {
        skip: pageSize * pageIndex,
        limit: pageSize,
      });
    }

    return client.getEntries(query);
  }
}
