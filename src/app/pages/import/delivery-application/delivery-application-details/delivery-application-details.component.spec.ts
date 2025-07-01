import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryApplicationDetailsComponent } from './delivery-application-details.component';

describe('DeliveryApplicationDetailsComponent', () => {
  let component: DeliveryApplicationDetailsComponent;
  let fixture: ComponentFixture<DeliveryApplicationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeliveryApplicationDetailsComponent]
    });
    fixture = TestBed.createComponent(DeliveryApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
