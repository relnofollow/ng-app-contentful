import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import {
  ContentfulClientApi,
  ContentTypeCollection,
  ContentType,
  createClient,
  Entry,
} from 'contentful';
import {
  AssetProps,
  createClient as createManagementClient,
} from 'contentful-management';
import { PagingParameters } from 'src/app/models/PagingParameters';

const CONFIG = {
  space: '',
  environment: '',
  accessToken: '',
  previewAccessToken: '',
  personalAccessToken: '',
  previewHost: '',
};

export type ContentfulEntriesQuery = {
  isDraft: boolean;
  contentTypeId: string | null;
  titleFilter?: string;
  pagingParameters?: PagingParameters;
  order: SortDirection;
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

  private cmaClient = createManagementClient(
    {
      accessToken: CONFIG.personalAccessToken,
    },
    {
      type: 'plain',
      defaults: {
        spaceId: CONFIG.space,
        environmentId: CONFIG.environment,
      },
    }
  );

  constructor() {}

  public async getContentTypes(): Promise<ContentTypeCollection> {
    return this.cdaClient.getContentTypes();
  }

  public async getContentType(contentTypeId: string): Promise<ContentType> {
    return this.cdaClient.getContentType(contentTypeId);
  }

  public async getEntries({
    isDraft = false,
    contentTypeId,
    titleFilter,
    pagingParameters,
    order,
  }: ContentfulEntriesQuery) {
    const client = this.getClient(isDraft);
    const query = {};

    if (contentTypeId) {
      Object.assign(query, {
        content_type: contentTypeId,
      });

      if (titleFilter) {
        Object.assign(query, {
          'fields.title[match]': titleFilter,
        });
      }
    }

    if (pagingParameters) {
      const { pageSize, pageIndex } = pagingParameters;

      Object.assign(query, {
        skip: pageSize * pageIndex,
        limit: pageSize,
      });
    }

    Object.assign(query, {
      order: `${order === 'desc' ? '-' : ''}sys.updatedAt`,
    });

    return client.getEntries(query);
  }

  public getEntry(entryId: string, isDraft: boolean): Promise<Entry> {
    const client = this.getClient(isDraft);

    return client.getEntry(entryId);
  }

  public async updateCategoryEntry(
    entryId: string,
    entryFields: Record<string, any>,
    isPublish = false
  ) {
    let managementEntry = await this.cmaClient.entry.get({ entryId });

    managementEntry.fields['title']['en-US'] = entryFields['title'];
    managementEntry.fields['description']['en-US'] = entryFields['description'];

    // TODO: update image wisely
    // managementEntry.fields['image']['en-US'] = entryFields['image'];

    managementEntry = await this.cmaClient.entry.update(
      {
        entryId,
      },
      managementEntry
    );

    if (isPublish) {
      await this.cmaClient.entry.publish({ entryId }, managementEntry);
    }
  }

  public async createAsset(file: File): Promise<AssetProps> {
    const arrayBuffer = await this.readFileAsArrayBuffer(file);

    const uploadResult = await this.cmaClient.upload.create(
      {},
      { file: arrayBuffer }
    );

    const asset = await this.cmaClient.asset.create(
      {},
      {
        fields: {
          title: {
            'en-US': file.name,
          },
          file: {
            'en-US': {
              contentType: file.type,
              fileName: file.name,
              uploadFrom: {
                sys: {
                  type: 'Link',
                  linkType: 'Upload',
                  id: uploadResult.sys.id,
                },
              },
            },
          },
        },
      }
    );

    return this.cmaClient.asset.processForAllLocales({}, asset);
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('loadend', () => {
        if (reader.result) {
          resolve(<ArrayBuffer>reader.result);
          return;
        }

        reject(reader.error);
      });

      reader.readAsArrayBuffer(file);
    });
  }

  private getClient(isCPA: boolean): ContentfulClientApi<undefined> {
    return isCPA ? this.cpaClient : this.cdaClient;
  }
}
