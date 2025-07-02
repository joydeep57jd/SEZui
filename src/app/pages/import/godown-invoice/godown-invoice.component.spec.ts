import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownInvoiceComponent } from './godown-invoice.component';

describe('GodownInvoiceComponent', () => {
  let component: GodownInvoiceComponent;
  let fixture: ComponentFixture<GodownInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GodownInvoiceComponent]
    });
    fixture = TestBed.createComponent(GodownInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
