import { Injectable } from '@angular/core';
import { ContentTypeCollection, ContentType, createClient } from 'contentful';

const CONFIG = {
  space: '',
  accessToken: '',

  contentTypeIds: {
    product: 'product',
  },
};

// interface ProductSkeleton {
//   contentTypeId: 'product';
//   fields: Product;
// }

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private cdaClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken,
  });

  constructor() {}

  // public getProducts(
  //   query?: EntriesQueries<ProductSkeleton, undefined>
  // ): Promise<Product[]> {
  //   return this.cdaClient
  //     .getEntries<ProductSkeleton>(
  //       Object.assign(
  //         {
  //           content_type: CONFIG.contentTypeIds.product,
  //         },
  //         query
  //       )
  //     )
  //     .then((res) => res.items.map((item) => item.fields));
  // }

  public async getContentTypes(): Promise<ContentTypeCollection> {
    return this.cdaClient.getContentTypes();
  }

  public async getContentType(contentTypeId: string): Promise<ContentType> {
    return this.cdaClient.getContentType(contentTypeId);
  }
}
