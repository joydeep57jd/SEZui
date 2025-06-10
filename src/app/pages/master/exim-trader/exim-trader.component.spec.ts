import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EximTraderComponent } from './exim-trader.component';

describe('EximTraderComponent', () => {
  let component: EximTraderComponent;
  let fixture: ComponentFixture<EximTraderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EximTraderComponent]
    });
    fixture = TestBed.createComponent(EximTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
