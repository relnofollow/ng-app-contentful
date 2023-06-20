import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeJsonComponent } from './content-type-json.component';

describe('ContentTypeJsonComponent', () => {
  let component: ContentTypeJsonComponent;
  let fixture: ComponentFixture<ContentTypeJsonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentTypeJsonComponent]
    });
    fixture = TestBed.createComponent(ContentTypeJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
