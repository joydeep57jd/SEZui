import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryFeesComponent } from './entry-fees.component';

describe('EntryFeesComponent', () => {
  let component: EntryFeesComponent;
  let fixture: ComponentFixture<EntryFeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntryFeesComponent]
    });
    fixture = TestBed.createComponent(EntryFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
