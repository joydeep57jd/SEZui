import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestuffingEntryComponent } from './destuffing-entry.component';

describe('DestuffingEntryComponent', () => {
  let component: DestuffingEntryComponent;
  let fixture: ComponentFixture<DestuffingEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DestuffingEntryComponent]
    });
    fixture = TestBed.createComponent(DestuffingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
