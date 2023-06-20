import { TestBed } from '@angular/core/testing';

import { ContentfulResolverService } from './contentful-resolver.service';

describe('ContentfulEntryResolverService', () => {
  let service: ContentfulResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentfulResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
