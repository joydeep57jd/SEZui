import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerStuffingComponent } from './container-stuffing.component';

describe('ContainerStuffingComponent', () => {
  let component: ContainerStuffingComponent;
  let fixture: ComponentFixture<ContainerStuffingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContainerStuffingComponent]
    });
    fixture = TestBed.createComponent(ContainerStuffingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
