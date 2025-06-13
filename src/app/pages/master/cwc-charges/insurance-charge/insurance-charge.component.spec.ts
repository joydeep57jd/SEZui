import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceChargeComponent } from './insurance-charge.component';

describe('InsuranceChargeComponent', () => {
  let component: InsuranceChargeComponent;
  let fixture: ComponentFixture<InsuranceChargeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InsuranceChargeComponent]
    });
    fixture = TestBed.createComponent(InsuranceChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
