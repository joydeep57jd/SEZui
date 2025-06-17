import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerDetailsComponent } from './container-details.component';

describe('ContainerDetailsComponent', () => {
  let component: ContainerDetailsComponent;
  let fixture: ComponentFixture<ContainerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContainerDetailsComponent]
    });
    fixture = TestBed.createComponent(ContainerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
