import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectShippingBillComponent } from './select-shipping-bill.component';

describe('SelectShippingBillComponent', () => {
  let component: SelectShippingBillComponent;
  let fixture: ComponentFixture<SelectShippingBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectShippingBillComponent]
    });
    fixture = TestBed.createComponent(SelectShippingBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
