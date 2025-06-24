import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassDetailsComponent } from './gate-pass-details.component';

describe('GatePassDetailsComponent', () => {
  let component: GatePassDetailsComponent;
  let fixture: ComponentFixture<GatePassDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GatePassDetailsComponent]
    });
    fixture = TestBed.createComponent(GatePassDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
