import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportGodownInvoiceComponent } from './export-godown-invoice.component';

describe('ExportGodownInvoiceComponent', () => {
  let component: ExportGodownInvoiceComponent;
  let fixture: ComponentFixture<ExportGodownInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExportGodownInvoiceComponent]
    });
    fixture = TestBed.createComponent(ExportGodownInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
