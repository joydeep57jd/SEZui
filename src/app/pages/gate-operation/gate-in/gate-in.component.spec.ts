import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateInComponent } from './gate-in.component';

describe('GateInComponent', () => {
  let component: GateInComponent;
  let fixture: ComponentFixture<GateInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GateInComponent]
    });
    fixture = TestBed.createComponent(GateInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
