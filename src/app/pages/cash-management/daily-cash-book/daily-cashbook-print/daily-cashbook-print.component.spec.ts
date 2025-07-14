import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCashbookPrintComponent } from './daily-cashbook-print.component';

describe('DailyCashbookPrintComponent', () => {
  let component: DailyCashbookPrintComponent;
  let fixture: ComponentFixture<DailyCashbookPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DailyCashbookPrintComponent]
    });
    fixture = TestBed.createComponent(DailyCashbookPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
