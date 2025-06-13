import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloadingLoadingComponent } from './unloading-loading.component';

describe('UnloadingLoadingComponent', () => {
  let component: UnloadingLoadingComponent;
  let fixture: ComponentFixture<UnloadingLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnloadingLoadingComponent]
    });
    fixture = TestBed.createComponent(UnloadingLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
