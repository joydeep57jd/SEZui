import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadContainerInvoiceComponent } from './load-container-invoice.component';

describe('LoadContainerInvoiceComponent', () => {
  let component: LoadContainerInvoiceComponent;
  let fixture: ComponentFixture<LoadContainerInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadContainerInvoiceComponent]
    });
    fixture = TestBed.createComponent(LoadContainerInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
