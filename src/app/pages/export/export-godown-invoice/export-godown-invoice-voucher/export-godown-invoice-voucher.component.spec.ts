import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportGodownInvoiceVoucherComponent } from './export-godown-invoice-voucher.component';

describe('ExportGodownInvoiceVoucherComponent', () => {
  let component: ExportGodownInvoiceVoucherComponent;
  let fixture: ComponentFixture<ExportGodownInvoiceVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExportGodownInvoiceVoucherComponent]
    });
    fixture = TestBed.createComponent(ExportGodownInvoiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
