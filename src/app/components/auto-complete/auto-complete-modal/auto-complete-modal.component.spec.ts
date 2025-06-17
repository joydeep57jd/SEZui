import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteModalComponent } from './auto-complete-modal.component';

describe('AutoCompleteModalComponent', () => {
  let component: AutoCompleteModalComponent;
  let fixture: ComponentFixture<AutoCompleteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutoCompleteModalComponent]
    });
    fixture = TestBed.createComponent(AutoCompleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
