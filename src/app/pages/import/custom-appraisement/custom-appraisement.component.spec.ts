import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAppraisementComponent } from './custom-appraisement.component';

describe('CustomAppraisementComponent', () => {
  let component: CustomAppraisementComponent;
  let fixture: ComponentFixture<CustomAppraisementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomAppraisementComponent]
    });
    fixture = TestBed.createComponent(CustomAppraisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
