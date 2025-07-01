import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassPrintComponent } from './gate-pass-print.component';

describe('GatePassPrintComponent', () => {
  let component: GatePassPrintComponent;
  let fixture: ComponentFixture<GatePassPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GatePassPrintComponent]
    });
    fixture = TestBed.createComponent(GatePassPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
