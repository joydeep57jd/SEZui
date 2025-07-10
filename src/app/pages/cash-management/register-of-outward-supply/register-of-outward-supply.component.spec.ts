import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOfOutwardSupplyComponent } from './register-of-outward-supply.component';

describe('RegisterOfOutwardSupplyComponent', () => {
  let component: RegisterOfOutwardSupplyComponent;
  let fixture: ComponentFixture<RegisterOfOutwardSupplyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterOfOutwardSupplyComponent]
    });
    fixture = TestBed.createComponent(RegisterOfOutwardSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
