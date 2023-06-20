import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentfulFieldComponent } from './contentful-field.component';

describe('ContentfulFieldComponent', () => {
  let component: ContentfulFieldComponent;
  let fixture: ComponentFixture<ContentfulFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentfulFieldComponent]
    });
    fixture = TestBed.createComponent(ContentfulFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
