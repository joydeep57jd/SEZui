import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateExitDetailsComponent } from './gate-exit-details.component';

describe('GateExitDetailsComponent', () => {
  let component: GateExitDetailsComponent;
  let fixture: ComponentFixture<GateExitDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GateExitDetailsComponent]
    });
    fixture = TestBed.createComponent(GateExitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
