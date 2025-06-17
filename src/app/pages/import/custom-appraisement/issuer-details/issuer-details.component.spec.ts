import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerDetailsComponent } from './issuer-details.component';

describe('IssuerDetailsComponent', () => {
  let component: IssuerDetailsComponent;
  let fixture: ComponentFixture<IssuerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IssuerDetailsComponent]
    });
    fixture = TestBed.createComponent(IssuerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
