import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypesListComponent } from './content-types-list.component';

describe('ContentTypesListComponent', () => {
  let component: ContentTypesListComponent;
  let fixture: ComponentFixture<ContentTypesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentTypesListComponent]
    });
    fixture = TestBed.createComponent(ContentTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
