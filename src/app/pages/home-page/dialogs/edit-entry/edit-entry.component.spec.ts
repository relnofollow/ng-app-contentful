import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntryComponent } from './edit-entry.component';

describe('EditEntryDialogComponent', () => {
  let component: EditEntryComponent;
  let fixture: ComponentFixture<EditEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEntryComponent],
    });
    fixture = TestBed.createComponent(EditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
