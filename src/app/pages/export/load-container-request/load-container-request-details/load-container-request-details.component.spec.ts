import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadContainerRequestDetailsComponent } from './load-container-request-details.component';

describe('LoadContainerRequestDetailsComponent', () => {
  let component: LoadContainerRequestDetailsComponent;
  let fixture: ComponentFixture<LoadContainerRequestDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadContainerRequestDetailsComponent]
    });
    fixture = TestBed.createComponent(LoadContainerRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
