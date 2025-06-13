import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentTableSpaceComponent } from './rent-table-space.component';

describe('RentTableSpaceComponent', () => {
  let component: RentTableSpaceComponent;
  let fixture: ComponentFixture<RentTableSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RentTableSpaceComponent]
    });
    fixture = TestBed.createComponent(RentTableSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
