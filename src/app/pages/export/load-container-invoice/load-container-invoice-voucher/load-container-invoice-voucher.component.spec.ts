import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadContainerInvoiceVoucherComponent } from './load-container-invoice-voucher.component';

describe('LoadContainerInvoiceVoucherComponent', () => {
  let component: LoadContainerInvoiceVoucherComponent;
  let fixture: ComponentFixture<LoadContainerInvoiceVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadContainerInvoiceVoucherComponent]
    });
    fixture = TestBed.createComponent(LoadContainerInvoiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
