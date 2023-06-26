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
  EntryProps,
  KeyValueMap,
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

    this.updateManagementEntryFields(managementEntry, entryFields);

    managementEntry = await this.cmaClient.entry.update(
      {
        entryId,
      },
      managementEntry
    );

    if (isPublish) {
      managementEntry = await this.publishEntry(managementEntry);
    }
  }

  public async addCategoryEntry(
    entryFields: Record<string, any>,
    isPublish = false
  ) {
    let managementEntry = <EntryProps<KeyValueMap>>{ fields: {} };

    this.updateManagementEntryFields(managementEntry, entryFields);

    managementEntry = await this.cmaClient.entry.create(
      {
        contentTypeId: 'category',
      },
      managementEntry
    );

    if (isPublish) {
      managementEntry = await this.publishEntry(managementEntry);
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

  private updateManagementEntryFields(
    managementEntry: EntryProps<KeyValueMap>,
    entryFields: Record<string, any>
  ) {
    for (let fieldName of ['title', 'description', 'image']) {
      this.addManagementEntryField(
        managementEntry,
        fieldName,
        entryFields[fieldName]
      );
    }
  }

  private async publishEntry(managementEntry: EntryProps<KeyValueMap>) {
    managementEntry = await this.cmaClient.entry.publish(
      { entryId: managementEntry.sys.id },
      managementEntry
    );

    // Cascade publish for image asset
    if (managementEntry.fields['image']) {
      await this.publishAsset(managementEntry.fields['image']['en-US'].sys.id);
    }
    return managementEntry;
  }

  private addManagementEntryField(
    managementEntry: EntryProps<KeyValueMap>,
    fieldName: string,
    fieldValue: any,
    locale = 'en-US'
  ): void {
    if (fieldValue === undefined) {
      return;
    }

    if (!managementEntry.fields[fieldName]) {
      managementEntry.fields[fieldName] = { [locale]: null };
    }

    managementEntry.fields[fieldName][locale] = fieldValue;
  }

  private async publishAsset(assetId: string): Promise<void> {
    const asset = await this.cmaClient.asset.get({ assetId });
    await this.cmaClient.asset.publish(
      {
        assetId,
      },
      asset
    );
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

  private getClient(isShowDraft: boolean): ContentfulClientApi<undefined> {
    return isShowDraft ? this.cpaClient : this.cdaClient;
  }
}
