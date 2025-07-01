import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryApplicationComponent } from './delivery-application.component';

describe('DeliveryApplicationComponent', () => {
  let component: DeliveryApplicationComponent;
  let fixture: ComponentFixture<DeliveryApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeliveryApplicationComponent]
    });
    fixture = TestBed.createComponent(DeliveryApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
