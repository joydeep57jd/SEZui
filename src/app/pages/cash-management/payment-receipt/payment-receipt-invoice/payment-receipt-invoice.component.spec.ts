import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReceiptInvoiceComponent } from './payment-receipt-invoice.component';

describe('PaymentReceiptInvoiceComponent', () => {
  let component: PaymentReceiptInvoiceComponent;
  let fixture: ComponentFixture<PaymentReceiptInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaymentReceiptInvoiceComponent]
    });
    fixture = TestBed.createComponent(PaymentReceiptInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
