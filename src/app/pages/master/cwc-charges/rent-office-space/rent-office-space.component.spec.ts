import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentOfficeSpaceComponent } from './rent-office-space.component';

describe('RentOfficeSpaceComponent', () => {
  let component: RentOfficeSpaceComponent;
  let fixture: ComponentFixture<RentOfficeSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RentOfficeSpaceComponent]
    });
    fixture = TestBed.createComponent(RentOfficeSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
