import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarnsportationComponent } from './tarnsportation.component';

describe('TarnsportationComponent', () => {
  let component: TarnsportationComponent;
  let fixture: ComponentFixture<TarnsportationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TarnsportationComponent]
    });
    fixture = TestBed.createComponent(TarnsportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
