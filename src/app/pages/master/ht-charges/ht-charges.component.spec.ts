import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtChargesComponent } from './ht-charges.component';

describe('HtChargesComponent', () => {
  let component: HtChargesComponent;
  let fixture: ComponentFixture<HtChargesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HtChargesComponent]
    });
    fixture = TestBed.createComponent(HtChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
