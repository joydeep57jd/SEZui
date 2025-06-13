import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageChargeComponent } from './storage-charge.component';

describe('StorageChargeComponent', () => {
  let component: StorageChargeComponent;
  let fixture: ComponentFixture<StorageChargeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StorageChargeComponent]
    });
    fixture = TestBed.createComponent(StorageChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
