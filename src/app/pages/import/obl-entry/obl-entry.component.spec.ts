import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OblEntryComponent } from './obl-entry.component';

describe('OblEntryComponent', () => {
  let component: OblEntryComponent;
  let fixture: ComponentFixture<OblEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OblEntryComponent]
    });
    fixture = TestBed.createComponent(OblEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
