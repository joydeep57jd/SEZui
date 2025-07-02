import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadContainerRequestComponent } from './load-container-request.component';

describe('LoadContainerRequestComponent', () => {
  let component: LoadContainerRequestComponent;
  let fixture: ComponentFixture<LoadContainerRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadContainerRequestComponent]
    });
    fixture = TestBed.createComponent(LoadContainerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
