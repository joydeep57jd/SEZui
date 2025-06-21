import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YardInvoiceVoucherComponent } from './yard-invoice-voucher.component';

describe('YardInvoiceVoucherComponent', () => {
  let component: YardInvoiceVoucherComponent;
  let fixture: ComponentFixture<YardInvoiceVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [YardInvoiceVoucherComponent]
    });
    fixture = TestBed.createComponent(YardInvoiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
