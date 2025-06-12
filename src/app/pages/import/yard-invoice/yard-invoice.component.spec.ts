import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YardInvoiceComponent } from './yard-invoice.component';

describe('YardInvoiceComponent', () => {
  let component: YardInvoiceComponent;
  let fixture: ComponentFixture<YardInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [YardInvoiceComponent]
    });
    fixture = TestBed.createComponent(YardInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
