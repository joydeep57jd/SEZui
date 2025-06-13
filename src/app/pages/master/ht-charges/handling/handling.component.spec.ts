import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandlingComponent } from './handling.component';

describe('HandlingComponent', () => {
  let component: HandlingComponent;
  let fixture: ComponentFixture<HandlingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HandlingComponent]
    });
    fixture = TestBed.createComponent(HandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
