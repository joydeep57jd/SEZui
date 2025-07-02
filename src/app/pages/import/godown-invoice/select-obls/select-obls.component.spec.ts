import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOblsComponent } from './select-obls.component';

describe('SelectOblsComponent', () => {
  let component: SelectOblsComponent;
  let fixture: ComponentFixture<SelectOblsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectOblsComponent]
    });
    fixture = TestBed.createComponent(SelectOblsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
