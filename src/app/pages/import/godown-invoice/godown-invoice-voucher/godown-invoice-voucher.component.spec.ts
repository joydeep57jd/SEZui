import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownInvoiceVoucherComponent } from './godown-invoice-voucher.component';

describe('GodownInvoiceVoucherComponent', () => {
  let component: GodownInvoiceVoucherComponent;
  let fixture: ComponentFixture<GodownInvoiceVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GodownInvoiceVoucherComponent]
    });
    fixture = TestBed.createComponent(GodownInvoiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
