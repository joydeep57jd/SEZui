import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestuffingEntryDetailsComponent } from './destuffing-entry-details.component';

describe('DestuffingEntryDetailsComponent', () => {
  let component: DestuffingEntryDetailsComponent;
  let fixture: ComponentFixture<DestuffingEntryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DestuffingEntryDetailsComponent]
    });
    fixture = TestBed.createComponent(DestuffingEntryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
