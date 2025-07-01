import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcinEntryComponent } from './ccin-entry.component';

describe('CcinEntryComponent', () => {
  let component: CcinEntryComponent;
  let fixture: ComponentFixture<CcinEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CcinEntryComponent]
    });
    fixture = TestBed.createComponent(CcinEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
