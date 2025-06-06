import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateExitComponent } from './gate-exit.component';

describe('GateExitComponent', () => {
  let component: GateExitComponent;
  let fixture: ComponentFixture<GateExitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GateExitComponent]
    });
    fixture = TestBed.createComponent(GateExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
