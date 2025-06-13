import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CwcChargesComponent } from './cwc-charges.component';

describe('CwcChargesComponent', () => {
  let component: CwcChargesComponent;
  let fixture: ComponentFixture<CwcChargesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CwcChargesComponent]
    });
    fixture = TestBed.createComponent(CwcChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
