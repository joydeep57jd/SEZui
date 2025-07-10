import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectContainersComponent } from './select-containers.component';

describe('SelectContainersComponent', () => {
  let component: SelectContainersComponent;
  let fixture: ComponentFixture<SelectContainersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectContainersComponent]
    });
    fixture = TestBed.createComponent(SelectContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
