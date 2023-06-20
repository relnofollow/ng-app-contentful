import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEntryComponent } from './view-entry.component';

describe('ViewEntryComponent', () => {
  let component: ViewEntryComponent;
  let fixture: ComponentFixture<ViewEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEntryComponent]
    });
    fixture = TestBed.createComponent(ViewEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
