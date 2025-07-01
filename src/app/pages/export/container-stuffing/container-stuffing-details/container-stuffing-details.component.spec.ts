import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerStuffingDetailsComponent } from './container-stuffing-details.component';

describe('ContainerStuffingDetailsComponent', () => {
  let component: ContainerStuffingDetailsComponent;
  let fixture: ComponentFixture<ContainerStuffingDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContainerStuffingDetailsComponent]
    });
    fixture = TestBed.createComponent(ContainerStuffingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
