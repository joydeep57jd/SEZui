import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCashBookComponent } from './daily-cash-book.component';

describe('DailyCashBookComponent', () => {
  let component: DailyCashBookComponent;
  let fixture: ComponentFixture<DailyCashBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DailyCashBookComponent]
    });
    fixture = TestBed.createComponent(DailyCashBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
